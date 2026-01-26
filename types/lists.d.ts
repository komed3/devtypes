/**
 * List-like Types
 * 
 * Utility types for working with list-like data structures such as arrays,
 * records, sets, maps, and generic iterables.
 * 
 * @module types/lists
 * @since 1.0.0
 */

/**
 * Any list-like structure.
 * 
 * @remarks
 * Represents the most common collection and iterable types in JavaScript.
 * Useful for APIs that accept any kind of value collection.
 * 
 * @template T - Element or value type
 * @template I - Index or key type for keyed collections
 * 
 * @example
 * type NumList = ListLike< number >;
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
 * Extract the element or value type from a list-like structure.
 * 
 * @remarks
 * Works with arrays, records, sets, maps, and generic iterables.
 * 
 * @template L - List-like type
 * 
 * @example
 * type E1 = ListElement< number[] >;                  // number
 * type E2 = ListElement< Set< string > >;             // string
 * type E3 = ListElement< Record< string, boolean > >; // boolean
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
 * Extract the key or index type from a keyed list-like structure.
 * 
 * @remarks
 * For arrays and other non-keyed collections, this defaults to
 * `string | number`.
 * 
 * @template L - List-like type
 * 
 * @example
 * type I1 = ListLikeIndex< Record< string, number > >; // string
 * type I2 = ListLikeIndex< Map< number, string > >;    // number
 * type I3 = ListLikeIndex< number[] >;                 // string | number
 */
export type ListLikeIndex< L > =
    L extends Record< infer K, any > ? K
        : L extends Map< infer MK, any > ? MK
        : string | number;

/**
 * Test whether a type is list-like.
 * 
 * @remarks
 * Conservative structural check against known list-like shapes.
 * 
 * @template T - Type to test
 *
 * @example
 * type A = IsListLike< number[] >;                 // true
 * type B = IsListLike< Record< string, number > >; // true
 * type C = IsListLike< string >;                   // false
 */
export type IsListLike< T > = T extends ListLike< any, any > ? true : false;

/**
 * Convert a list-like structure to an array type.
 * 
 * @remarks
 * Extracts the element type and wraps it in a mutable array.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = ToArray< number[] >;      // number[]
 * type B = ToArray< Set< string > >; // string[]
 */
export type ToArray< L > = ListElement< L >[];
