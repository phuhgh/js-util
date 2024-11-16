#pragma once

#include "JsUtil/ResizableArray.hpp"
#include "Number.hpp"
#include <cstdint>
#include <optional>
#include <utility>

namespace JsUtil
{

template <typename TKey, typename TValue, typename THash = std::hash<TKey>>
class HashMap
{
  public:
    HashMap(uint32_t initialPoolSize = 17)
        : m_data(initialPoolSize)
    {
    }

    HashMap(std::initializer_list<std::pair<TKey, TValue>> initializerList)
        : m_data(JsUtil::getNextDoublingPrime(initializerList.size()))
    {
        // check if we could allocate, don't try to insert anything if all of it won't fit
        if (m_data.size() >= initializerList.size())
        {
            for (auto const& [k, v] : initializerList)
            {
                insert(k, v);
            }
        }
    }

    bool     empty() const noexcept { return size() == 0; }
    uint32_t size() const noexcept { return m_occupiedSlots; }
    uint32_t capacity() const noexcept { return m_data.size(); }

    /// @return pointer to the inserted item, else nullptr if the insertion failed
    template <typename TInsertValue = TValue>
    TValue* insert(TKey const& key, TInsertValue&& value)
    {
        auto const maxOccupied = static_cast<uint32_t>(m_data.size() * 0.75);
        if (m_occupiedSlots >= maxOccupied)
        {
            resize();
        }

        auto* insertedItem = insertImpl(key, std::forward<TInsertValue>(value), m_data);

        if (insertedItem)
        {
            ++m_occupiedSlots;
        }

        return insertedItem;
    }

    /// @return a pointer to the value if present, else nullptr
    TValue* find(TKey const& key)
    {
        size_t index = m_hash(key) % m_data.size();

        for (size_t i = 0; i < m_data.size(); ++i)
        {
            auto& existingValue = m_data[(index + i) % m_data.size()];

            if (!existingValue)
            {
                return nullptr;
            }
            if (existingValue->first == key)
            {
                return &existingValue->second;
            }
        }

        return nullptr;
    }
    /// @return a pointer to the value if present, else nullptr
    TValue const* find(TKey const& key) const
    {
        size_t index = m_hash(key) % m_data.size();

        for (size_t i = 0; i < m_data.size(); ++i)
        {
            auto const& existingValue = m_data[(index + i) % m_data.size()];

            if (!existingValue)
            {
                return nullptr;
            }
            if (existingValue->first == key)
            {
                return &existingValue->second;
            }
        }

        return nullptr;
    }

    /// @return true if deleted, else false
    bool erase(TKey const& key)
    {
        size_t index = m_hash(key) % m_data.size();

        for (size_t i = 0; i < m_data.size(); ++i)
        {
            auto& existingValue = m_data[(index + i) % m_data.size()];

            if (!existingValue)
            {
                return false;
            }
            if (existingValue->first == key)
            {
                --m_occupiedSlots;
                existingValue.reset();
                return true;
            }
        }

        return false;
    }

  private:
    template <typename TInsertValue = TValue>
    TValue* insertImpl(
        TKey const&                                             key,
        TInsertValue&&                                          value,
        ResizableArray<std::optional<std::pair<TKey, TValue>>>& o_data
    )
    {
        size_t index = m_hash(key) % o_data.size();

        for (size_t i = 0; i < o_data.size(); ++i)
        {
            std::optional<std::pair<TKey, TValue>>& existingValue = o_data[(index + i) % o_data.size()];

            if (!existingValue || existingValue->first == key)
            {
                existingValue = std::make_optional(std::make_pair(key, std::forward<TInsertValue>(value)));
                return &existingValue->second;
            }
        }

        return nullptr;
    }

    void resize()
    {
        auto nextDoublePrime = JsUtil::getNextDoublingPrime(m_data.size() * 2);
        ResizableArray<std::optional<std::pair<TKey, TValue>>> replacement(nextDoublePrime);

        if (replacement.size() != 0)
        {
            for (auto& item : m_data.asSpan())
            {
                if (item)
                {
                    insertImpl(item->first, std::move(item->second), replacement);
                }
            }

            m_data = std::move(replacement);
        }
    }

    ResizableArray<std::optional<std::pair<TKey, TValue>>> m_data;
    THash                                                  m_hash{};
    uint32_t                                               m_occupiedSlots{0};
};

} // namespace JsUtil
