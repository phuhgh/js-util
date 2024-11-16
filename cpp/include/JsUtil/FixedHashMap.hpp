#pragma once

#include "JsUtil/ResizableArray.hpp"
#include <optional>

namespace JsUtil
{

/// An extremely basic hash map, with fixed allocation
/// When choosing a size, prime numbers are good...
template <typename TKey, typename TValue, size_t Size, typename THash = std::hash<TKey>>
class FixedHashMap
{
  public:
    /// @return pointer to the inserted item, else nullptr if the insertion failed
    template <typename TInsertValue = TValue>
    TValue* insert(TKey const& key, TInsertValue&& value)
    {
        size_t index = m_hash(key) % m_data.size();

        for (size_t i = 0; i < m_data.size(); ++i)
        {
            std::optional<std::pair<TKey, TValue>>& existingValue = m_data[(index + i) % m_data.size()];

            if (!existingValue || existingValue->first == key)
            {
                existingValue = std::make_optional(std::make_pair(key, std::forward<TInsertValue>(value)));
                return &existingValue->second;
            }
        }

        return nullptr;
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
                existingValue.reset();
                return true;
            }
        }

        return false;
    }

  private:
    std::array<std::optional<std::pair<TKey, TValue>>, Size> m_data{};
    THash                                                    m_hash{};
};

} // namespace JsUtil
