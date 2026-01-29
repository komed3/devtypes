/**
 * List-like Types
 * 
 * Utility types for working with list-like data structures such as arrays,
 * records, sets, maps, and generic iterables.
 * 
 * @module devtypes/list
 * @author komed3
 * @license MIT
 */

import { Equals, If } from './condition';


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
 * type E1 = ListElement< number[] >;                   // number
 * type E2 = ListElement< Set< string > >;              // string
 * type E3 = ListElement< Record< string, boolean > >;  // boolean
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
 * Extract the element type from an array or tuple.
 * 
 * @remarks
 * Resolves to the contained element type of readonly or mutable arrays.
 * Returns `never` for non-array inputs.
 * 
 * @template T - Array or tuple type
 * 
 * @example
 * type Arr = number[];
 * type Elem = ElementOf< Arr >;  // number
 */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/**
 * Extract the key or index type from a keyed list-like structure.
 * 
 * @remarks
 * For arrays and other non-keyed collections, this defaults to `string | number`.
 * If the structure is not keyed, the type resolves to `never`.
 * 
 * @template L - List-like type
 * 
 * @example
 * type I1 = ListLikeIndex< Record< string, number > >;  // string
 * type I2 = ListLikeIndex< Map< number, string > >;     // number
 * type I3 = ListLikeIndex< number[] >;                  // number
 */
export type ListLikeIndex< L > =
    L extends readonly any[] ? number
        : L extends ReadonlyMap< infer K, any > ? K
        : L extends Map< infer K, any > ? K
        : L extends Record< infer K, any > ? K
        : L extends Set< any > | ReadonlySet< any > | Iterable< any > ? never
        : string | number;

/**
 * Convert a list-like structure to an array type.
 * 
 * @remarks
 * Extracts the element type and wraps it in a mutable array.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = ToArray< number[] >;       // number[]
 * type B = ToArray< Set< string > >;  // string[]
 */
export type ToArray< L > = ListElement< L >[];

/**
 * Convert a list-like structure to a readonly array.
 * 
 * @remarks
 * Extracts the element type and wraps it in a readonly array.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = ToReadonlyArray< number[] >;       // ReadonlyArray< number >
 * type B = ToReadonlyArray< Set< string > >;  // ReadonlyArray< string >
 */
export type ToReadonlyArray< L > = ReadonlyArray< ListElement< L > >;

/**
 * Convert a list-like structure to a Set.
 * 
 * @remarks
 * Extracts the element type and wraps it in a Set.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = ToSet< number[] >;         // Set< number >
 * type B = ToSet< Array< string > >;  // Set< string >
 */
export type ToSet< L > = Set< ListElement< L > >;

/**
 * Convert a list-like structure to a Map.
 * 
 * @remarks
 * For non-keyed collections, the key type defaults to `string | number`.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = ToMap< Record< string, number > >;  // Map< string, number >
 * type B = ToMap< number[] >;                  // Map< number, number >
 */
export type ToMap< L > = Map< ListLikeIndex< L >, ListElement< L > >;

/**
 * Test whether a list-like structure is keyed.
 * 
 * @remarks
 * Returns `true` for records and maps, `false` otherwise.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = IsKeyedList< Record< string, number > >;  // true
 * type B = IsKeyedList< Map< number, string > >;     // true
 * type C = IsKeyedList< number[] >;                  // false
 */
export type IsKeyedList< L > =
    L extends readonly any[] ? false
        : L extends ReadonlyMap< any, any > ? true
        : L extends Map< any, any > ? true
        : L extends Record< any, any > ? true
        : false;

/**
 * Test whether a list-like structure is index-based.
 * 
 * @remarks
 * Returns `true` for arrays and readonly arrays.
 * 
 * @template L - List-like type
 * 
 * @example
 * type A = IsIndexedList< number[] >;                 // true
 * type B = IsIndexedList< ReadonlyArray< string > >;  // true
 * type C = IsIndexedList< Set< boolean > >;           // false
 */
export type IsIndexedList< L > = L extends readonly any[] ? true : false;

/**
 * Test whether a type can be found within a list of types.
 * 
 * @remarks
 * This will recursively check each type in the list `L` to see if it matches type `T`.
 * If returns `true` as soon as a match is found and `false` if no matches are found or
 * if the list is empty.
 * 
 * @template T - A type to search for
 * @template L - A list of types
 * 
 * @example
 * type TrueIsFound = IsTypeInList< true, [ 1, 'no', true ] >;      // true
 * type TrueIsNotFound = IsTypeInList< true, [ 1, 'no', false ] >;  // false
 * type ListIsEmptySoFalse = IsTypeInList< true, [] >;              // false
 */
export type IsTypeInList< T, L extends any[] > = 
    L extends [ infer F, ...infer R ]
        ? If< Equals< T, F >, true, false > extends true
            ? true
            : IsTypeInList< T, R >
        : L extends [ infer F ]
            ? If< Equals< T, F >, true, T >
            : false
