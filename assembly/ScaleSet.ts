import { CompactInt } from "./Int/CompactInt";
import { BytesReader } from "./BytesReader";
import { Codec } from "./interfaces/Codec";
import { UnwrappableCodec } from "./interfaces/UnwrappableCodec";

/**
 * @description SCALE Codec support for native Set type
 */
export class ScaleSet<T extends Codec>
    extends Set<T>
    implements UnwrappableCodec<Set<T>> {
    /**
     * @description return underlying native type
     */
    @inline
    unwrap(): Set<T> {
        // TODO: remove unwrap?
        return this;
    }

    /**
     * The number of bytes this Set has
     */
    @inline
    encodedLength(): i32 {
        return this.toU8a().length;
    }
    /**
     * Convert it to u8[]
     * Length is encoded first, followed by all key and value encodings concatenated
     */
    toU8a(): u8[] {
        const values: T[] = this.values();
        let len: CompactInt = new CompactInt(values.length);
        const result: Array<Array<u8>> = [len.toU8a()];
        for (let i = 0; i < values.length; i++) {
            result.push(values[i].toU8a());
        }
        return result.flat();
    }

    /**
     * @description Non-static constructor
     * @param bytes
     * @param index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        const bytesReader = new BytesReader(bytes, index);
        const lenComp = bytesReader.readInto<CompactInt>();
        for (let i: i32 = 0; i < lenComp.unwrap(); i++) {
            const value = bytesReader.readInto<T>();
            this.add(value);
        }

        return bytesReader.currentIndex();
    }

    @operator("==")
    eq(other: ScaleSet<T>): bool {
        const aLen = this.size;
        const bLen = other.size;
        const aValues = this.values();
        const bValues = other.values();

        if (aLen != bLen) {
            return false;
        }
        for (let i = 0; i < aValues.length; i++) {
            if (aValues[i] != bValues[i]) {
                return false;
            }
        }
        return true;
    }

    @operator("!=")
    notEq(other: ScaleSet<T>): bool {
        return !this.eq(other);
    }

    static fromU8a<T extends Codec>(input: u8[], index: i32 = 0): ScaleSet<T> {
        const set = new ScaleSet<T>();
        const bytesReader = new BytesReader(input, index);
        const len = bytesReader.readInto<CompactInt>().unwrap();

        for (let i: i32 = 0; i < len; i++) {
            const val = bytesReader.readInto<T>();
            set.add(val);
        }
        return set;
    }
}
