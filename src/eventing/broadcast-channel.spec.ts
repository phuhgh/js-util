import { BroadcastChannel } from "./broadcast-channel.js";
import { CleanupStore } from "../lifecycle/cleanup-store.js";

describe("=> BroadcastChannel", () =>
{
    describe("=> addListener", () =>
    {
        it("| add the listener with a CleanupStore ", () =>
        {
            const channel = new BroadcastChannel("test");
            const cleanupStore = new CleanupStore();
            const listener = { test: jasmine.createSpy() };
            channel.addListener(cleanupStore, listener);
            channel.emit();
            channel.emit();

            cleanupStore.cleanup();
            channel.emit();
            expect(listener.test.calls.count()).toBe(2);
        });

        it("| add the listener without a CleanupStore ", () =>
        {
            const channel = new BroadcastChannel("test");
            const listener = { test: jasmine.createSpy() };
            channel.addListener(listener);
            channel.emit();
            channel.emit();

            channel.removeListener(listener);
            channel.emit();
            expect(listener.test.calls.count()).toBe(2);
        });
    });
    describe("=> addOneTimeListener", () =>
    {
        it("| add the listener with a CleanupStore ", () =>
        {
            const channel = new BroadcastChannel("test");
            const cleanupStore = new CleanupStore();
            const listener = { test: jasmine.createSpy() };
            channel.addOneTimeListener(cleanupStore, listener);
            channel.emit();
            channel.emit();

            cleanupStore.cleanup();
            channel.emit();
            expect(listener.test.calls.count()).toBe(1);
        });
        it("| add the listener without a CleanupStore ", () =>
        {
            const channel = new BroadcastChannel("test");
            const listener = { test: jasmine.createSpy() };
            channel.addOneTimeListener(listener);
            channel.emit();
            channel.emit();

            expect(listener.test.calls.count()).toBe(1);
        });
    });
});