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
    R = 24,
    G = 16,
    B = 8,
    A = 0,
}

/**
 * @public
 * Bit mask for packed RGBA colors.
 */
export enum ERgbaMasks
{
    R = 0xFF << ERgbaShift.R,
    G = 0xFF << ERgbaShift.G,
    B = 0xFF << ERgbaShift.B,
    A = 0xFF << ERgbaShift.A,
}