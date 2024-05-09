#pragma once

#include <array>
#include <utility>

namespace JsUtil
{

template <typename TStorage, unsigned TSize, typename TExt> class AVectorBase
{
  public:
    static constexpr int scSIZE = TSize;

    AVectorBase() = default;
    explicit AVectorBase(std::array<TStorage, TSize> values)
        : m_elements(std::move(values))
    {
    }

    bool operator==(TExt const& other) { return m_elements == other.m_elements; }
    bool operator!=(TExt const& other) { return m_elements != other.m_elements; }

    TStorage& operator[](int index) { return m_elements[index]; }
    TStorage  operator[](int index) const { return m_elements[index]; }

    std::array<TStorage, scSIZE>*       asArray() { return &m_elements; }
    std::array<TStorage, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr int                size() { return scSIZE; }

  protected:
    std::array<TStorage, TSize> m_elements; // NOLINT(*-non-private-member-variables-in-classes)
};

} // namespace JsUtil