#pragma once

namespace JsUtil
{

template <typename T>
Range2d<T> Range2d<T>::fromPair(TupleExt::RepeatedPair<Vec2<T>> pair)
{
    auto range = Range2d{{pair.first.x(), pair.first.y(), pair.second.x(), pair.second.y()}};
    range.ensureAABB();
    return range;
}

template <typename T>
Range2d<T> Range2d<T>::fromCorners(Vec2<T> _bottomLeft, Vec2<T> _topRight)
{
    return Range2d{{_bottomLeft.x(), _bottomLeft.y(), _topRight.x(), _topRight.y()}};
}

template <typename T>
Range2d<T> Range2d<T>::fromRanges(Vec2<T> _horizontal, Vec2<T> _vertical)
{
    return Range2d{{_horizontal.min(), _vertical.min(), _horizontal.max(), _vertical.max()}};
}

template <typename T>
template <typename U>
bool Range2d<T>::rangeIntersects(Range2d<U> const& _range) const
{
    bool xIntersects =
        std::abs((xMin() + xMax()) - (_range.xMin() + _range.xMax())) < (getXRange() + _range.getXRange());
    bool yIntersects =
        std::abs(((yMin() + yMax())) - (_range.yMin() + _range.yMax())) < (getYRange() + _range.getYRange());
    return xIntersects && yIntersects;
}

template <typename T>
bool Range2d<T>::ensureAABB()
{
    bool fixed{false};
    if (xMin() > xMax())
    {
        T tmp = xMin();
        setXMin(xMax());
        setXMax(tmp);
        fixed = true;
    }

    if (yMin() > yMax())
    {
        T tmp = yMin();
        setYMin(yMax());
        setYMax(tmp);
        fixed = true;
    }

    return fixed;
}

template <typename T>
T Range2d<T>::getXRange() const
{
    return xMax() - xMin();
}

template <typename T>
T Range2d<T>::getYRange() const
{
    return yMax() - yMin();
}

template <typename T>
template <typename U>
bool Range2d<T>::pointInRange(Vec2<U> _point) const
{
    return _point.x() >= xMin() && _point.x() <= xMax() && _point.y() >= yMin() && _point.y() <= yMax();
}

template <typename T>
Range2d<T> Range2d<T>::getNw() const
{
    return Range2d{{
        xMin(),
        static_cast<T>(yMin() + getYRange() / 2),
        static_cast<T>(xMin() + getXRange() / 2),
        yMax(),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getNe() const
{
    return Range2d{{
        static_cast<T>(xMin() + getXRange() / 2),
        static_cast<T>(yMin() + getYRange() / 2),
        xMax(),
        yMax(),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getSe() const
{
    return Range2d{{
        static_cast<T>(xMin() + getXRange() / 2),
        yMin(),
        xMax(),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getSw() const
{
    return Range2d{{
        xMin(),
        yMin(),
        static_cast<T>(xMin() + getXRange() / 2),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getQuad(EQuadrant quad) const
{
    if constexpr (Debug::isDebug())
    {
        Debug::debugAssert(static_cast<uint8_t>(quad) < 4, "quad out of range");
    }

    T width = (xMax() - xMin()) / 2;
    T height = (yMax() - yMin()) / 2;

    T quad_xMin = xMin() + (static_cast<uint8_t>(quad) & 0b1) * width;
    T quad_yMin = yMin() + (static_cast<uint8_t>(quad) >> 1) * height;

    return Range2d{
        {static_cast<T>(quad_xMin),
         static_cast<T>(quad_yMin),
         static_cast<T>(quad_xMin + width),
         static_cast<T>(quad_yMin + height)}
    };
}

template <typename T>
Range2d<T> Range2d<T>::getN() const
{
    return Range2d{{
        xMin(),
        static_cast<T>(yMin() + getYRange() / 2),
        xMax(),
        yMax(),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getE() const
{
    return Range2d{{
        static_cast<T>(xMin() + getXRange() / 2),
        yMin(),
        xMax(),
        yMax(),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getS() const
{
    return Range2d{{
        xMin(),
        yMin(),
        xMax(),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T>
Range2d<T> Range2d<T>::getW() const
{
    return Range2d{{
        xMin(),
        yMin(),
        static_cast<T>(xMin() + getXRange() / 2),
        yMax(),
    }};
}

template class Range2d<float>;
template class Range2d<double>;

static_assert(std::is_trivial_v<Range2d<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Range2d<float>>, "standard layout required");
static_assert(sizeof(Mat2<float>) == sizeof(Range2d<float>), "must be interchangeable with Mat2");

} // namespace JsUtil