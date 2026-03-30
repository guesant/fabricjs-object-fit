const extractObjectInfo = (object) => {
  const { width, height, left, top, originX, originY, angle, scaleX, scaleY } =
    object;
  return { angle, left, top, scaleX, scaleY, width, height, originX, originY };
};

export const extractContainerInfo = (container) => {
  const { mode, width, height, position } = container;
  return {
    mode,
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100,
    position: {
      x: position.x?.toString?.() ?? String(position.x),
      y: position.y?.toString?.() ?? String(position.y),
    },
    container: extractObjectInfo(container),
    ...(container.object
      ? { object: extractObjectInfo(container.object) }
      : {}),
  };
};
