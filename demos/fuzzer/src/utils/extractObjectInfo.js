export const extractObjectInfo = (object) => {
  const { width, height, left, top, originX, originY, angle, scaleX, scaleY } =
    object;

  return {
    angle,
    left,
    top,
    scaleX,
    scaleY,
    width,
    height,
    originX,
    originY,
    boundingRect: object.getBoundingRect(true)
  };
};
