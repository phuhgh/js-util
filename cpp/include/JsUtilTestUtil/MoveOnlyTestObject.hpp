#pragma once

class MoveOnlyTestObject
{
  public:
    int m_val;
    constexpr explicit MoveOnlyTestObject(int val = 0)
        : m_val(val){};
    ~MoveOnlyTestObject() = default;

    MoveOnlyTestObject(MoveOnlyTestObject const&) = delete;
    MoveOnlyTestObject& operator=(MoveOnlyTestObject const&) = delete;

    MoveOnlyTestObject(MoveOnlyTestObject&&) = default;
    MoveOnlyTestObject& operator=(MoveOnlyTestObject&&) = default;
};
