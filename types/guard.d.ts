/**
 * Type Guards
 * 
 * Module providing type guard utilities for TypeScript.
 * 
 * @module devtypes/guard
 * @author komed3
 * @license MIT
 */

import type { ListLike } from './list';


/**
 * Type guard: detect whether a type `T` extends type `U`.
 * 
 * @remarks
 * Resolves to `true` if `T` is assignable to `U`, otherwise `false`.
 * 
 * @template T - Type to test
 * @template U - Target type
 * 
 * @example
 * type A = IsType< string, string | number >;  // true
 * type B = IsType< number, string >;           // false
 */
export type IsType< T, U > = T extends U ? true : false;

/**
 * Type guard: detect `any`.
 * 
 * @remarks
 * Uses the `0 extends (1 & T)` trick to reliably distinguish `any` from all
 * other types, including `unknown`.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsAny< any >;     // true
 * type B = IsAny< string >;  // false
 */
export type IsAny< T > = 0 extends ( 1 & T ) ? true : false;

/**
 * Type guard: detect `never`.
 * 
 * @remarks
 * Identifies the bottom type `never` using tuple-based detection to avoid
 * distributive conditional behavior.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsNever< never >;   // true
 * type B = IsNever< string >;  // false
 */
export type IsNever< T > = [ T ] extends [ never ] ? true : false;

/**
 * Type guard: detect `unknown` (excluding `any`).
 * 
 * @remarks
 * Differentiates `unknown` from `any` and from concrete types by combining
 * constraint checks with an explicit `any` exclusion.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsUnknown< unknown >; // true
 * type B = IsUnknown< any >;     // false
 * type C = IsUnknown< string >;  // false
 */
export type IsUnknown< T > =
    IsAny< T > extends true
        ? false
        : unknown extends T
            ? ( T extends {} ? false : true )
            : false;

/**
 * Type guard: detect whether a type is a literal type.
 * 
 * @remarks
 * Distinguishes string, number, and boolean literals from their
 * corresponding primitive base types. The `any` type always resolves
 * to `false` to avoid false positives.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsLiteral< 'hello' >;  // true
 * type B = IsLiteral< 42 >;       // true
 * type C = IsLiteral< true >;     // true
 * type D = IsLiteral< string >;   // false
 */
export type IsLiteral< T > =
    IsAny< T > extends true ? false
        : string extends T ? false
        : number extends T ? false
        : boolean extends T ? false
        : true;

/**
 * Type guard: detect whether a type is a list-like.
 * 
 * @remarks
 * Conservative structural check against known list-like shapes.
 * 
 * @template T - Type to test
 *
 * @example
 * type A = IsListLike< number[] >;                  // true
 * type B = IsListLike< Record< string, number > >;  // true
 * type C = IsListLike< string >;                    // false
 */
export type IsListLike< T > = T extends ListLike< any, any > ? true : false;

/**
 * Type guard: detect whether a type is a tuple.
 * 
 * @remarks
 * Distinguishes tuples from arrays by inspecting the length property.
 * 
 * @template T - Type to check
 * 
 * @example
 * type A = IsTuple< [ string, number ] >;  // true
 * type B = IsTuple< number[] >;            // false
 */
export type IsTuple< T > =
    T extends readonly any[]
        ? number extends T[ 'length' ]
            ? false
            : true
        : false;

/**
 * Type guard: check whether a type is a non-empty tuple.
 * 
 * @remarks
 * Combines tuple detection with an emptiness check.
 * 
 * @template T - Type to check
 * 
 * @example
 * type A = IsNonEmptyTuple< [ number ] >;  // true
 * type B = IsNonEmptyTuple< [] >;          // false
 */
export type IsNonEmptyTuple< T > =
    IsTuple< T > extends true
        ? T extends readonly []
            ? false
            : true
        : false;
