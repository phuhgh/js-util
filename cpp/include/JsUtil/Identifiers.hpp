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

    [[nodiscard]] char const* getName() const noexcept { return m_name; }

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
template <typename Token, typename TCategory>
struct IdCategory
    : StableIdKey
    , Impl::CategoryToken
{
    using TToken = Token;
    using TAssociatedType = TCategory;

    consteval IdCategory(char const* name, bool isFlag = false)
        : StableIdKey(name)
        , isFlag(isFlag)
    {
    }
    bool isFlag;
};

template <typename T>
concept WithCategoryKey = std::is_base_of_v<Impl::CategoryToken, T>;

/**
 * @brief Represents a specialization of an `IdCategory`, e.g. interleaved buffer, which is a specialization of buffer.
 */
template <typename TSpecialized, WithCategoryKey Category>
struct IdSpecialization
    : StableIdKey
    , Impl::SpecializationToken
{
    using TCategory = Category;
    using TAssociatedType = TSpecialized;

    consteval IdSpecialization(TCategory const& category, char const* name)
        : StableIdKey(name)
        , category(&category)
    {
        static_assert(std::is_convertible_v<TSpecialized*, typename TCategory::TAssociatedType*>);
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