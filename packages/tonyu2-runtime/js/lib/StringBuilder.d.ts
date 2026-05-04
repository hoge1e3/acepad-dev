export default function StringBuilder(bufSize?: number): {
    append: (content: string) => void;
    replace: (index: number, replacement: string) => void;
    truncate: (length: number) => void;
    toString: () => string;
    getLength: () => number;
    last: (len: number) => string;
};
