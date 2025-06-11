/**
 * terminology:
 *  - config: may not be updated
 *  - options: may be updated
 *  the top level must always be replaced
 *  todo jack: correct naming, move me
 */

export interface IUpdateableOptions<TOpt extends object> {
    options: IOptionUpdater<TOpt>;
}


export interface IOptionUpdater<TOpt extends object>
{
    updateOptions(newOptions: TOpt): void;
}

export type TPropertyUpdater<T extends object> = {
    [K in keyof T]: (newProp: T[K]) => void
}

export class OptionUpdater<TOpt extends object> implements IOptionUpdater<TOpt>
{
    public constructor
    (
        public readonly updaters: TPropertyUpdater<Required<TOpt>>,
    )
    {
    }

    public updateOptions(newOptions: TOpt): void
    {
        const keys = Object.keys(newOptions) as (keyof TOpt)[];
        // noinspection UnnecessaryLocalVariableJS
        const updaters = this.updaters;

        for (let i = 0; i < keys.length; i++)
        {
            const key = keys[i];
            updaters[key](newOptions[key]);
        }
    }
}