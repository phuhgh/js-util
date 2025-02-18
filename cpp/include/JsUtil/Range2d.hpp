#pragma once

#include "Debug.hpp"
#include "JsUtil/Mat2.hpp"
#include "JsUtil/Vec2.hpp"

namespace JsUtil
{

/**
 * You can think of the bit pattern as being 0bXY
 * |---------------|
 * |  0b01 |  0b11 |
 * | ----- | ----- |
 * |  0b00 | 0b10  |
 * |---------------|
 */
enum class EQuadrant : uint8_t
{
    eSW = 0,
    eSE,
    eNW,
    eNE,
};

template <typename T>
class Range2d : public Mat2<T>
{
  public:
    static Range2d fromCorners(Vec2<T> _bottomLeft, Vec2<T> _topRight);
    static Range2d fromRanges(Vec2<T> _horizontal, Vec2<T> _vertical);

    using Mat2<T>::Mat2;

    // getters
    [[nodiscard]] T xMin() const { return this->operator[](0); }
    [[nodiscard]] T yMin() const { return this->operator[](1); }
    [[nodiscard]] T xMax() const { return this->operator[](2); }
    [[nodiscard]] T yMax() const { return this->operator[](3); }

    // setters
    void setXMin(T value) { this->operator[](0) = value; }
    void setYMin(T value) { this->operator[](1) = value; }
    void setXMax(T value) { this->operator[](2) = value; }
    void setYMax(T value) { this->operator[](3) = value; }

    /// bounding boxes "touching" is not considered an intersection
    template <typename U>
    [[nodiscard]] bool rangeIntersects(Range2d<U> const& _range) const;
    /// check is inclusive of the boundary (>= min and <= max)
    template <typename U>
    [[nodiscard]] bool pointInRange(Vec2<U> _point) const;

    /// adjusts min & maxes such that max >= min
    void ensureAABB();

    // ranges
    [[nodiscard]] T getXRange() const;
    [[nodiscard]] T getYRange() const;

    // quads
    [[nodiscard]] Range2d getNw() const;
    [[nodiscard]] Range2d getNe() const;
    [[nodiscard]] Range2d getSw() const;
    [[nodiscard]] Range2d getSe() const;
    [[nodiscard]] Range2d getQuad(EQuadrant quad) const;

    // halves
    [[nodiscard]] Range2d getN() const;
    [[nodiscard]] Range2d getE() const;
    [[nodiscard]] Range2d getS() const;
    [[nodiscard]] Range2d getW() const;
};

} // namespace JsUtil

#include "JsUtil/Range2d.inl"