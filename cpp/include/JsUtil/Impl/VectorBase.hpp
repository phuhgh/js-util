#pragma once

#include <array>
#include <utility>

namespace JsUtil
{

template <typename TStorage, unsigned TSize, typename TExt>
class AVectorBase
{
  public:
    static constexpr int scSIZE = TSize;

    AVectorBase() = default;
    explicit AVectorBase(std::array<TStorage, TSize> values)
        : m_elements(std::move(values))
    {
        static_assert(offsetof(AVectorBase, m_elements) == 0);
        static_assert(sizeof(AVectorBase) == sizeof(std::array<TStorage, TSize>));
    }

    bool operator==(TExt const& other) { return m_elements == other.m_elements; }
    bool operator!=(TExt const& other) { return m_elements != other.m_elements; }

    TStorage& operator[](unsigned index) { return m_elements[index]; }
    TStorage  operator[](unsigned index) const { return m_elements[index]; }

    std::array<TStorage, scSIZE>*       asArray() { return &m_elements; }
    std::array<TStorage, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr unsigned           size() { return scSIZE; }

  protected:
    std::array<TStorage, TSize> m_elements; // NOLINT(*-non-private-member-variables-in-classes)
};

} // namespace JsUtil