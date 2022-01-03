/**
 * @public
 */
export type TListener<K extends string, TArgs extends unknown[]> = {
    [P in K]: (...args: TArgs) => void;
};

