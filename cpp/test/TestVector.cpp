#include "JsUtil/Mat2.h"
#include "JsUtil/Mat3.h"
#include "JsUtil/Mat4.h"
#include "JsUtil/Range2d.h"
#include "JsUtil/Vec2.h"
#include "JsUtil/Vec3.h"
#include "JsUtil/Vec4.h"
#include <gtest/gtest.h>

using namespace JsUtil;

template <typename T>
struct TestConfig
{
    static int const size = 0;
};
template <>
struct TestConfig<Vec2<float>>
{
    static int const size = 2;
};
template <>
struct TestConfig<Vec3<float>>
{
    static int const size = 3;
};
template <>
struct TestConfig<Vec4<float>>
{
    static int const size = 4;
};
template <>
struct TestConfig<Mat2<float>>
{
    static int const size = 4;
};
template <>
struct TestConfig<Mat3<float>>
{
    static int const size = 9;
};
template <>
struct TestConfig<Mat4<float>>
{
    static int const size = 16;
};

template <typename T>
class TestVector : public testing::Test
{
  public:
    T createOne() const
    {
        T    vec{};
        auto array = vec.asArray();

        int counter{};
        for (auto& value : *array)
        {
            value = ++counter;
        }

        return vec;
    }

    TestConfig<T> getConfig() const { return TestConfig<T>{}; }
};

TYPED_TEST_SUITE_P(TestVector);

TYPED_TEST_P(TestVector, indexing)
{
    auto config = this->getConfig();
    auto vec = this->createOne();
    for (int i = 0; i < config.size; ++i)
    {
        EXPECT_EQ(vec[i], i + 1);
    }
}

REGISTER_TYPED_TEST_SUITE_P(TestVector, indexing);

using VectorTypes = ::testing::Types<Vec2<float>, Vec3<float>, Vec4<float>, Mat2<float>, Mat3<float>, Mat4<float>>;
INSTANTIATE_TYPED_TEST_SUITE_P(My, TestVector, VectorTypes);

TEST(Vec2, gettersSetters)
{
    Vec2<float> result{};
    result.setX(5);
    result.setY(6);
    EXPECT_EQ(result.x(), 5);
    EXPECT_EQ(result.y(), 6);
}

TEST(Vec2, multiply)
{
    Vec2<float>   result{};
    Vec2<float>   vec2{{3, 4}};
    Mat3<int32_t> scaling_mat{{2, 0, 0, 0, 2, 0, 0, 0, 2}};

    vec2.matrixMultiply(scaling_mat, &result);
    EXPECT_EQ(result.x(), 6);
    EXPECT_EQ(result.y(), 8);

    vec2.matrixMultiply<int32_t>(scaling_mat);
    EXPECT_EQ(vec2.x(), 6);
    EXPECT_EQ(vec2.y(), 8);

    // compilation tests
    auto const& vec2Ref = vec2;
    vec2Ref.matrixMultiply(scaling_mat, &result);
}

TEST(Vec3, gettersSetters)
{
    Vec3<float> result{};
    result.setX(5);
    result.setY(6);
    result.setZ(7);
    EXPECT_EQ(result.x(), 5);
    EXPECT_EQ(result.y(), 6);
    EXPECT_EQ(result.z(), 7);
}

TEST(Vec4, gettersSetters)
{
    Vec4<float> result{};
    result.setX(5);
    result.setY(6);
    result.setZ(7);
    result.setW(8);
    EXPECT_EQ(result.x(), 5);
    EXPECT_EQ(result.y(), 6);
    EXPECT_EQ(result.z(), 7);
    EXPECT_EQ(result.w(), 8);
}

