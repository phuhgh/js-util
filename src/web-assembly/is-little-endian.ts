/**
 * @public
 */
export const isLittleEndian = new DataView(new Float32Array([1]).buffer).getFloat32(0, true) === 1;