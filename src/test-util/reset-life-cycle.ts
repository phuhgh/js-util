import { allocationStack } from "../web-assembly/emscripten/lifecycle-stack.js";

/**
 * @public
 */
export function resetLifeCycle(): void {
    allocationStack.length = 0;
}