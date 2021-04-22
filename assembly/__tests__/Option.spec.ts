import { Bool, Option } from "../index";
import { Int32 } from "../Int/Int32";

describe("Option", () => {
    it("should encode Some", () => {
        let v = new Bool(true);
        let opt = Option.Some(v);
        expect<u8[]>(opt.toU8a()).toStrictEqual([0x01, 0x01]);
    });

    it("should encode None", () => {
        let opt = Option.None<Bool>();
        expect<u8[]>(opt.toU8a()).toStrictEqual([0x00]);
    });

    it("should instantiate Some from U8Array", () => {
        let opt = instantiate<Option<Int32>>();
        let index = opt.populateFromBytes([0x01, 0x01, 0x00, 0x00, 0x00]);
        expect(index).toBe(5);
        expect(opt).toStrictEqual(Option.Some<Int32>(new Int32(0x01)));
    });

    it("should instantiate None from U8Array", () => {
        let opt = instantiate<Option<Int32>>();
        let index = opt.populateFromBytes([0x00, 0x01, 0x00, 0x00, 0x00]);
        expect(index).toBe(1);
        expect(opt).toStrictEqual(Option.None<Int32>());
    });
});
