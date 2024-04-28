#pragma once

#include <array>

namespace JsUtil
{

template <typename T> struct Mat2
{
  public:
    static constexpr int scSIZE = 4;

    Mat2() = default;
    explicit Mat2(std::array<T, scSIZE> values)
        : m_elements(std::move(values))
    {
    }

    T& operator[](int index) { return m_elements[index]; }
    T  operator[](int index) const { return m_elements[index]; }

    /// Get the x component of a multiplication with a Vec2
    T multiplyXComponent(T _xComponent) const { return m_elements[0] * _xComponent + m_elements[2]; }

    std::array<T, scSIZE>*       asArray() { return &m_elements; }
    std::array<T, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr int         size() { return scSIZE; }

  private:
    std::array<T, scSIZE> m_elements;
};

} // namespace JsUtil