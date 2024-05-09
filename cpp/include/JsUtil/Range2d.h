#pragma once

#include "JsUtil/Mat2.h"
#include "JsUtil/Vec2.h"
#include <cmath>

namespace JsUtil
{

template <typename T> class Range2d : public Mat2<T>
{
  public:
    using Mat2<T>::Mat2;
    Range2d<T> createOne(Vec2<T> _bottomLeft, Vec2<T> _topRight);

    // getters
    T xMin() const { return this->operator[](0); }
    T xMax() const { return this->operator[](1); }
    T yMin() const { return this->operator[](2); }
    T yMax() const { return this->operator[](3); }

    // setters
    void setXMin(T value) { this->operator[](0) = value; }
    void setXMax(T value) { this->operator[](1) = value; }
    void setYMin(T value) { this->operator[](2) = value; }
    void setYMax(T value) { this->operator[](3) = value; }

    /// bounding boxes "touching" is not considered an intersection
    template <typename U> inline bool rangeIntersects(Range2d<U> const& _range) const;
    /// check is inclusive of the boundary (>= min and <= max)
    template <typename U> inline bool pointInRange(Vec2<U> _point) const;

    /// adjusts min & maxes such that max >= min
    void ensureAABB();

    // ranges
    inline T getXRange() const;
    inline T getYRange() const;

    // quads
    Range2d<T> getNw() const;
    Range2d<T> getNe() const;
    Range2d<T> getSw() const;
    Range2d<T> getSe() const;
};

} // namespace JsUtil

#include "JsUtil/Range2d.inl"