#include "JsUtil/LangExt.hpp"
#include "JsUtilQuadTree/QuadTree.hpp"
#include <gmock/gmock.h>
#include <gtest/gtest.h>

using namespace JsUtilQuadTree;
using namespace JsUtil;

[[maybe_unused]] static LangExt::OnCreate const scBEFORE_TESTS{[] { Debug::disableJsIntegration(); }};

std::array<QuadElement, 1024> result{};

MATCHER_P(IsQuadElement, expectedElement, "")
{
    if (arg.elementId != expectedElement.elementId)
    {
        return false;
    }

    if (arg.dataId != expectedElement.dataId)
    {
        return false;
    }

    return true;
}

// todo jack: include tests for size 0 etc (size3?), catch some stupid up front (divide by 0, I bet)
// todo jack:  because it would be cool, visualize the ranges of the quad o_tree in real time in the demo site

void insertMax(QuadTree* o_tree, Range2d<uint16_t> _aabb, QuadElement _element, QuadAllocator* o_allocator)
{
    for (uint16_t i{0}; i < QuadNode::scELEMENTS_PER_NODE; ++i)
    {
        o_tree->insertRange(_aabb, {.elementId = _element.elementId, .dataId = i}, o_allocator);
    }
}

void expectFilledNode(std::span<QuadElement> const result, QuadElement _element, unsigned offset = 0)
{
    for (uint16_t i{0}; i < QuadNode::scELEMENTS_PER_NODE; ++i)
    {
        EXPECT_THAT(result[offset + i], IsQuadElement(QuadElement{_element.elementId, i}));
    }
}

// todo jack: actually do the other test cases
/**
 * cases:
 * - symmetrical, max depth the same either side
 * - asymmetrical, max depth for normal nodes dictated by one dimension
 *
 * - size is a power of 4 <-- this is basically never going to happen
 * - size it not a power of 4
 *
 * for non-power of 4 sizes, we disallow recursion down one side
 * the crux is once one dimension goes to size one 1, you have up to 3 subdivisions for the other side
 *
 * performance considerations:
 * - we know the depth at which this happens (though the specific branch does matter)
 */
/**
 *                           21
 *                   10,                11                      >=0 && <=10 , >=11 && <= 21
 *                5,       6         5,     5                   >=0 && <=5 , >=6 && <=10  >=11 && <=16  >=17 && <=21
 *             2,   3    3,   3
 *            1,1  1,2  1,2  1, 2
 *                  1,1  1,1   1,1
 *
 * - the "right hand side" requires one extra step to reach size 1
 * - if we go to the binary node at this point, technically we lose a subdivision (but that's probably OK...)
 */
TEST(QuadTree, symertricalFill)
{
    QuadAllocator allocator;
    auto          tree = std::make_shared<QuadTree>();
    ASSERT_NE(tree, nullptr);
    Range2d<uint16_t> rootRange{{0, 0, 4, 4}};
    tree->setTopLevel(rootRange);
    // the root node / range never takes any children
    // 0-2, 2-4
    // 0-1, 1-2, 2-3, 3-4 - end
    insertMax(tree.get(), Range2d<uint16_t>{{0, 3, 1, 4}}, {.elementId = 1, .dataId = 0}, &allocator); // nw
    insertMax(tree.get(), Range2d<uint16_t>{{3, 3, 4, 4}}, {.elementId = 2, .dataId = 0}, &allocator); // ne
    insertMax(tree.get(), Range2d<uint16_t>{{3, 0, 4, 1}}, {.elementId = 3, .dataId = 0}, &allocator); // se
    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 1, 1}}, {.elementId = 4, .dataId = 0}, &allocator); // sw

    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), QuadNode::scELEMENTS_PER_NODE); // sw
    expectFilledNode(result, {.elementId = 4, .dataId = 0});
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{3, 0}}, result), QuadNode::scELEMENTS_PER_NODE); // se
    expectFilledNode(result, {.elementId = 3, .dataId = 0});
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{3, 3}}, result), QuadNode::scELEMENTS_PER_NODE); // ne
    expectFilledNode(result, {.elementId = 2, .dataId = 0});
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 3}}, result), QuadNode::scELEMENTS_PER_NODE); // nw
    expectFilledNode(result, {.elementId = 1, .dataId = 0});

    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 4, 4}}, {.elementId = 5, .dataId = 0}, &allocator);
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), 4); // sw
    expectFilledNode(result, {.elementId = 4, .dataId = 0});
    expectFilledNode(result, {.elementId = 5, .dataId = 0}, 2);

    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 4, 4}}, {.elementId = 6, .dataId = 0}, &allocator);
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), 4); // sw
}

