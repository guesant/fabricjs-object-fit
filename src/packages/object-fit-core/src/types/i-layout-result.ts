export type ILayoutResult = {
  /** Offset of scaled object from container origin */
  x: number;
  /** Offset of scaled object from container origin */
  y: number;
  /** Rendered width after scaling */
  width: number;
  /** Rendered height after scaling */
  height: number;
  /** Horizontal scale factor applied */
  scaleX: number;
  /** Vertical scale factor applied */
  scaleY: number;
  /** Clip region x origin */
  clipX: number;
  /** Clip region y origin */
  clipY: number;
  /** Clip region width */
  clipWidth: number;
  /** Clip region height */
  clipHeight: number;
};
