// Copyright 2020 LimeChain Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.с

import { Int8 } from "../Int/Int8";
import { Int16 } from "../Int/Int16";
import { Int32 } from "../Int/Int32";
import { Int64 } from "../Int/Int64";

describe("Int32", () => {
    it("should encode int32", () => {
        let v1 = new Int32(1);
        expect<u8[]>(v1.toU8a()).toStrictEqual([0x01, 0, 0, 0]);
        expect<i32>(v1.encodedLength()).toStrictEqual(4);

        let v2 = new Int32(16383);
        expect<u8[]>(v2.toU8a()).toStrictEqual([0xff, 0x3f, 0, 0]);
        expect<i32>(v2.encodedLength()).toStrictEqual(4);

        let v3 = new Int32(1073741823);
        expect<u8[]>(v3.toU8a()).toStrictEqual([0xff, 0xff, 0xff, 0x3f]);
        expect<i32>(v3.encodedLength()).toStrictEqual(4);

        let v4 = new Int32(-1);
        expect<u8[]>(v4.toU8a()).toStrictEqual([0xff, 0xff, 0xff, 0xff]);
        expect<i32>(v4.encodedLength()).toStrictEqual(4);

        let v5 = new Int32(-16383);
        expect<u8[]>(v5.toU8a()).toStrictEqual([0x01, 0xc0, 0xff, 0xff]);
        expect<i32>(v5.encodedLength()).toStrictEqual(4);

        let v6 = new Int32(-1073741823);
        expect<u8[]>(v6.toU8a()).toStrictEqual([0x01, 0x00, 0x00, 0xc0]);
        expect<i32>(v6.encodedLength()).toStrictEqual(4);
    });

    it("should decode int32", () => {
        expect<Int32>(Int32.fromU8a([0x01])).toStrictEqual(new Int32(1));
        expect<Int32>(Int32.fromU8a([0xff, 0x3f])).toStrictEqual(
            new Int32(16383)
        );
        expect<Int32>(Int32.fromU8a([0xff, 0xff, 0xff, 0x3f])).toStrictEqual(
            new Int32(1073741823)
        );
        expect<Int32>(Int32.fromU8a([0x01, 0xc0, 0xff, 0xff])).toStrictEqual(
            new Int32(-16383)
        );
    });

    it("should decode int32 with populate method", () => {
        const int32 = new Int32();
        int32.populateFromBytes([0xff, 0xff, 0xff, 0x3f]);
        expect<Int32>(int32).toStrictEqual(new Int32(1073741823));
        int32.populateFromBytes([0xff, 0xff, 0xff, 0xff]);
        expect<Int32>(int32).toStrictEqual(new Int32(-1));
        int32.populateFromBytes([0x01, 0xc0, 0xff, 0xff]);
        expect<Int32>(int32).toStrictEqual(new Int32(-16383));
        int32.populateFromBytes([0x01, 0x00, 0x00, 0xc0]);
        expect<Int32>(int32).toStrictEqual(new Int32(-1073741823));
    });

    it("should decode only four bytes", () => {
        expect<Int32>(
            Int32.fromU8a([0x01, 0x01, 0x00, 0x00, 0xc0], 1)
        ).toStrictEqual(new Int32(-1073741823));
        expect<Int32>(
            Int32.fromU8a([0x01, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00], 3)
        ).toStrictEqual(new Int32(255));
    });

    itThrows("should throw when empty array is provided", () => {
        let v1 = Int32.fromU8a([]);
    });
    itThrows("should throw when index is out of range", () => {
        let v1 = Int32.fromU8a([0, 0, 1, 1, 0, 1, 12, 123, 12], 9);
    });
});
