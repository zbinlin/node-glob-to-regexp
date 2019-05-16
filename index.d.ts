export interface GlobToRegExpOptions {
    ignoreCase?: boolean;
    wholeMatch?: boolean;
    flags?: string;
}
export default function globToRegExp(glob: string, options?: GlobToRegExpOptions): RegExp;
