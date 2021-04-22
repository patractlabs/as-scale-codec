import { Codec } from "./interfaces/Codec";
import { instantiateZero } from "./utils";

/**
 * @description SCALE Codec support for `void`
 */
export class Option<T extends Codec> implements Codec {
    constructor(
        private readonly val: T = instantiateZero<T>(),
        private _isNone: bool = true
    ) {}

    @inline
    static Some<T extends Codec>(val: T): Option<T> {
        return new Option<T>(val, false);
    }

    @inline
    static None<T extends Codec>(): Option<T> {
        return new Option<T>(instantiateZero<T>(), true);
    }

    @inline
    get isSome(): bool {
        return !this._isNone;
    }

    @inline
    get isNone(): bool {
        return this._isNone;
    }

    @inline
    unwrap(): T {
        return this.expect("Option: Unwrap none");
    }

    @inline
    expect(msg: string): T {
        assert(this.isSome, msg);
        return this.val;
    }

    @inline
    unwrapOr(def: T): T {
        if (this.isSome) {
            return this.val;
        }
        return def;
    }

    toU8a(): u8[] {
        if (this.isNone) {
            return [0x00];
        }
        let ret = this.val.toU8a();
        ret.unshift(0x01);
        return ret;
    }

    encodedLength(): i32 {
        if (this.isNone) {
            return 1;
        }
        return 1 + this.val.encodedLength();
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        const b = bytes[index];
        if (b == 0x00) {
            this._isNone = true;
            return index + 1;
        } else if (b == 0x01) {
            this._isNone = false;
            return this.val.populateFromBytes(bytes, index + 1);
        } else {
            assert(false, "Option first byte must be 0x00 or 0x01");
        }
        return index;
    }

    @inline
    @operator("==")
    eq(other: Option<T>): bool {
        return this.val == other.val;
    }

    @inline
    @operator("!=")
    notEq(other: Option<T>): bool {
        return !this.eq(other);
    }
}
