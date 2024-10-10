#pragma once

#include <numeric>
#include <vector>

namespace VectorExt
{

inline std::vector<int> range(int start, int end)
{
    std::vector<int> range_vector(end - start);
    std::iota(range_vector.begin(), range_vector.end(), start);
    return range_vector;
}

inline std::vector<int> range(int end)
{
    return range(0, end);
}

} // namespace VectorExt
