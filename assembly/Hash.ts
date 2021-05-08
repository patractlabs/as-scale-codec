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

import { UnwrappableCodec } from "./interfaces/UnwrappableCodec";
import { Bytes } from "./utils/Bytes";

export class Hash implements UnwrappableCodec<Array<u8>> {
    protected _values: Array<u8>;

    constructor(value: u8[] = []) {
        this._values = new Array<u8>(32);
        Bytes.copy(value, this._values);
    }

    /**
     * @description Returns the inner native value
     */
    @inline
    unwrap(): Array<u8> {
        return this._values;
    }

    /**
     * @description  Encodes Hash as u8[] as per the SCALE codec specification
     */
    toU8a(): u8[] {
        const result: u8[] = new Array<u8>(this.encodedLength());
        Bytes.copy<u8>(this._values, result);

        return result;
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model.
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        assert(bytes.length - index >= 0, "Hash: Empty bytes array provided");
        this._values = new Array<u8>(32);
        Bytes.copy(bytes, this._values, 0, index);
        return this.encodedLength();
    }

    /**
     * @description  Return string representation of Hash
     */
    toString(): string {
        return (
            "0x" +
            this._values
                .map<string>((v) => {
                    let res = v.toString(16);
                    if (res.length == 1) {
                        res = "0" + res;
                    }
                    return res;
                })
                .join("")
        );
    }

    /**
     * @description  Instantiate Hash from bytes cropped from the left.
     */
    static bytesToHash(bytes: u8[]): Hash {
        let hash = new Hash([]);
        if (bytes.length > 32) {
            bytes = bytes.slice(bytes.length - 32);
        }

        const position: i32 = 32 - bytes.length;
        Bytes.copy<u8>(bytes, hash.unwrap(), position);
        return hash;
    }

    /**
     * @description The length of encoded Hash
     */
    @inline
    encodedLength(): i32 {
        return 32;
    }

    /**
     * @description Instantiates Hash from u8[] SCALE encoded bytes
     * @param input SCALE encoded bytes
     * @param index an index of input to start decoding from
     */
    static fromU8a(input: u8[], index: i32 = 0): Hash {
        assert(input.length - index >= 0, "Hash: Empty bytes array provided");
        return new Hash(input.slice(index));
    }

    @operator("==")
    eq(other: this): bool {
        for (let i = 0; i < this.unwrap().length; i++) {
            if (this._values[i] != other._values[i]) {
                return false;
            }
        }
        return true;
    }

    @inline
    @operator("!=")
    notEq(other: this): bool {
        return !this.eq(other);
    }
}
