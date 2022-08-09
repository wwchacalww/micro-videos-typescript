import ValueObject from "../value-object";
class StubValueObject extends ValueObject {}
describe("ValueObject Unit Tests", () => {
  it("Should create a value object", () => {
    let vo = new StubValueObject("Value string Object");
    expect(vo.value).toBe("Value string Object");

    vo = new StubValueObject({ prop: "Value 1" });
    expect(vo.value).toStrictEqual({ prop: "Value 1" });
  });

  describe("should convert to a string", () => {
    const date = new Date();
    let arrange = [
      { recived: "", expected: "" },
      { recived: 0, expected: "0" },
      { recived: 1, expected: "1" },
      { recived: -5, expected: "-5" },
      {
        recived: { prop: "Value1" },
        expected: JSON.stringify({ prop: "Value1" }),
      },
      { recived: true, expected: "true" },
      { recived: false, expected: "false" },
      { recived: date, expected: date.toString() },
    ];

    test.each(arrange)(
      "from $recived to $expected",
      ({ recived, expected }) => {
        let vo = new StubValueObject(recived);
        expect(vo + "").toBe(expected);
      }
    );
  });

  it("should be a immutable object", () => {
    const obj = {
      prop: "value",
      deep: { prop2: "Value2", prop3: new Date() },
    };

    const vo = new StubValueObject(obj);
    expect(() => ((vo as any).value.prop = "test")).toThrow(
      "Cannot assign to read only property 'prop' of object '#<Object>'"
    );
    expect(() => ((vo as any).value.deep.prop2 = "test")).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );
    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
