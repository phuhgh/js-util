import { BroadcastChannel } from "./broadcast-channel.js";
import { CleanupRegistry } from "../lifecycle/cleanup-registry.js";

describe("=> BroadcastChannel", () =>
{
    describe("=> addListener", () =>
    {
        it("| add the listener with a CleanupRegistry ", () =>
        {
            const channel = new BroadcastChannel("test");
            const cleanupRegistry = new CleanupRegistry();
            const listener = { test: jasmine.createSpy() };
            channel.addListener(cleanupRegistry, listener);
            channel.emit();
            channel.emit();

            cleanupRegistry.executeCleanups();
            channel.emit();
            expect(listener.test.calls.count()).toBe(2);
        });

        it("| add the listener without a CleanupRegistry ", () =>
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
        it("| add the listener with a CleanupRegistry ", () =>
        {
            const channel = new BroadcastChannel("test");
            const cleanupRegistry = new CleanupRegistry();
            const listener = { test: jasmine.createSpy() };
            channel.addOneTimeListener(cleanupRegistry, listener);
            channel.emit();
            channel.emit();

            cleanupRegistry.executeCleanups();
            channel.emit();
            expect(listener.test.calls.count()).toBe(1);
        });
        it("| add the listener without a CleanupRegistry ", () =>
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
