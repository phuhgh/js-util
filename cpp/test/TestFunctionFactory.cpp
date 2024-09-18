#include "JsUtil/FunctionFactory.hpp"
#include "JsUtilTestUtil/MoveOnlyTestObject.hpp"
#include <gtest/gtest.h>

TEST(FunctionFactory, basicConstexprFunctionComposition)
{
    constexpr auto pipeline = JsUtil::FunctionFactory([](int arg, int context) -> std::tuple<int, int> {
                                  return std::make_tuple(arg, context);
                              }) //
                                  .extend([](std::tuple<int, int> arg, int context) -> int {
                                      return std::get<0>(arg) + std::get<1>(arg) + context;
                                  })
                                  .extend([](int arg, int context) -> int { return (arg * 2) + context; });

    constexpr auto result = pipeline.run(2, 3);
    EXPECT_EQ(result, 19);
}

TEST(FunctionFactory, moveOnlyObjects)
{
    constexpr auto pipeline =
        JsUtil::FunctionFactory(
            [](MoveOnlyTestObject arg, MoveOnlyTestObject context) -> std::tuple<MoveOnlyTestObject, int> {
                return std::make_tuple(std::move(arg), context.m_val);
            }
        )
            .extend([](std::tuple<MoveOnlyTestObject, int> arg, MoveOnlyTestObject context) {
                return std::get<0>(arg).m_val + std::get<1>(arg) + context.m_val;
            })
            .extend([](int arg, MoveOnlyTestObject context) { return MoveOnlyTestObject{(arg * 2) + context.m_val}; });

    constexpr auto result = pipeline.run(MoveOnlyTestObject{2}, MoveOnlyTestObject{3});
    EXPECT_EQ(result.m_val, 19);
}

TEST(FunctionFactory, combinatorialFunctionComposition)
{
    struct A
    {
        int val;
    };
    struct B
    {
        int val;
    };
    struct C
    {
        int val;
    };

    auto constexpr f1 = [](A arg, int context) -> B { return B{arg.val + 1 + context}; };
    auto constexpr f2 = [](A arg, int context) -> B { return B{arg.val + 2 + context}; };
    auto constexpr f3 = [](B arg, int) -> C { return C{arg.val * 2}; };
    auto constexpr f4 = [](B arg, int) -> C { return C{arg.val * 3}; };

    constexpr auto combinations =
        TupleExt::combinatorial(std::make_tuple(std::make_tuple(f1, f2), std::make_tuple(f3, f4)));
    static_assert(std::tuple_size_v<decltype(combinations)> == 4);

    constexpr auto functions = JsUtil::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 4);

    EXPECT_EQ(std::get<0>(functions).run(A{10}, 1).val, 24);
    EXPECT_EQ(std::get<1>(functions).run(A{10}, 1).val, 36);
    EXPECT_EQ(std::get<2>(functions).run(A{10}, 1).val, 26);
    EXPECT_EQ(std::get<3>(functions).run(A{10}, 1).val, 39);
}

struct IIndexedConnector
{
    virtual ~IIndexedConnector() = default;
    virtual double      getValue(std::size_t _index, int8_t _offset) const = 0;
    virtual std::size_t getLength() const = 0;
};

class TestConnectorInterleaved : public IIndexedConnector
{
  public:
    ~TestConnectorInterleaved() override = default;
    TestConnectorInterleaved(int stride, int length)
        : m_stride(stride)
        , m_data(length * stride)
    {
        std::vector<int> counters(stride, 0);

        for (int i = 0; i < length; ++i)
        {
            for (int j = 0; j < stride; ++j)
            {
                m_data[(i * stride) + j] = counters[j]++;
            }
        }
    }

    double getValue(std::size_t index, int8_t offset) const override { return m_data[(index * m_stride) + offset]; }
    std::size_t getLength() const override { return m_data.size() / m_stride; }

  private:
    int                 m_stride;
    std::vector<double> m_data;
};

class TestConnectorParallel : public IIndexedConnector
{
  public:
    ~TestConnectorParallel() override = default;
    TestConnectorParallel(int stride, int length)
        : m_data(stride, std::vector<double>(length))
    {
        std::vector<int> counters(stride, 0);

        for (int i = 0; i < stride; ++i)
        {
            for (int j = 0; j < length; ++j)
            {
                m_data[i][j] = counters[i]++;
            }
        }
    }

    double      getValue(std::size_t index, int8_t offset) const override { return m_data[offset][index]; }
    std::size_t getLength() const override { return m_data.empty() ? 0 : m_data[0].size(); }

  private:
    std::vector<std::vector<double>> m_data;
};

TEST(FunctionFactory, reduction)
{
    //
}
