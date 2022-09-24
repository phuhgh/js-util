# pragma once

#include <array>
#include <type_traits>

namespace JsUtil
{
    template<typename T>
    struct Mat4
    {
    public:
        std::array<T, 16> m_elements;
    };
}