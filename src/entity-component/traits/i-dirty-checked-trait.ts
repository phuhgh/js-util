import type { IIdentifierFactory } from "../../identifier/impl/i-identifier-factory.js";

/**
 * @public
 * Used for dirty checking of entity state.
 */
export interface IDirtyCheckedTrait
{
    /**
     * Answers: has the entity changed since the last changeId?
     */
    readonly isDirty: boolean;
    /**
     * System wide unique identifier associated with a particular entity state.
     */
    readonly changeId: number;

    markDirty(): void;
    updateChangeId(changeIdFactory: IIdentifierFactory): void;
    // todo jack11: we could add flags here, one to set, one to clear...
    // that way individual subsystems don't cause network effects in all cases
    // todo jack20: we don't want the entity to do this (but it is used / useful, seemingly)
    // updateChangeId(): void;
};