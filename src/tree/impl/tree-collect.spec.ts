import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import type { ITreeNodeLike } from "../tree-model.js";
import { _Tree } from "../_tree.js";

describe("=> treeIterate", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| iterates over all nodes", () =>
    {
        const tree = new TestNode("root", [
            new TestNode("a1", [
                new TestNode("a2", []),
                new TestNode("b2", null),
            ]),
            new TestNode("b1", null),
        ]);


        const result = _Tree.collect(tree, new Array<string>(), (result, node) => result.push(node.id));
        expect(result).toEqual(["root", "a1", "a2", "b2", "b1"]);
    });
});

class TestNode implements ITreeNodeLike<TestNode>
{
    public constructor(
        public id: string,
        private children: TestNode[] | null,
    )
    {
    }

    public getChildren(): readonly any[] | null
    {
        return this.children;
    }
}