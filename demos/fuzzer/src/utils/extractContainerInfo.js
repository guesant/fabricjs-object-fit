import { extractObjectInfo } from "./extractObjectInfo";

export const extractContainerInfo = (container) => {
  const { mode, width, height, position } = container;

  return {
    mode,
    width,
    height,
    position: {
      x: String(position.x),
      y: String(position.y)
    },

    container: {
      ...extractObjectInfo(container)
    },

    ...(container.object ? { object: extractObjectInfo(container.object) } : {})
  };
};
