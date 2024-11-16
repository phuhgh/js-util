#pragma once

#include <JsUtil/TypeTraits.hpp>

namespace JsUtil
{

template <JsUtil::WithUnsigned TUint = uint32_t>
consteval bool isPrime(TUint num)
{
    if (num <= 1)
    {
        return false;
    }

    for (TUint i = 2; i * i <= num; ++i)
    {
        if (num % i == 0)
        {
            return false;
        }
    }

    return true;
}

template <JsUtil::WithUnsigned TUint = uint32_t>
consteval TUint nextPrime(TUint val)
{
    TUint candidate = val + 1;
    while (!isPrime<TUint>(candidate))
    {
        ++candidate;
    }
    return candidate;
}

template <size_t Start, size_t StepCount>
constexpr std::array<uint32_t, StepCount> generateDoublingPrimes()
{
    std::array<uint32_t, StepCount> doublingPrimes = {};
    uint32_t                        current = Start;

    for (std::size_t i = 0; i < StepCount; ++i)
    {
        doublingPrimes[i] = current;
        current = nextPrime<uint32_t>(current * 2);
    }
    return doublingPrimes;
}

constexpr auto scDOUBLING_PRIME_TABLE = generateDoublingPrimes<3, 32>();

inline uint32_t getNextDoublingPrime(uint32_t val)
{
    auto it = std::lower_bound(scDOUBLING_PRIME_TABLE.begin(), scDOUBLING_PRIME_TABLE.end(), val);
    return it != scDOUBLING_PRIME_TABLE.end() ? *it : val;
}

} // namespace JsUtil