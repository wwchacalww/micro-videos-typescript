import { deepFreeze } from "./object";

describe("object Unit Test", () => {
  it("should not freeze a scalar value", () => {
    const str = deepFreeze("a");
    expect(typeof str).toBe("string");
    let boolean = deepFreeze(true);
    expect(typeof boolean).toBe("boolean");
    boolean = deepFreeze(false);
    expect(typeof boolean).toBe("boolean");
    const number = deepFreeze(5);
    expect(typeof number).toBe("number");
  });
  it("should turn immutable a object", () => {
    const obj = deepFreeze({
      prop: "value",
      deep: { prop2: "Value2", prop3: new Date() },
    });
    expect(() => ((obj as any).prop = "aaaa")).toThrow(
      "Cannot assign to read only property 'prop' of object '#<Object>'"
    );
    expect(() => ((obj as any).deep.prop2 = "aaaa")).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );
    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });
});
