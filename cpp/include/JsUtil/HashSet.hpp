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
 * @remark  Does NOT support keys changing!
 */
template <typename T, typename TSize = std::uint32_t>
class HashSet
{
  public:
    explicit HashSet(TSize tableSize = 59)
        : m_table(tableSize)
    {
    }

    template <bool IsConst>
    class iterator
    {
      public:
        using TTable = std::
            conditional_t<IsConst, ResizableArray<LinkedList<T>, TSize> const, ResizableArray<LinkedList<T>, TSize>>;
        using TRef = std::conditional_t<IsConst, T const&, T&>;
        using TNode = std::conditional_t<IsConst, typename LinkedList<T>::Node const, typename LinkedList<T>::Node*>;

        iterator(TTable* table, TSize bucketIndex, TNode* node);

        TRef operator*() const { return m_currentNode->data; }

        iterator& operator++();

        bool operator!=(iterator const& other) const;

      private:
        TTable* m_table;
        TSize   m_bucketIndex;
        TNode*  m_currentNode;

        void advanceToNextValid();
    };

    using const_iterator_t = iterator<true>;

    const_iterator_t begin() const { return iterator<true>(&m_table, 0, m_table[0].head()); }
    const_iterator_t end() const { return iterator<true>(&m_table, m_table.size(), nullptr); }

    TSize size() { return m_occupiedSlots; }
    bool  empty() { return m_occupiedSlots == 0; }
    TSize capacity() { return m_table.size(); }

    bool contains(T const& key) const;

    template <typename TKey = T>
    bool insert(TKey&& key);

    bool erase(T const& key);

  private:
    TSize getTableIndex(T const& key) const { return m_hash(key) % m_table.size(); }

    void rehash();

    template <typename TKey = T>
    bool insertImpl(TKey&& key, ResizableArray<LinkedList<T>>& o_table);

    ResizableArray<LinkedList<T>, TSize> m_table;
    TSize                                m_occupiedSlots{0};
    std::hash<T>                         m_hash{};
};

} // namespace JsUtil

#include "JsUtil/HashSet.inl"