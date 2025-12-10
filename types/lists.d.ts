/**
 * List-like types
 * Types for list-like structures such as arrays, sets, maps, records, and iterables.
 * 
 * @module types/lists
 */

/**
 * List-like structures: arrays, records, sets, maps and iterables.
 * This union is useful when an API accepts any iterable/collection of values.
 * - Includes mutable and readonly arrays
 * - Includes `Record` keyed collections
 * - Includes `Set` and `Map` variants
 * @example
 * type MyList = ListLike<number>;
 * // number[] | ReadonlyArray<number> | ... | Iterable<number>
 */
export type ListLike< T = any, I extends string | number = string | number > =
    | T[]
    | ReadonlyArray< T >
    | Record< I, T >
    | Set< T >
    | ReadonlySet< T >
    | Map< I, T >
    | ReadonlyMap< I, T >
    | Iterable< T >;

/**
 * Extract the element/value type from a `ListLike`
 * @example
 * type LE1 = ListElement<number[]>; // number
 * type LE2 = ListElement<ReadonlyArray<string>>; // string
 */
export type ListElement< L > =
    L extends ( infer E )[] ? E
    : L extends ReadonlyArray< infer RE > ? RE
    : L extends Set< infer SE > ? SE
    : L extends ReadonlySet< infer RSE > ? RSE
    : L extends Map< any, infer MV > ? MV
    : L extends ReadonlyMap< any, infer RMV > ? RMV
    : L extends Record< any, infer RV > ? RV
    : L extends Iterable< infer IT > ? IT
    : never;

/**
 * Extract key/index type for list-like keyed collections (Record/Map)
 * Defaults to `string | number`
 * @example
 * type LI1 = ListLikeIndex<Record<string, number>>; // string
 * type LI2 = ListLikeIndex<Map<number, string>>; // number
 */
export type ListLikeIndex< L > =
    L extends Record< infer K, any > ? K
    : L extends Map< infer MK, any > ? MK
    : number | string;

/**
 * True if T is a ListLike (conservative)
 * @example
 * type IL1 = IsListLike<number[]>; // true
 * type IL2 = IsListLike<Record<string, number>>; // true
 * type IL3 = IsListLike<string>; // false
 */
export type IsListLike< T > = T extends ListLike< any, any > ? true : false;

/**
 * Convert any ListLike to an array of its elements
 * @example
 * type LA1 = ToArray<number[]>; // number[]
 * type LA2 = ToArray<Set<string>>; // string[]
 */
export type ToArray< L > = ListElement< L >[];
