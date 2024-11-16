#pragma once

#include "JsUtil/Debug.hpp"
#include <gsl/pointers>
#include <new>

namespace JsUtil
{

template <typename T>
class LinkedList
{
  public:
    struct Node
    {
        T                 data;
        gsl::owner<Node*> next; // NOLINT(cppcoreguidelines-owning-memory) - node itself is just by value

        template <typename TData = T>
        explicit Node(TData&& val) // NOLINT(*-forwarding-reference-overload) - fortunately, we don't need copy...
            : data(std::forward<TData>(val))
            , next(nullptr)
        {
        }
    };

    ~LinkedList()
    {
        gsl::owner<Node*> node = m_head;
        while (node)
        {
            Node* nextNode = node->next;
            delete node;
            node = static_cast<gsl::owner<Node*>>(nextNode);
        }
    }

    LinkedList() = default;

    LinkedList(LinkedList&& other) noexcept
    {
        if (&other != this)
        {
            m_head = other.m_head;
            m_tail = other.m_tail;
            other.m_head = other.m_tail = nullptr;
        }
    }
    LinkedList& operator=(LinkedList&& other) noexcept
    {
        if (&other != this)
        {
            m_head = other.m_head;
            m_tail = other.m_tail;
            other.m_head = other.m_tail = nullptr;
        }

        return *this;
    }

    LinkedList(LinkedList const& other)
    {
        if (&other != this)
        {
            reset();
            // insert sets all of this, so we don't need to touch these after...
            m_head = nullptr;
            m_tail = nullptr;

            for (auto otherNode = other.m_head; otherNode != nullptr; otherNode = otherNode->next)
            {
                if (!append(otherNode->data))
                {
                    reset();
                    // we don't want half of the data, clear it out...
                    break;
                }
            }
        }
    };

    LinkedList& operator=(LinkedList const& other)
    {
        if (&other != this)
        {
            for (auto node = m_head; node != nullptr; node = node->next)
            {
                delete node;
            }
            m_head = nullptr;
            m_tail = nullptr;

            for (auto otherNode = other.m_head; otherNode != nullptr; otherNode = otherNode->next)
            {
                if (!append(otherNode->data))
                {
                    break;
                }
            }
        }

        return *this;
    }

    Node const* head() const { return m_head; };
    Node*       head() { return m_head; };
    Node const* tail() const { return m_tail; };
    Node*       tail() { return m_tail; };
    bool        empty() const { return m_head == nullptr; }
    size_t      size() const { return m_size; }

    bool contains(T const& key) const
    {
        for (Node* node = m_head; node != nullptr; node = node->next)
        {
            if (node->data == key)
            {
                return true;
            }
        }

        return false;
    }

    template <typename TData>
    bool append(TData&& data)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        gsl::owner<Node*> newNode = new (std::nothrow) Node(std::forward<TData>(data)); // NOLINT(*-use-auto)
        if (newNode == nullptr)
        {
            return false;
        }

        if (m_tail == nullptr)
        {
            // it's the first node
            m_head = newNode;
            m_tail = newNode;
        }
        else
        {
            m_tail->next = newNode;
            m_tail = newNode;
        }

        ++m_size;
        return true;
    }

    template <typename TData>
    bool prepend(TData&& key)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        gsl::owner<Node*> newNode = new (std::nothrow) Node(std::forward<TData>(key)); // NOLINT(*-use-auto)
        if (newNode == nullptr)
        {
            return false;
        }

        if (m_head == nullptr)
        {
            // it's the first node
            m_head = newNode;
            m_tail = newNode;
        }
        else
        {
            auto prevHead = m_head;
            m_head = newNode;
            newNode->next = prevHead;
        }

        ++m_size;
        return true;
    }

    bool erase(T const& key)
    {
        Node* current = m_head;
        Node* prev = nullptr;

        while (current != nullptr)
        {
            if (current->data == key)
            {
                if (prev)
                {
                    prev->next = current->next;
                }
                else
                {
                    m_head = static_cast<gsl::owner<Node*>>(current->next);
                }

                if (current == m_tail)
                {
                    m_tail = prev;
                }

                delete current; // NOLINT(*-owning-memory)
                --m_size;
                return true;
            }

            prev = current;
            current = current->next;
        }

        return false;
    }

  private:
    gsl::owner<Node*> m_head{nullptr};
    Node*             m_tail{nullptr};
    size_t            m_size{0};

    void reset()
    {
        for (auto node = m_head; node != nullptr; node = node->next)
        {
            delete node;
        }

        m_head = nullptr;
        m_tail = nullptr;
        m_size = 0;
    }
};

} // namespace JsUtil
