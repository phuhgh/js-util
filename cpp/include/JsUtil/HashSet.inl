#pragma once

namespace JsUtil
{

template <typename T, typename TSize>
template <bool IsConst>
HashSet<T, TSize>::iterator<IsConst>::iterator(TTable* table, TSize bucketIndex, TNode* node)
    : m_table(table)
    , m_bucketIndex(bucketIndex)
    , m_currentNode(node)
{
    // having gone to the trouble of supporting non-const iterators, it's a terrible idea...
    advanceToNextValid();
}

template <typename T, typename TSize>
template <bool IsConst>
typename HashSet<T, TSize>::template iterator<IsConst>& HashSet<T, TSize>::iterator<IsConst>::operator++()
{
    if (m_currentNode)
    {
        m_currentNode = m_currentNode->next;
    }
    advanceToNextValid();
    return *this;
}

template <typename T, typename TSize>
template <bool IsConst>
bool HashSet<T, TSize>::iterator<IsConst>::operator!=(iterator const& other) const
{
    return m_currentNode != other.m_currentNode || m_bucketIndex != other.m_bucketIndex;
}

template <typename T, typename TSize>
template <bool IsConst>
void HashSet<T, TSize>::iterator<IsConst>::advanceToNextValid()
{
    while (!m_currentNode && m_bucketIndex < m_table->size())
    {
        ++m_bucketIndex;
        if (m_bucketIndex < m_table->size())
        {
            m_currentNode = (*m_table)[m_bucketIndex].head();
        }
    }
}

template <typename T, typename TSize>
bool HashSet<T, TSize>::contains(T const& key) const
{
    auto const& table = m_table[getTableIndex(key)];
    return table.contains(key);
}

template <typename T, typename TSize>
template <typename TKey>
bool HashSet<T, TSize>::insert(TKey&& key)
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

template <typename T, typename TSize>
bool HashSet<T, TSize>::erase(T const& key)
{
    auto removed = m_table[getTableIndex(key)].erase(key);

    if (removed)
    {
        --m_occupiedSlots;
    }

    return removed;
}

template <typename T, typename TSize>
void HashSet<T, TSize>::rehash()
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

template <typename T, typename TSize>
template <typename TKey>
bool HashSet<T, TSize>::insertImpl(TKey&& key, ResizableArray<LinkedList<T>>& o_table)
{
    auto& table = o_table[getTableIndex(key)];

    if (table.contains(key))
    {
        return false;
    }

    table.append(std::forward<TKey>(key));
    return true;
}

} // namespace JsUtil