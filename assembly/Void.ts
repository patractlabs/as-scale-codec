import { Codec } from "./interfaces/Codec";

/**
 * @description SCALE Codec support for `void`
 */
export class Void implements Codec {
    @inline
    toU8a(): u8[] {
        return new Array<u8>(0);
    }

    @inline
    encodedLength(): i32 {
        return 0;
    }

    @inline
    populateFromBytes(bytes: u8[], index: i32 = 0): i32 {
        return 0;
    }

    @inline
    @operator("==")
    eq(other: Void): bool {
        return true;
    }

    @inline
    @operator("!=")
    notEq(other: Void): bool {
        return false;
    }
}
