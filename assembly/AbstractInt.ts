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

/** Representation for a Int value in the system. */
export class AbstractInt<T extends number> implements UnwrappableCodec<T> {
    protected byteLength: i32;
    protected _value: T;

    constructor(value: T, byteLength: i32) {
        this._value = value;
        this.byteLength = byteLength;
    }

    /**
     * @description Returns the inner native value
     */
    @inline
    unwrap(): T {
        return this._value;
    }

    /** Encodes the value as u8[] as per the SCALE codec specification */
    toU8a(): u8[] {
        let bytesEncoded = new Array<u8>(this.byteLength);
        Bytes.putUint<T>(bytesEncoded, this.unwrap(), this.byteLength);
        return bytesEncoded;
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        assert(bytes.length - index > 0, "AbstractInt: Invalid bytes provided");
        this._value = Bytes.toUint<T>(bytes, this.byteLength, index);
        return this.encodedLength() + index;
    }

    /**
     * @description Returns the string representation of the value
     */
    @inline
    toString(): string {
        return this.unwrap().toString();
    }
    /**
     * @description The length of Uint8Array when the value is encoded
     */
    @inline
    encodedLength(): i32 {
        return this.byteLength;
    }

    @inline
    @operator("==")
    eq(other: AbstractInt<T>): bool {
        return this.unwrap() == other.unwrap();
    }

    @inline
    @operator("!=")
    notEq(other: AbstractInt<T>): bool {
        return this.unwrap() != other.unwrap();
    }

    @inline
    @operator(">")
    gt(other: this): bool {
        return this._value > other._value;
    }

    @inline
    @operator(">=")
    ge(other: this): bool {
        return this._value >= other._value;
    }

    @inline
    @operator("<")
    lt(other: this): bool {
        return this._value < other._value;
    }

    @inline
    @operator("<=")
    le(other: this): bool {
        return this._value <= other._value;
    }

    @inline
    @operator(">>")
    shr(other: this): this {
        return new AbstractInt<T>(this._value >> other._value, this.byteLength);
    }

    @inline
    @operator(">>>")
    shr_u(other: this): this {
        return new AbstractInt<T>(
            this._value >>> other._value,
            this.byteLength
        );
    }

    @inline
    @operator("<<")
    shl(other: this): this {
        return new AbstractInt<T>(this._value << other._value, this.byteLength);
    }

    @inline
    @operator("&")
    and(other: this): this {
        return new AbstractInt<T>(this._value & other._value, this.byteLength);
    }

    @inline
    @operator("|")
    or(other: this): this {
        return new AbstractInt<T>(this._value | other._value, this.byteLength);
    }

    @inline
    @operator("^")
    xor(other: this): this {
        return new AbstractInt<T>(this._value ^ other._value, this.byteLength);
    }

    @inline
    @operator("+")
    add(other: this): this {
        return new AbstractInt<T>(this._value + other._value, this.byteLength);
    }

    @inline
    @operator("-")
    sub(other: this): this {
        return new AbstractInt<T>(this._value - other._value, this.byteLength);
    }

    @inline
    @operator("*")
    mul(other: this): this {
        return new AbstractInt<T>(this._value * other._value, this.byteLength);
    }

    @inline
    @operator("/")
    div(other: this): this {
        return new AbstractInt<T>(this._value / other._value, this.byteLength);
    }

    @inline
    @operator("**")
    pow(other: this): this {
        return new AbstractInt<T>(this._value ** other._value, this.byteLength);
    }

    @inline
    @operator("%")
    rem(other: this): this {
        return new AbstractInt<T>(this._value % other._value, this.byteLength);
    }

    @inline
    @operator.prefix("!")
    isEmpty(): bool {
        return !this._value;
    }

    @inline
    @operator.prefix("~")
    not(): this {
        return new AbstractInt<T>(~this._value, this.byteLength);
    }

    @inline
    @operator.prefix("+")
    pos(): this {
        return new AbstractInt<T>(+this._value, this.byteLength);
    }

    @inline
    @operator.prefix("-")
    neg(): this {
        return new AbstractInt<T>(-this._value, this.byteLength);
    }
    @operator.prefix("++")
    preInc(): this {
        return ++this._value;
    }

    @operator.prefix("--")
    preDec(): this {
        return --this._value;
    }

    @operator.postfix("++")
    postInc(): this {
        let val = this._value;
        return new AbstractInt<T>(++val, this.byteLength);
    }

    @operator.postfix("--")
    postDec(): this {
        let val = this._value;
        return new AbstractInt<T>(--val, this.byteLength);
    }
}