TEST(QuadTree, symertricalPartialFill)
{
    QuadAllocator allocator;
    auto          tree = std::make_shared<QuadTree>();
    ASSERT_NE(tree, nullptr);
    Range2d<uint16_t> rootRange{{0, 0, 4, 4}};
    tree->setTopLevel(rootRange, 2);

    // fill 4 quads
    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 4, 4}}, {.elementId = 1, .dataId = 0}, &allocator);
    // fills another 4 quads
    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 2, 2}}, {.elementId = 2, .dataId = 0}, &allocator);
    // won't do anything, this part of the subtree is full
    insertMax(tree.get(), Range2d<uint16_t>{{0, 1, 2, 2}}, {.elementId = 3, .dataId = 0}, &allocator);

    EXPECT_EQ(tree->getTotalElementCount(), 16); // (d1)2 + (d2)2 + (d3)(2 + 2)
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), 4);
    expectFilledNode(result, {.elementId = 1, .dataId = 0});
    expectFilledNode(result, {.elementId = 2, .dataId = 0}, 2);

    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{3, 3}}, result), 2);
    expectFilledNode(result, {.elementId = 1, .dataId = 0});

    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 1}}, result), 4);
    expectFilledNode(result, {.elementId = 1, .dataId = 0});
    expectFilledNode(result, {.elementId = 2, .dataId = 0}, 2);

    // the maximum is not part of the range (0,1,2,3)
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{4, 4}}, result), 0);
}

TEST(QuadTree, maxDepth)
{
    QuadAllocator allocator;
    auto          tree = std::make_shared<QuadTree>();
    ASSERT_NE(tree, nullptr);
    Range2d<uint16_t> rootRange{{0, 0, 4, 4}};
    tree->setTopLevel(rootRange, 1);

    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 1, 1}}, {.elementId = 4, .dataId = 0}, &allocator); // sw
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), 2);                       // sw
    expectFilledNode(result, {.elementId = 4, .dataId = 0});

    insertMax(tree.get(), Range2d<uint16_t>{{0, 0, 4, 4}}, {.elementId = 5, .dataId = 0}, &allocator);
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{0, 0}}, result), 2); // sw
    expectFilledNode(result, {.elementId = 4, .dataId = 0});
}

TEST(QuadTree, deepNesting)
{
    QuadAllocator allocator;
    auto          tree = std::make_shared<QuadTree>();
    ASSERT_NE(tree, nullptr);
    tree->setTopLevel(Range2d<uint16_t>{{0, 0, 256, 256}}, 8);

    std::vector<QuadElement> expected;
    for (uint16_t i = 0; i < tree->getMaxDepth() + 1; ++i) // one past the max depth to check for stupid
    {
        insertMax(tree.get(), Range2d<uint16_t>({0, 0, 8, 8}), QuadElement{.elementId = i, .dataId = 0}, &allocator);

        // the last one should not insert, so we don't expect it...
        if (i < 8)
        {
            expected.insert(expected.end(), {QuadElement{i, 0}, QuadElement{i, 1}});
        }
    }

    /**
     * todo jack: seems like max depth ought to just be automatically set by the size?
     * 128   - 1
     * 64    - 1
     * 32    - 1
     * 16    - 1
     * 8     - 1
     * 4     - 4
     * 2     - 16
     * 1     - 64
     *
     * = 89 * 2 (quad element count)
     **/
    EXPECT_EQ(tree->getTotalElementCount(), 178);
    EXPECT_EQ(tree->queryPoint(Vec2<uint16_t>{{4, 4}}, result), 16);

    for (size_t i{0}; i < expected.size(); ++i)
    {
        EXPECT_THAT(result[i], IsQuadElement(expected[i]));
    }
}

TEST(Range2d, quadrantsSIMD)
{
    auto quads = getQuads(Range2d<uint16_t>{{2, 6, 4, 8}});
    EXPECT_TRUE((quads[0] == Range2d<uint16_t>{{2, 6, 3, 7}}));
    EXPECT_TRUE((quads[1] == Range2d<uint16_t>{{3, 6, 4, 7}}));
    EXPECT_TRUE((quads[2] == Range2d<uint16_t>{{2, 7, 3, 8}}));
    EXPECT_TRUE((quads[3] == Range2d<uint16_t>{{3, 7, 4, 8}}));
}

// todo jack: tests for non-symmetrical trees