#include "JsUtil/Mat2.h"
#include "JsUtil/Mat3.h"
#include "JsUtil/Mat4.h"
#include "JsUtil/Vec2.h"
#include "JsUtil/Vec3.h"
#include "JsUtil/Vec4.h"
#include <gtest/gtest.h>

using namespace JsUtil;

template <typename T> struct TestConfig
{
    static int const size = 0;
};
template <> struct TestConfig<Vec2<float>>
{
    static int const size = 2;
};
template <> struct TestConfig<Vec3<float>>
{
    static int const size = 3;
};
template <> struct TestConfig<Vec4<float>>
{
    static int const size = 4;
};
template <> struct TestConfig<Mat2<float>>
{
    static int const size = 4;
};
template <> struct TestConfig<Mat3<float>>
{
    static int const size = 9;
};
template <> struct TestConfig<Mat4<float>>
{
    static int const size = 16;
};

template <typename T> class TestVector : public testing::Test
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