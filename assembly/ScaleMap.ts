import { CompactInt } from "./Int/CompactInt";
import { BytesReader } from "./BytesReader";
import { Codec } from "./interfaces/Codec";
import { UnwrappableCodec } from "./interfaces/UnwrappableCodec";

/**
 * @description SCALE Codec support for native Map type
 */
export class ScaleMap<K extends Codec, V extends Codec>
    extends Map<K, V>
    implements UnwrappableCodec<Map<K, V>> {
    /**
     * @description return underlying native type
     */
    @inline
    unwrap(): Map<K, V> {
        return this;
    }

    /**
     * The number of bytes this Map has
     */
    @inline
    encodedLength(): i32 {
        return this.toU8a().length;
    }
    /**
     * Convert ScaleMap to u8[]
     * Length is encoded first, followed by all key and value encodings concatenated
     */
    toU8a(): u8[] {
        const keys: K[] = this.keys();
        const values: V[] = this.values();
        const len: CompactInt = new CompactInt(keys.length);
        const result: Array<Array<u8>> = [len.toU8a()];
        for (let i = 0; i < keys.length; i++) {
            result.push(keys[i].toU8a());
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
        const len = bytesReader.readInto<CompactInt>().unwrap();
        for (let i: i32 = 0; i < len; i++) {
            const key = bytesReader.readInto<K>();
            const value = bytesReader.readInto<V>();
            this.set(key, value);
        }

        return bytesReader.currentIndex();
    }

    @operator("==")
    eq(other: this): bool {
        return this === other;
    }

    @operator("!=")
    notEq(other: this): bool {
        return !this.eq(other);
    }

    static fromU8a<K extends Codec, V extends Codec>(
        input: u8[],
        index: i32 = 0
    ): ScaleMap<K, V> {
        const map = new ScaleMap<K, V>();
        const bytesReader = new BytesReader(input, index);
        const len = bytesReader.readInto<CompactInt>().unwrap();
        for (let i: i32 = 0; i < len; i++) {
            const key = bytesReader.readInto<K>();
            const value = bytesReader.readInto<V>();
            map.set(key, value);
        }
        return map;
    }
}
