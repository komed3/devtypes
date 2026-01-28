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
 * Type guard: detect whether a type is not a literal type.
 * 
 * @remarks
 * Logical negation of {@link IsLiteral}. The `any` type always resolves
 * to `false` to avoid false positives.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsNonLiteral< string >;  // true
 * type B = IsNonLiteral< 'a' >;     // false
 */
export type IsNonLiteral< T > =
    IsAny< T > extends true
        ? false
        : IsLiteral< T > extends true
            ? false
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
 * Type guard: detect whether a type is a union.
 * 
 * @remarks
 * Resolves to `true` if `T` is a union type, otherwise `false`.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsUnion< string | number >;  // true
 * type B = IsUnion< string >;           // false
 */
export type IsUnion< T, U = T > =
    IsNever< T > extends true
        ? false
        : T extends any
            ? [ U ] extends [ T ]
                ? false
                : true
            : false;

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

/**
 * Type guard: detect whether a type is a plain object.
 * 
 * @remarks
 * Excludes primitives, functions, arrays and tuples by checking
 * structural constraints to identify plain object types.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsObject< { a: number } >;  // true
 * type B = IsObject< number[] >;       // false
 */
export type IsObject< T > =
    IsAny< T > extends true
        ? false
        : T extends object
            ? T extends Function
                ? false
                : T extends readonly any[]
                    ? false
                    : true
            : false;

/**
 * Type guard: detect whether a type is a non-empty object.
 * 
 * @remarks
 * Checks the given type is a plain object and verifies that its
 * key set is non-empty.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsNonEmptyObject< { a: number } >;  // true
 * type B = IsNonEmptyObject< {} >;             // false
 */
export type IsNonEmptyObject< T > =
    IsObject< T > extends true
        ? keyof T extends never
            ? false
            : true
        : false;

type JSONPrimitive = string | number | boolean | null | undefined;
type JSONPrimitiveNotAssigneable = bigint | symbol | Function;
/**
 * Ensure safe JSON serialization for any type
 * 
 * @returns `T` if safe, `never` if something is not JSON compliant
 * 
 * @param T - any type 
 * 
 * @remarks
 * There is no debug, if it encounters a bad value, it will simply return `never`
 * 
 * Consider this type as potentially unrelieable.
 * This type util requires more testing.
 * 
 * This type util doesn't provide any safety on how JSON stringification handles
 * values that are undefined.
 * 
 * @example
 * 
 * type NoYouCannot1 = JSONSerializable< {simple_value: string,a_function: ()=>void}> // never
 * type NoYoucannot2 = JSONSerializable<()=>void> // never
 * type YesYouCan1 = JSONSerializable<{simple_value: string, nested: { simple: string }}> // {simple_value: string, nested: { simple: string }}
 * type NoYoucannot3 = JSONSerializable<{simple_value: string, nested: { simple: string, a_function: ()=>void }}> //never
 * type YesYouCan2 = JSONSerializable<[]> // []
 * type YesYouCan3 = JSONSerializable<true> // true
 * type BewareOfThat = JSONSerializable<{stripped_at_stringify: undefined}> // returns the value, but JSON.stringify that and you will receive "{}"
 */
type JSONSerializable<T> = 
    T extends JSONPrimitive
        ? T
        : T extends JSONPrimitiveNotAssigneable
            ? never
            : T extends JSONPrimitive[]
                ? T
                : T extends JSONPrimitiveNotAssigneable[]
                    ? never
                    : T extends  {[key: string]: any}
                        ? {
                            [K in keyof T]:
                                JSONSerializable<T[K]> extends never
                                ? 1
                                : 0
                        }[keyof T] extends 0
                            ? T
                            : never
                        : never & 'JSONSerializable<T> have no clue what this type can be please report that exception'
;