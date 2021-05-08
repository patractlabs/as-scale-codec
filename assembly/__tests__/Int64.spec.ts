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
describe("Int64", () => {
    it("should encode int64", () => {
        let v1 = new Int64(1);
        expect<u8[]>(v1.toU8a()).toStrictEqual([0x01, 0, 0, 0, 0, 0, 0, 0]);
        expect<i32>(v1.encodedLength()).toStrictEqual(8);

        let v2 = new Int64(16383);
        expect<u8[]>(v2.toU8a()).toStrictEqual([0xff, 0x3f, 0, 0, 0, 0, 0, 0]);
        expect<i32>(v2.encodedLength()).toStrictEqual(8);

        let v3 = new Int64(1073741823);
        expect<u8[]>(v3.toU8a()).toStrictEqual([
            0xff,
            0xff,
            0xff,
            0x3f,
            0,
            0,
            0,
            0,
        ]);
        expect<i32>(v3.encodedLength()).toStrictEqual(8);

        let v4 = new Int64(9223372036854775807);
        expect<u8[]>(v4.toU8a()).toStrictEqual([
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0x7f,
        ]);
        expect<i32>(v4.encodedLength()).toStrictEqual(8);

        let v5 = new Int64(-1);
        expect<u8[]>(v5.toU8a()).toStrictEqual([
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ]);
        expect<i32>(v5.encodedLength()).toStrictEqual(8);

        let v6 = new Int64(-16383);
        expect<u8[]>(v6.toU8a()).toStrictEqual([
            0x01,
            0xc0,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ]);
        expect<i32>(v6.encodedLength()).toStrictEqual(8);

        let v7 = new Int64(-1073741823);
        expect<u8[]>(v7.toU8a()).toStrictEqual([
            0x01,
            0x00,
            0x00,
            0xc0,
            0xff,
            0xff,
            0xff,
            0xff,
        ]);
        expect<i32>(v7.encodedLength()).toStrictEqual(8);

        let v8 = new Int64(-9223372036854775807);
        expect<u8[]>(v8.toU8a()).toStrictEqual([0x01, 0, 0, 0, 0, 0, 0, 0x80]);
        expect<i32>(v8.encodedLength()).toStrictEqual(8);
    });

    it("should decode int64", () => {
        expect<Int64>(Int64.fromU8a([0x01])).toStrictEqual(new Int64(1));
        expect<Int64>(Int64.fromU8a([0xff, 0x3f])).toStrictEqual(
            new Int64(16383)
        );
        expect<Int64>(
            Int64.fromU8a([0xff, 0xff, 0xff, 0x3f, 0, 0, 0, 0])
        ).toStrictEqual(new Int64(1073741823));
        expect<Int64>(
            Int64.fromU8a([0x01, 0x00, 0x00, 0xc0, 0xff, 0xff, 0xff, 0xff])
        ).toStrictEqual(new Int64(-1073741823));
        expect<Int64>(
            Int64.fromU8a([0x01, 0, 0, 0, 0, 0, 0, 0x80])
        ).toStrictEqual(new Int64(-9223372036854775807));
    });

    it("should decode int64 with populate method", () => {
        const int64 = new Int64();
        int64.populateFromBytes([
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0x7f,
        ]);
        expect<Int64>(int64).toStrictEqual(new Int64(9223372036854775807));
        int64.populateFromBytes([
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ]);
        expect<Int64>(int64).toStrictEqual(new Int64(-1));
        int64.populateFromBytes([
            0x01,
            0xc0,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ]);
        expect<Int64>(int64).toStrictEqual(new Int64(-16383));
    });

    it("should decode only eight bytes", () => {
        expect<Int64>(
            Int64.fromU8a([0x01, 0x01, 0xff, 0x3f, 0, 0, 0, 0, 0, 0], 2)
        ).toStrictEqual(new Int64(16383));
        expect<Int64>(
            Int64.fromU8a(
                [0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0, 0, 0, 0],
                3
            )
        ).toStrictEqual(new Int64(1));
    });

    itThrows("should throw when empty array is provided", () => {
        let v1 = Int64.fromU8a([]);
    });

    itThrows("should throw when index is out of range", () => {
        let v1 = Int64.fromU8a([1, 0, 1, 3], 4);
    });
});
