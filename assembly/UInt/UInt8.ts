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
// limitations under the License.

import { AbstractInt } from "../AbstractInt";
import { BYTE_LENGTH } from "../utils/Bytes";

/** Representation for a UInt8 value in the system. */
export class UInt8 extends AbstractInt<u8> {
    constructor(value: u8 = 0) {
        super(value, BYTE_LENGTH.INT_8);
    }

    /**
     * @description Instantiates new UInt8 from u8[] SCALE encoded bytes
     * NOTE: if the length of the provided value is less than the byte length of the UInt8,
     * it is filled with 0 bytes
     */
    static fromU8a(value: u8[], index: i32 = 0): UInt8 {
        assert(
            value.length - index > 0,
            "Uint8: cannot decode invalid u8 encoded value"
        );
        return new UInt8(value[index]);
    }

    @inline
    @operator("==")
    static eq(a: UInt8, b: UInt8): bool {
        return a.eq(b);
    }

    @inline
    @operator("!=")
    static notEq(a: UInt8, b: UInt8): bool {
        return a.notEq(b);
    }
}
