/**
 * @public
 * Bit offset for packed RGBA colors.
 *
 * @remarks
 * After masking zero fill right shift to unpack.
 * Left shift to pack (0-255 as input).
 */
export enum ERgbaShift
{
    R = 0,
    G = 8,
    B = 16,
    A = 24,
}

/**
 * @public
 * Bit mask for packed RGBA colors.
 */
export enum ERgbaMasks
{
    R = 255 << ERgbaShift.R,
    G = 255 << ERgbaShift.G,
    B = 255 << ERgbaShift.B,
    A = 255 << ERgbaShift.A,
}