export declare type Path = string;
export declare function scan(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
export declare function glob(...patterns: string[]): string[];
export declare const read: (path: string, encoding?: string | undefined) => string | undefined;
export declare const write: (path: string, data: string, writeByteOrderMark?: boolean | undefined) => void;
export declare const file_exists: (path: string) => boolean;
export declare const directory_exists: (path: string) => boolean;
export declare type RenameOptions = {
    base?: string;
    dir?: string;
    name?: (name: string) => string;
    ext?: string;
};
export declare function rename(path: string, options: RenameOptions): string;
export declare function hash(data: string): string;
export declare function hash_file(path: Path): string | null;
export declare function read_json(path: Path): unknown | undefined;
