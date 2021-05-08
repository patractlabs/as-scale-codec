import { BytesReader } from "../BytesReader";
import { CompactInt } from "../Int/CompactInt";
import { Codec } from "../interfaces/Codec";
import { UnwrappableCodec } from "../interfaces/UnwrappableCodec";
import { ArrayUtils } from "../utils/Arrays";
import { BytesBuffer } from "../utils/BytesBuffer";

export class ScaleArray<T extends Codec>
    extends Array<T>
    implements UnwrappableCodec<Array<T>> {
    constructor(length?: i32) {
        super(length);
    }

    /**
     * @description Returns the inner native value
     */
    unwrap(): Array<T> {
        // TODO: should copy it?
        return this;
    }

    /**
     * @description  Encodes values of all elements in u8[] successively as per the SCALE codec specification
     */
    toU8a(): u8[] {
        const bytesBuffer = new BytesBuffer();
        bytesBuffer.encodeCompactInt(this.length);
        for (let i = 0; i < this.length; i++) {
            const element = instantiate<T>(this[i]);
            bytesBuffer.write(element.toU8a());
        }

        return bytesBuffer.bytes;
    }

    /**
     * @description Returns encoded byte length of the type
     */
    encodedLength(): i32 {
        let len = 0;
        for (let i = 0; i < this.length; i++) {
            len += this[i].encodedLength();
        }
        return len;
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32): i32 {
        const bytesReader = new BytesReader(bytes, index);
        const data = bytesReader.readInto<CompactInt>();
        for (let i: i32 = 0; i < data.unwrap(); i++) {
            const element: T = bytesReader.readInto<T>();
            this.push(element);
        }
        return bytesReader.currentIndex();
    }

    @inline
    @operator("==")
    eq(other: ScaleArray<T>): bool {
        return ArrayUtils.areArraysEqual(this, other);
    }

    @inline
    @operator("!=")
    notEq(other: ScaleArray<T>): bool {
        return !ArrayUtils.areArraysEqual(this, other);
    }

    /**
     * @description  Instantiates type of ScaleArray from u8[] SCALE encoded bytes (Decode)
     */
    static fromU8a<T extends Codec>(input: u8[]): ScaleArray<T> {
        const scaleArray = instantiate<ScaleArray<T>>([]);
        scaleArray.populateFromBytes(input, 0);
        return scaleArray;
    }
}
