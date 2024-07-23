/**
 * @public
 */
export type TListener<K extends string, TArgs extends readonly unknown[]> = {
    [P in K]: (...args: TArgs) => void;
};