TEST(Range2d, basicFunctionality)
{
    auto fromRange = Range2d<int>::fromRanges(Vec2<int>{{0, 1}}, Vec2<int>{{2, 3}});
    EXPECT_EQ(fromRange.xMin(), 0);
    EXPECT_EQ(fromRange.xMax(), 1);
    EXPECT_EQ(fromRange.yMin(), 2);
    EXPECT_EQ(fromRange.yMax(), 3);

    Range2d<int> r2d{{1, 2, 3, 4}};
    EXPECT_EQ(r2d.xMin(), 1);
    EXPECT_EQ(r2d.xMax(), 2);
    EXPECT_EQ(r2d.yMin(), 3);
    EXPECT_EQ(r2d.yMax(), 4);

    r2d.setXMin(4);
    r2d.setXMax(2);
    r2d.setYMin(8);
    r2d.setYMax(6);
    EXPECT_EQ(r2d.xMin(), 4);
    EXPECT_EQ(r2d.xMax(), 2);
    EXPECT_EQ(r2d.yMin(), 8);
    EXPECT_EQ(r2d.yMax(), 6);

    r2d.ensureAABB();
    EXPECT_EQ(r2d.xMin(), 2);
    EXPECT_EQ(r2d.xMax(), 4);
    EXPECT_EQ(r2d.yMin(), 6);
    EXPECT_EQ(r2d.yMax(), 8);

    EXPECT_TRUE(r2d.pointInRange(Vec2<int>{{3, 7}}));
    EXPECT_FALSE(r2d.pointInRange(Vec2<int>{{5, 7}}));
    EXPECT_FALSE(r2d.pointInRange(Vec2<int>{{1, 7}}));
    EXPECT_FALSE(r2d.pointInRange(Vec2<int>{{3, 5}}));
    EXPECT_FALSE(r2d.pointInRange(Vec2<int>{{3, 9}}));

    EXPECT_TRUE(r2d.rangeIntersects(Range2d<float>{{1, 3, 6.5, 7}}));
    EXPECT_FALSE(r2d.rangeIntersects(Range2d<float>{{1, 2, 6.5, 7}}));
    EXPECT_TRUE(r2d.rangeIntersects(Range2d<float>{{3, 5, 6.5, 7}}));
    EXPECT_FALSE(r2d.rangeIntersects(Range2d<float>{{4, 5, 6.5, 7}}));
    EXPECT_TRUE(r2d.rangeIntersects(Range2d<float>{{2.5, 3, 3, 7}}));
    EXPECT_FALSE(r2d.rangeIntersects(Range2d<float>{{2.5, 3, 3, 6}}));
    EXPECT_TRUE(r2d.rangeIntersects(Range2d<float>{{2.5, 3, 7, 10}}));
    EXPECT_FALSE(r2d.rangeIntersects(Range2d<float>{{2.5, 3, 8, 10}}));

    r2d.setYMax(10);
    EXPECT_EQ(r2d.getXRange(), 2);
    EXPECT_EQ(r2d.getYRange(), 4);

    r2d.setYMax(8);
    EXPECT_TRUE((r2d.getNe() == Range2d<int>{{3, 4, 7, 8}}));
    EXPECT_TRUE((r2d.getSe() == Range2d<int>{{3, 4, 6, 7}}));
    EXPECT_TRUE((r2d.getSw() == Range2d<int>{{2, 3, 6, 7}}));
    EXPECT_TRUE((r2d.getNw() == Range2d<int>{{2, 3, 7, 8}}));

    EXPECT_TRUE((r2d.getN() == Range2d<int>{{2, 4, 7, 8}}));
    EXPECT_TRUE((r2d.getE() == Range2d<int>{{3, 4, 6, 8}}));
    EXPECT_TRUE((r2d.getS() == Range2d<int>{{2, 4, 6, 7}}));
    EXPECT_TRUE((r2d.getW() == Range2d<int>{{2, 3, 6, 8}}));

    // should be able to use overloads from vector base
    EXPECT_FALSE(r2d.getNe() == r2d.getNw());
}

TEST(Range2d, integerQuadSubdivision)
{
    Range2d<unsigned> r1{{0, 11, 0, 21}};
    EXPECT_TRUE(r1.getNw() == (Range2d<unsigned>{{0, 5, 10, 21}}));
    EXPECT_TRUE(r1.getNe() == (Range2d<unsigned>{{5, 11, 10, 21}}));
    EXPECT_TRUE(r1.getSw() == (Range2d<unsigned>{{0, 5, 0, 10}}));
    EXPECT_TRUE(r1.getSe() == (Range2d<unsigned>{{5, 11, 0, 10}}));
}

TEST(Range2d, integerHalfSubdivision)
{
    Range2d<unsigned> r1{{0, 11, 0, 21}};
    EXPECT_TRUE(r1.getN() == (Range2d<unsigned>{{0, 11, 10, 21}}));
    EXPECT_TRUE(r1.getE() == (Range2d<unsigned>{{5, 11, 0, 21}}));
    EXPECT_TRUE(r1.getS() == (Range2d<unsigned>{{0, 11, 0, 10}}));
    EXPECT_TRUE(r1.getW() == (Range2d<unsigned>{{0, 5, 0, 21}}));
}