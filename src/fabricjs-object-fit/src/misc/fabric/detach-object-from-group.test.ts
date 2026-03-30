import * as fabric from "fabric";
import { detachObjectFromGroup } from "./detach-object-from-group";
import { fabricObjectDefaults } from "./fabric-object-defaults";

describe(detachObjectFromGroup.name, () => {
  it("should remove object from its group", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 50,
      height: 50,
    });
    const group = new fabric.Group([obj], { ...fabricObjectDefaults });

    expect(obj.group).toBeDefined();

    detachObjectFromGroup(obj);

    expect(group.getObjects()).toHaveLength(0);
  });

  it("should not crash when object has no group", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 50,
      height: 50,
    });

    expect(() => detachObjectFromGroup(obj)).not.toThrow();
  });
});
