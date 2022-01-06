import { IIncrementallyUpdatable, IncrementalUpdater } from "./incremental-updater";
import { _Iterator } from "@rc-js-util/core";

describe("initial state", () =>
{
    test("isUpdating is false", () =>
    {
        const updatable: IIncrementallyUpdatable = { incrementallyUpdate: () => _Iterator.emptyIterator };
        const updater = new IncrementalUpdater(updatable);

        expect(updater.isUpdating).toBe(false);
    });
});