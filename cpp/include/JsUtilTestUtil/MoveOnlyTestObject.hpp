#pragma once

class MoveOnlyTestObject
{
  public:
    int m_val;
    constexpr explicit MoveOnlyTestObject(int val = 0)
        : m_val(val) {};
    ~MoveOnlyTestObject() = default;

    MoveOnlyTestObject(MoveOnlyTestObject const&) = delete;
    MoveOnlyTestObject& operator=(MoveOnlyTestObject const&) = delete;

    MoveOnlyTestObject(MoveOnlyTestObject&&) = default;
    MoveOnlyTestObject& operator=(MoveOnlyTestObject&&) = default;

    bool operator==(MoveOnlyTestObject const& other) const { return other.m_val == m_val; }
    bool operator!=(MoveOnlyTestObject const& other) const { return other.m_val != m_val; }
};

namespace std
{
template <>
struct hash<MoveOnlyTestObject>
{
    std::size_t operator()(MoveOnlyTestObject const& obj) const noexcept { return std::hash<int>()(obj.m_val); }
};
} // namespace std