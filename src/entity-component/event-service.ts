import type { TListener } from "../eventing/t-listener.js";
import type { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";
import { BroadcastChannel } from "../eventing/broadcast-channel.js";

// todo jack: seems questionable this living with ECS
export type TEventCategoryListener<T extends IEventCategoryKey<string, unknown[]>> =
    T extends IEventCategoryKey<infer U, infer V>
        ? TListener<U, V>
        : never;

/**
 * @public
 * todo jack: docs that tell you about the mechanics of using it
 */
export interface IEventCategoryKey<TKey extends string, TArgs extends unknown[]>
{
    readonly parentCategory: IEventCategoryKey<TKey, TArgs> | null;
    readonly callbackKey: TKey;

    emit(eventService: IEventService, ...args: TArgs): void;
}

/**
 * @public
 * A store of event categories that can be used to emit events.
 */
export interface IEventService
{
    getCategory<TKey extends string, TArgs extends unknown[]>
    (
        category: IEventCategoryKey<TKey, TArgs>,
    )
        : IBroadcastChannel<TKey, TArgs>;
}

/**
 * @public
 * {@inheritDoc IEventService}
 */
export class EventService implements IEventService
{
    public getCategory<TKey extends string, TArgs extends unknown[]>
    (
        category: IEventCategoryKey<TKey, TArgs>,
    )
        : IBroadcastChannel<TKey, TArgs>
    {
        let channel = this.categories.get(category) as IBroadcastChannel<TKey, TArgs> | undefined;

        if (channel == null)
        {
            channel = new BroadcastChannel(category.callbackKey);
            this.categories.set(category, channel);
        }

        return channel;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private categories = new WeakMap<object, IBroadcastChannel<string, any[]>>();
}
