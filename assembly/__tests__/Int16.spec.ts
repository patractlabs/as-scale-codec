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

import { Int16 } from "../Int/Int16";

describe("Int16", () => {
    it("should encode int16", () => {
        let v1 = new Int16(1);
        expect<u8[]>(v1.toU8a()).toStrictEqual([0x01, 0]);
        expect<i32>(v1.encodedLength()).toStrictEqual(2);

        let v2 = new Int16(15);
        expect<u8[]>(v2.toU8a()).toStrictEqual([0xf, 0]);
        expect<i32>(v2.encodedLength()).toStrictEqual(2);

        let v3 = new Int16(16);
        expect<u8[]>(v3.toU8a()).toStrictEqual([0x10, 0]);
        expect<i32>(v3.encodedLength()).toStrictEqual(2);

        let v4 = new Int16(127);
        expect<u8[]>(v4.toU8a()).toStrictEqual([0x7f, 0]);
        expect<i32>(v4.encodedLength()).toStrictEqual(2);

        let v5 = new Int16(-1);
        expect<u8[]>(v5.toU8a()).toStrictEqual([0xff, 0xff]);
        expect<i32>(v5.encodedLength()).toStrictEqual(2);

        let v6 = new Int16(-15);
        expect<u8[]>(v6.toU8a()).toStrictEqual([0xf1, 0xff]);
        expect<i32>(v6.encodedLength()).toStrictEqual(2);

        let v7 = new Int16(-127);
        expect<u8[]>(v7.toU8a()).toStrictEqual([0x81, 0xff]);
        expect<i32>(v7.encodedLength()).toStrictEqual(2);

        let v8 = new Int16(15000);
        expect<u8[]>(v8.toU8a()).toStrictEqual([0x98, 0x3a]);
        expect<i32>(v8.encodedLength()).toStrictEqual(2);

        let v9 = new Int16(16383);
        expect<u8[]>(v9.toU8a()).toStrictEqual([0xff, 0x3f]);
        expect<i32>(v9.encodedLength()).toStrictEqual(2);

        let v10 = new Int16(-15000);
        expect<u8[]>(v10.toU8a()).toStrictEqual([0x68, 0xc5]);
        expect<i32>(v10.encodedLength()).toStrictEqual(2);

        let v11 = new Int16(-16383);
        expect<u8[]>(v11.toU8a()).toStrictEqual([0x01, 0xc0]);
        expect<i32>(v11.encodedLength()).toStrictEqual(2);
    });

    it("should decode int16", () => {
        expect<Int16>(Int16.fromU8a([0x01])).toStrictEqual(new Int16(1));
        expect<Int16>(Int16.fromU8a([0xf])).toStrictEqual(new Int16(15));
        expect<Int16>(Int16.fromU8a([0x10])).toStrictEqual(new Int16(16));
        expect<Int16>(Int16.fromU8a([0x7f, 0])).toStrictEqual(new Int16(127));
        expect<Int16>(Int16.fromU8a([0xff, 0xff])).toStrictEqual(new Int16(-1));
        expect<Int16>(Int16.fromU8a([0xf1, 0xff])).toStrictEqual(
            new Int16(-15)
        );
        expect<Int16>(Int16.fromU8a([0x81, 0xff])).toStrictEqual(
            new Int16(-127)
        );
    });

    it("should decode int16 with populate method", () => {
        const int16 = new Int16();
        int16.populateFromBytes([0x98, 0x3a]);
        expect<Int16>(int16).toStrictEqual(new Int16(15000));
        int16.populateFromBytes([0xff, 0x3f]);
        expect<Int16>(int16).toStrictEqual(new Int16(16383));
        int16.populateFromBytes([0x68, 0xc5]);
        expect<Int16>(int16).toStrictEqual(new Int16(-15000));
        int16.populateFromBytes([0x01, 0xc0]);
        expect<Int16>(int16).toStrictEqual(new Int16(-16383));
    });

    it("should decode only two bytes", () => {
        expect<Int16>(Int16.fromU8a([0x01, 0x81, 0xff, 0x01], 1)).toStrictEqual(
            new Int16(-127)
        );
        expect<Int16>(
            Int16.fromU8a([0, 0, 0, 0, 0xff, 0x00, 0, 0, 0, 0], 4)
        ).toStrictEqual(new Int16(255));
    });

    itThrows("should throw when empty array is provided", () => {
        let v1 = Int16.fromU8a([]);
    });
    itThrows("should throw when index is out of range", () => {
        let v1 = Int16.fromU8a([1, 0, 1, 12, 123, 1], 6);
    });
});


