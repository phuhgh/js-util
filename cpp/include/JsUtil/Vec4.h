#pragma once

#include <array>

namespace JsUtil
{
template <typename T> struct Vec4
{
  public:
    static constexpr int scSIZE = 4;

    Vec4() = default;
    explicit Vec4(std::array<T, scSIZE> values)
        : m_elements(std::move(values))
    {
    }

    T x() const { return m_elements[0]; }
    T y() const { return m_elements[1]; }
    T z() const { return m_elements[2]; }
    T w() const { return m_elements[3]; }
    void setX(T x_val) { m_elements[0] = x_val; }
    void setY(T y_val) { m_elements[1] = y_val; }
    void setZ(T z_val) { m_elements[2] = z_val; }
    void setW(T w_val) { m_elements[3] = w_val; }

    T& operator[](int index) { return m_elements[index]; }
    T  operator[](int index) const { return m_elements[index]; }

    std::array<T, scSIZE>*       asArray() { return &m_elements; }
    std::array<T, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr int         size() { return scSIZE; }

  private:
    std::array<T, scSIZE> m_elements;
};
} // namespace JsUtil