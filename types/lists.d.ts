/**
 * List-like Types
 * Utilities for working with list-like structures (arrays, records, sets, maps, iterables).
 * 
 * @module types/lists
 */

/**
 * Any list-like structure
 * A union representing all common collection types in JavaScript.
 * Useful when an API accepts any iterable or collection of values.
 * 
 * @template T - The element/value type
 * @template I - The index/key type for keyed collections (defaults to string | number)
 * 
 * @example
 * type NumList = ListLike< number >;
 * // number[] | ReadonlyArray< number > | Set< number > | Map< string | number, number > | ...
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
 * Extract the element/value type from any ListLike structure
 * Works with arrays, sets, maps, records, and iterables.
 * 
 * @template L - A ListLike type
 * 
 * @example
 * type LE1 = ListElement< number[] >;                  // number
 * type LE2 = ListElement< Set< string > >;             // string
 * type LE3 = ListElement< Record< string, boolean > >; // boolean
 */
export type ListElement< L > = L extends ( infer E )[] ? E
    : L extends ReadonlyArray< infer RE > ? RE
    : L extends Set< infer SE > ? SE
    : L extends ReadonlySet< infer RSE > ? RSE
    : L extends Map< any, infer MV > ? MV
    : L extends ReadonlyMap< any, infer RMV > ? RMV
    : L extends Record< any, infer RV > ? RV
    : L extends Iterable< infer IT > ? IT
    : never;

/**
 * Extract the key/index type from a keyed ListLike collection
 * Works with records and maps; defaults to string | number for other types.
 * 
 * @template L - A ListLike type
 * 
 * @example
 * type LI1 = ListLikeIndex< Record< string, number > >; // string
 * type LI2 = ListLikeIndex< Map< number, string > >;    // number
 * type LI3 = ListLikeIndex< number[] >;                 // string | number
 */
export type ListLikeIndex< L > = L extends Record< infer K, any > ? K
    : L extends Map< infer MK, any > ? MK : number | string;

/**
 * Test if a type is ListLike (conservative check)
 * Returns true for any recognizable list-like structure.
 * 
 * @template T - The type to test
 * 
 * @example
 * type IL1 = IsListLike< number[] >;                 // true
 * type IL2 = IsListLike< Record< string, number > >; // true
 * type IL3 = IsListLike< string >;                   // false
 */
export type IsListLike< T > = T extends ListLike< any, any > ? true : false;

/**
 * Convert any ListLike to an array of its elements
 * Extracts the element type and wraps it in an array.
 * 
 * @template L - A ListLike type
 * 
 * @example
 * type LA1 = ToArray< number[] >;      // number[]
 * type LA2 = ToArray< Set< string > >; // string[]
 */
export type ToArray< L > = ListElement< L >[];
