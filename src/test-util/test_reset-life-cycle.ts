import { allocationStack } from "../web-assembly/emscripten/lifecycle-stack.js";

/**
 * @public
 */
export function Test_resetLifeCycle(): void
{
    allocationStack.length = 0;
}