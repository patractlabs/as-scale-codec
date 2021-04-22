import { Bool, Result } from "../index";
import { Int32 } from "../Int/Int32";
import { ScaleString } from "../ScaleString";

describe("Result", () => {
    it("should encode Ok true", () => {
        let v = new Bool(true);
        let res = Result.Ok<Bool, ScaleString>(v);
        expect(res.toU8a()).toStrictEqual([0x00, 0x01]);
    });

    it("should encode Err String", () => {
        {
            let res = Result.Err<Bool, ScaleString>(new ScaleString("233"));
            expect(res.toU8a()).toStrictEqual([0x01, 0xc, 0x32, 0x33, 0x33]);
        }
        {
            let res = Result.Err<Bool, ScaleString>(new ScaleString("a"));
            expect(res.toU8a()).toStrictEqual([0x01, 0x04, 0x61]);
        }
    });

    it("should instantiate Ok from U8Array", () => {
        let res = instantiate<Result<Int32, ScaleString>>();
        let index = res.populateFromBytes([0x00, 0x01, 0x00, 0x00, 0x00]);
        expect(index).toBe(5);
        expect(res).toStrictEqual(Result.Ok<Int32, ScaleString>(new Int32(0x01)));
    });

    it("should instantiate Err from U8Array", () => {
        let res = instantiate<Result<Int32, ScaleString>>();
        let index = res.populateFromBytes([0x01, 0x04, 0x61]);
        expect(index).toBe(3);
        expect(res).toStrictEqual(Result.Err<Int32, ScaleString>(new ScaleString("a")));
    });
});
