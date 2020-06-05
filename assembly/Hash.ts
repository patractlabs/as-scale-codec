import { Codec } from "./interfaces/Codec";
import { Bytes } from './utils/Bytes';

export class Hash extends Array<u8> implements Codec {

    constructor (value: u8[]) {
        super(32);
        Bytes.copy(value, this);
    }

    /**
    * @description  Encodes Hash as u8[] as per the SCALE codec specification
    */
    public toU8a (): u8[] {
        const result: u8[] = new Array<u8>(this.encodedLength());
        Bytes.copy<u8>(this, result);

        return result;
    }

    /**
    * @description  Return string representation of Hash
    */
    public toString (): string {
        return "0x" + this.join('');
    }

    /**
    * @description  Instantiate Hash from bytes cropped from the left.
    */
    static bytesToHash (bytes: u8[]): Hash {
        let hash = new Hash([]);
        if (bytes.length > 32) {
            bytes = bytes.slice(bytes.length - 32);
        }

        const position: i32 = 32 - bytes.length;
        Bytes.copy<u8>(bytes, hash, position);
        return hash;
    }

    /**
    * @description The length of encoded Hash
    */
    public encodedLength (): i32 {
        return 32;
    }

    /**
    * @description Instantiates Hash from u8[] SCALE encoded bytes
    */
    static fromU8a (input: u8[]): Hash {
        return new Hash(input);
    }
}