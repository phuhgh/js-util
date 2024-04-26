#pragma once

#include <array>

namespace JsUtil
{
template <typename T> struct Mat2
{
  public:
    std::array<T, 4> m_elements;

    /// Get the x component of a multiplication with a Vec2
    T multiplyXComponent(T _xComponent) const
    {
        return m_elements[0] * _xComponent + m_elements[2];
    }
};
} // namespace JsUtil