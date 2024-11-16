#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/HashMap.hpp"
#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include "JsUtil/TypeTraits.hpp"
#include <atomic>
#include <cstdint>

namespace JsUtil
{

namespace Impl // meta programming "stuff"
{
struct CategoryToken
{
};
struct SpecializationToken
{
};
} // namespace Impl

using TInteropId = std::uint16_t;

/// Provides unique numbers in a way which is safe statically across translation units.
template <WithUnsigned TNumber = std::uint32_t>
class IdFactory
{
  public:
    TNumber generateId() noexcept;

  private:
    std::atomic<TNumber> m_counter{1};
};

extern IdFactory<> sID_FACTORY;

class StableIdKey
{
  public:
    explicit constexpr StableIdKey(char const* name)
        : m_name(name)
    {
    }

    char const* getName() const noexcept { return m_name; }

  private:
    char const* m_name;
};

template <typename T>
concept WithStableIdKey = std::is_base_of_v<StableIdKey, T>;

extern IdFactory<uint8_t> sID_CATEGORY_FACTORY;

/**
 * @brief Represents a conceptual category, e.g. buffer, which can then be specialized via `IdSpecialization` (e.g.
 * interleaved buffer).
 */
template <typename Token>
struct IdCategory
    : StableIdKey
    , Impl::CategoryToken
{
    using TToken = Token;

    constexpr IdCategory(char const* name)
        : StableIdKey(name)
    {
    }
};

template <typename T>
concept WithCategoryKey = std::is_base_of_v<Impl::CategoryToken, T>;

/**
 * @brief Represents a specialization of an `IdCategory`, e.g. interleaved buffer, which is a specialization of buffer.
 */
template <typename, WithCategoryKey Category>
struct IdSpecialization
    : StableIdKey
    , Impl::SpecializationToken
{
    using TCategory = Category;

    constexpr IdSpecialization(TCategory const& category, char const* name)
        : StableIdKey(name)
        , category(&category)
    {
    }

    TCategory const* category;
};

template <typename T>
concept WithSpecializationKey = std::is_base_of_v<Impl::SpecializationToken, T>;

template <WithUnsigned TNumber = std::uint32_t, WithStableIdKey T>
IdFactory<TNumber>* getStableIdFactory(T)
{
    static IdFactory<TNumber> factory{};
    return &factory;
}

template <WithCategoryKey TIdCategory>
uint8_t getCategoryId(TIdCategory)
{
    static uint8_t const id = sID_CATEGORY_FACTORY.generateId();
    return id;
}

template <WithSpecializationKey TSpecialization>
uint8_t getSpecializationId(TSpecialization specialization)
{
    IdFactory<uint8_t>*  factory = getStableIdFactory<uint8_t>(*specialization.category);
    static uint8_t const id = factory->generateId();
    return id;
}

} // namespace JsUtil

#include "JsUtil/Identifiers.inl"