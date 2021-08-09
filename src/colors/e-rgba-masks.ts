/**
 * @public
 * Bit offset for packed RGBA colors.
 *
 * @remarks
 * After masking zero fill right shift to unpack.
 * Left shift to pack (0-255 as input).
 * Stored as ABGR to allow packing of RGB into float32.
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
    R = 0xFF << ERgbaShift.R,
    G = 0xFF << ERgbaShift.G,
    B = 0xFF << ERgbaShift.B,
    A = 0xFF << ERgbaShift.A,
}