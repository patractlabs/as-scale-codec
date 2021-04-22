import { Codec } from "./interfaces/Codec";
import { instantiateZero } from "./utils";
import { Option } from "./Option";

/**
 * @description SCALE Codec support for `void`
 */
export class Result<O extends Codec, E extends Codec> implements Codec {
    constructor(
        private readonly _ok: O = instantiateZero<O>(),
        private readonly _err: E = instantiateZero<E>(),
        private _is_err: bool = false
    ) {}

    @inline
    static Ok<O extends Codec, E extends Codec>(ok: O): Result<O, E> {
        return new Result<O, E>(ok, instantiateZero<E>());
    }

    @inline
    static Err<O extends Codec, E extends Codec>(err: E): Result<O, E> {
        return new Result<O, E>(instantiateZero<O>(), err, true);
    }

    @inline
    get isOk(): bool {
        return !this._is_err;
    }

    @inline
    get isErr(): bool {
        return this._is_err;
    }

    ok(): Option<O> {
        if (this.isOk) {
            return Option.Some(this._ok);
        }
        return Option.None<O>();
    }

    err(): Option<E> {
        if (this.isErr) {
            return Option.Some(this._err);
        }
        return Option.None<E>();
    }

    @inline
    unwrap(): O {
        return this.expect("Result: Unwrap ok");
    }

    @inline
    unwrapErr(): E {
        return this.expectErr("Result: Unwrap err");
    }

    @inline
    unwrapOr(optb: O): O {
        if (this.isOk) {
            return this._ok;
        }
        return optb;
    }

    @inline
    expect(message: string): O {
        assert(this.isOk, message);
        return this._ok;
    }

    @inline
    expectErr(message: string): E {
        assert(this.isErr, message);
        return this._err;
    }

    toU8a(): u8[] {
        if (this.isOk) {
            let ret = this._ok.toU8a();
            ret.unshift(0x00);
            return ret;
        }
        let ret = this._err.toU8a();
        ret.unshift(0x01);
        return ret;
    }

    encodedLength(): i32 {
        if (this.isOk) {
            return 1 + this._ok.encodedLength();
        }
        return 1 + this._err.encodedLength();
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        const b = bytes[index];
        if (b == 0x00) {
            this._is_err = false;
            return this._ok.populateFromBytes(bytes, index + 1);
        } else if (b == 0x01) {
            this._is_err = true;
            return this._err.populateFromBytes(bytes, index + 1);
        } else {
            assert(false, "Result first byte must be 0x00 or 0x01");
        }
        return index;
    }

    @inline
    @operator("==")
    eq(other: Result<O, E>): bool {
        if (this.isOk && other.isOk) {
            return this._ok == other._ok;
        }
        if (this.isErr && other.isErr) {
            return this._err == other._err;
        }
        return false;
    }

    @inline
    @operator("!=")
    notEq(other: Result<O, E>): bool {
        return !this.eq(other);
    }
}
