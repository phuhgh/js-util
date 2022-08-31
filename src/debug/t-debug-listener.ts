/**
 * @public
 */
export type TDebugListener<K extends string, TArgs extends unknown[]> = {
    [P in K]?: (...args: TArgs) => void;
};