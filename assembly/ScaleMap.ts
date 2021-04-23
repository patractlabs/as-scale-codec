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
        // TODO: optimize
        let result: u8[] = [];
        let keys: K[] = this.keys();
        let lenData: CompactInt = new CompactInt(keys.length);
        result = result.concat(lenData.toU8a());
        for (let i = 0; i < keys.length; i++) {
            result = result
                .concat(keys[i].toU8a())
                .concat(this.get(keys[i]).toU8a());
        }
        return result;
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
            const key = bytesReader.readInto<K>();
            const value = bytesReader.readInto<V>();
            this.set(key, value);
        }

        return bytesReader.currentIndex();
    }
    /**
     * @description Overloaded == operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    @operator("==")
    eq(other: ScaleMap<K, V>): bool {
        let areEqual = true;
        const aKeys = this.keys();
        const bKeys = other.keys();

        if (aKeys.length != bKeys.length) {
            return false;
        }
        for (let i = 0; i < aKeys.length; i++) {
            if (aKeys[i] != bKeys[i]) {
                areEqual = false;
                break;
            }
        }
        return areEqual;
    }

    /**
     * @description Overloaded != operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    @operator("!=")
    notEq(other: ScaleMap<K, V>): bool {
        return !this.eq(other);
    }

    static fromU8a<K extends Codec, V extends Codec>(
        input: u8[],
        index: i32 = 0
    ): ScaleMap<K, V> {
        const map = new ScaleMap<K, V>();
        const bytesReader = new BytesReader(input);
        const lenComp = bytesReader.readInto<CompactInt>();

        for (let i: i32 = 0; i < lenComp.unwrap(); i++) {
            const key = bytesReader.readInto<K>();
            const value = bytesReader.readInto<V>();
            map.set(key, value);
        }
        return map;
    }
}
