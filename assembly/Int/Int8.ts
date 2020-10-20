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
import { BIT_LENGTH } from "../utils/Bytes";

/** Representation for a Int8 value in the system. */
export class Int8 extends AbstractInt<i8> {

    constructor (value: i8) {
        super(value, BIT_LENGTH.INT_8)
    }

    /** Instantiates new Int8 from u8[] SCALE encoded bytes */
    static fromU8a (value: u8[], curIndex: i32 = 0): Int8 {
        value = curIndex ? value.slice(curIndex) : value;
        assert(value.length > 0, 'Int8: empty bytes array provided');
        return new Int8(value[0]);
    }

    @inline @operator('==')
    static eq(a: Int8, b: Int8): bool {
        return a.value == b.value;
    }

    @inline @operator('!=')
    static notEq(a: Int8, b: Int8): bool {
        return a.value != b.value;
    }
}
