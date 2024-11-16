#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/LinkedList.hpp"
#include "JsUtil/Number.hpp"
#include "JsUtil/ResizableArray.hpp"
#include <utility>

namespace JsUtil
{

/**
 * @brief like std::set, but doesn't throw if allocation fails.
 * @remarks When copying, you need to check that the copy is not empty (allocation failed).
 */
template <typename T, typename TSize = std::uint32_t>
class HashSet
{
  public:
    explicit HashSet(TSize tableSize = 59)
        : m_table(tableSize)
    {
    }

    TSize size() { return m_occupiedSlots; }
    bool  empty() { return m_occupiedSlots == 0; }
    TSize capacity() { return m_table.size(); }

    bool contains(T const& key) const
    {
        auto const& table = m_table[getTableIndex(key)];
        return table.contains(key);
    }

    template <typename TKey = T>
    bool insert(TKey&& key)
    {
        auto added = insertImpl(std::forward<TKey>(key), m_table);

        if (added)
        {
            ++m_occupiedSlots;

            if (m_occupiedSlots > m_table.size() * 0.75)
            {
                rehash();
            }
        }

        return added;
    }

    bool erase(T const& key)
    {
        auto removed = m_table[getTableIndex(key)].erase(key);

        if (removed)
        {
            --m_occupiedSlots;
        }

        return removed;
    }

  private:
    TSize getTableIndex(T const& key) const { return m_hash(key) % m_table.size(); }

    void rehash()
    {
        auto nextDoublePrime = JsUtil::getNextDoublingPrime(m_table.size() * 2);
        auto replacement = ResizableArray<LinkedList<T>>(nextDoublePrime);

        if (replacement.size() == 0)
        {
            // the allocation failed
            if constexpr (Debug::isDebug())
            {
                Debug::verboseLog("failed to resize HashSet...");
            }
            return;
        }

        for (auto& bucket : m_table.asSpan())
        {
            for (auto* node = bucket.head(); node != nullptr; node = node->next)
            {
                insertImpl(std::move(node->data), replacement);
            }
        }

        m_table = std::move(replacement);
    }

    template <typename TKey = T>
    bool insertImpl(TKey&& key, ResizableArray<LinkedList<T>>& o_table)
    {
        auto& table = o_table[getTableIndex(key)];

        if (table.contains(key))
        {
            return false;
        }

        table.append(std::forward<TKey>(key));
        return true;
    }

    ResizableArray<LinkedList<T>, TSize> m_table;
    TSize                                m_occupiedSlots{0};
    std::hash<T>                         m_hash{};
};

} // namespace JsUtil