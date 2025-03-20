#include "JsUtil/FunctionFactory.hpp"
#include <JsUtil/JsInterop.hpp>
#include <JsUtil/JsUtil.hpp>
#include <JsUtil/SharedArray.hpp>
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <JsUtilTestUtil/TestObjects.hpp>
#include <gtest/gtest.h>

using namespace JsInterop;

inline constexpr JsUtil::IdCategory<struct Cat1, void>                        scTEST_CAT_1{"TEST_CAT_1"};
inline constexpr JsUtil::IdSpecialization<struct C1A, decltype(scTEST_CAT_1)> scTEST_CAT_1_A{scTEST_CAT_1, "CAT_1_A"};
inline constexpr JsUtil::IdSpecialization<struct C1B, decltype(scTEST_CAT_1)> scTEST_CAT_1_B{scTEST_CAT_1, "CAT_1_B"};

inline constexpr JsUtil::IdCategory<struct Cat2, void>                        scTEST_CAT_2{"TEST_CAT_2"};
inline constexpr JsUtil::IdSpecialization<struct C2A, decltype(scTEST_CAT_2)> scTEST_CAT_2_A{scTEST_CAT_2, "CAT_2_A"};
inline constexpr JsUtil::IdSpecialization<struct C2B, decltype(scTEST_CAT_2)> scTEST_CAT_2_B{scTEST_CAT_2, "CAT_2_B"};

[[maybe_unused]] static LangExt::OnCreate const scBEFORE_TESTS{[] {
    JsUtil::Debug::disableJsIntegration();
    JsUtil::initializeJsu();
    IdRegistry::registerIdentifiers(
        std::make_tuple(scTEST_CAT_1, scTEST_CAT_1_A, scTEST_CAT_2, scTEST_CAT_2_A, scTEST_CAT_2_B)
    );
}};

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

class MockSharedMemoryObject : public ASharedMemoryObject
{
  public:
    void*       getValuePtr() override { return value; }
    void const* getValuePtr() const override { return value; }

  private:
    void* value = nullptr;
};

TEST(IdRegistry, lookup)
{
    // this test is quite brittle, it needs to be updated every time a category is added...
    EXPECT_EQ(IdRegistry::getCount(), 21);
    EXPECT_EQ(IdRegistry::getId("TEST_CAT_1"), 4);
    EXPECT_EQ(IdRegistry::getId("CAT_1_A"), 1);
    EXPECT_EQ(IdRegistry::getId("TEST_CAT_2"), 5);
    EXPECT_EQ(IdRegistry::getId("CAT_2_A"), 1);
    EXPECT_EQ(IdRegistry::getId("CAT_2_B"), 2);
}

// todo jack: clearly missing some tests
TEST(SharedMemoryOwner, elide)
{
    // somewhat relying on ASAN to check that this is correct
    SharedMemoryOwner       sharedInt{std::make_shared<MoveOnlyTestObject>(11), {{1, 2}}};
    SharedMemoryOwner<void> elided = sharedInt.elide();
    EXPECT_EQ(static_cast<MoveOnlyTestObject*>(elided.getValuePtr())->m_val, 11);
}

TEST(SharedMemoryOwner, createWeak)
{
    WeakSharedMemoryOwner<MoveOnlyTestObject> weak{nullptr, {}};
    {
        std::shared_ptr<MoveOnlyTestObject> strong{};

        {
            SharedMemoryOwner sharedInt{std::make_shared<MoveOnlyTestObject>(11), {{1, 2}}};
            weak = sharedInt.createWeak();
            EXPECT_EQ(static_cast<MoveOnlyTestObject*>(weak.getValuePtr())->m_val, 11);
            strong = weak.lock();
        }

        // relies on ASAN
        EXPECT_EQ(strong->m_val, 11);
    }

    EXPECT_EQ(static_cast<MoveOnlyTestObject*>(weak.getValuePtr()), nullptr);
}
