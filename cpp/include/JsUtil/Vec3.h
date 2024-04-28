#pragma once

#include <array>

namespace JsUtil
{
template <typename T> struct Vec3
{
    static constexpr int scSIZE = 3;

  public:
    T x() const { return m_elements[0]; };
    T y() const { return m_elements[1]; };
    T z() const { return m_elements[2]; };

    Vec3() = default;
    explicit Vec3(std::array<T, scSIZE> values)
        : m_elements(std::move(values))
    {
    }

    T& operator[](int index) { return m_elements[index]; }
    T  operator[](int index) const { return m_elements[index]; }

    std::array<T, scSIZE>*       asArray() { return &m_elements; }
    std::array<T, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr int         size() { return scSIZE; }

  private:
    std::array<T, scSIZE> m_elements;
};
} // namespace JsUtil