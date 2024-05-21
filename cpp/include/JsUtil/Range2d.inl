#pragma once

namespace JsUtil
{

template <typename T> JsUtil::Range2d<T> Range2d<T>::fromCorners(JsUtil::Vec2<T> _bottomLeft, JsUtil::Vec2<T> _topRight)
{
    return JsUtil::Range2d<T>{{_bottomLeft.x(), _topRight.x(), _bottomLeft.y(), _topRight.y()}};
}

template <typename T> JsUtil::Range2d<T> Range2d<T>::fromRanges(JsUtil::Vec2<T> _horizontal, JsUtil::Vec2<T> _vertical)
{
    return JsUtil::Range2d<T>{{_horizontal.min(), _horizontal.max(), _vertical.min(), _vertical.max()}};
}

template <typename T> template <typename U> bool Range2d<T>::rangeIntersects(Range2d<U> const& _range) const
{
    bool xIntersects =
        std::abs((xMin() + xMax()) - (_range.xMin() + _range.xMax())) < (getXRange() + _range.getXRange());
    bool yIntersects =
        std::abs(((yMin() + yMax())) - (_range.yMin() + _range.yMax())) < (getYRange() + _range.getYRange());
    return xIntersects && yIntersects;
}

template <typename T> void Range2d<T>::ensureAABB()
{
    if (xMin() > xMax())
    {
        T tmp = xMin();
        setXMin(xMax());
        setXMax(tmp);
    }

    if (yMin() > yMax())
    {
        T tmp = yMin();
        setYMin(yMax());
        setYMax(tmp);
    }
}

template <typename T> T Range2d<T>::getXRange() const
{
    return xMax() - xMin();
}

template <typename T> T Range2d<T>::getYRange() const
{
    return yMax() - yMin();
}

template <typename T> template <typename U> bool Range2d<T>::pointInRange(JsUtil::Vec2<U> _point) const
{
    return _point.x() >= xMin() && _point.x() <= xMax() && _point.y() >= yMin() && _point.y() <= yMax();
}

template <typename T> Range2d<T> Range2d<T>::getNw() const
{
    return Range2d<T>{{
        xMin(),
        static_cast<T>(xMin() + getXRange() / 2),
        static_cast<T>(yMin() + getYRange() / 2),
        yMax(),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getNe() const
{
    return Range2d<T>{{
        static_cast<T>(xMin() + getXRange() / 2),
        xMax(),
        static_cast<T>(yMin() + getYRange() / 2),
        yMax(),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getSe() const
{
    return Range2d<T>{{
        static_cast<T>(xMin() + getXRange() / 2),
        xMax(),
        yMin(),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getSw() const
{
    return Range2d<T>{{
        xMin(),
        static_cast<T>(xMin() + getXRange() / 2),
        yMin(),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getN() const
{
    return Range2d<T>{{
        xMin(),
        xMax(),
        static_cast<T>(yMin() + getYRange() / 2),
        yMax(),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getE() const
{
    return Range2d<T>{{
        static_cast<T>(xMin() + getXRange() / 2),
        xMax(),
        yMin(),
        yMax(),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getS() const
{
    return Range2d<T>{{
        xMin(),
        xMax(),
        yMin(),
        static_cast<T>(yMin() + getYRange() / 2),
    }};
}

template <typename T> Range2d<T> Range2d<T>::getW() const
{
    return Range2d<T>{{
        xMin(),
        static_cast<T>(xMin() + getXRange() / 2),
        yMin(),
        yMax(),
    }};
}

template class Range2d<float>;
template class Range2d<double>;

static_assert(std::is_trivial_v<Range2d<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Range2d<float>>, "standard layout required");
static_assert(sizeof(Mat2<float>) == sizeof(Range2d<float>), "must be interchangeable with Mat2");

} // namespace JsUtil