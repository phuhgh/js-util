/**
 * @public Gives the next int between 0 - 16.
 */
export type TNextInt<TInt extends number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, ...number[]][TInt]