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