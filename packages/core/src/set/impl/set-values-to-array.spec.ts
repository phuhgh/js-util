import { setValuesToArray } from "./set-values-to-array";
import { resetDebugState } from "@rc-js-util/test";

describe("=> setValuesToArray", () =>
{
    const values = new Set([1, 2, 3] as const);

    beforeEach(() => resetDebugState());

    test("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = setValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});