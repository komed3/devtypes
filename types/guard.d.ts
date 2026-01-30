/**
 * Type Guards
 * 
 * Module providing type guard utilities for TypeScript.
 * 
 * @module devtypes/guard
 * @author komed3
 * @license MIT
 */

import type { IsTypeExtendedInList, ListLike } from './list';
import type { JSONPrimitive, Primitive } from './primitive';


/**
 * Exact type matching: ensure no extra properties.
 * 
 * @remarks
 * Validates that `T` matches exactly the shape of `Shape`.
 * Useful for type-level validation or enforcing strict interfaces.
 * 
 * @template T - The type to validate
 * @template Shape - The exact shape to match
 * 
 * @example
 * type A = Exact< { a: number }, { a: number } >;             // { a: number }
 * type B = Exact< { a: number; b: number }, { a: number } >;  // never
 */
export type Exact< T, Shape > =
    T extends Shape
        ? Exclude< keyof T, keyof Shape > extends never
            ? T
            : never
        : never;

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
 * type A = IsUnknown< unknown >;  // true
 * type B = IsUnknown< any >;      // false
 * type C = IsUnknown< string >;   // false
 */
export type IsUnknown< T > =
    IsAny< T > extends true ? false
        : unknown extends T ? ( T extends {} ? false : true )
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
    IsAny< T > extends true ? false
        : IsLiteral< T > extends true ? false
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
export type IsListLike< T > = T extends Primitive ? false : T extends ListLike ? true : false;

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

/**
 * Type Guard: detect if a type is recursive.
 * 
 * @remarks
 * Recursively inspects the structure of `T` to detect if a type is recursive.
 * 
 * Potentially recursive types, such as union types with a parent type,
 * are considered recursion.
 * 
 * @returns 
 * `true` if `T` is recursive.
 * `false` if `T` is not recursive.
 * `boolean` if `T` is a union type with a recursive type.
 * 
 * @template T - A type to be inspected
 * @template P - (Optional) The list of parents types
 * 
 * @example
 * type RecursiveType = { r: RecursiveType };
 * type Recursive = IsTypeRecursive< RecursiveType >;                                // true
 * 
 * type PotentialRecursiveType = { r: PotentialRecursiveType | null };
 * type PotentialRecursive = IsTypeRecursive< PotentialRecursiveType >;              // true             
 * type IsNotRecursive = IsTypeRecursive< { a: { a: { a: { a: { a: 'a' } } } } } >;  // false
 */
export type IsTypeRecursive< T, P extends any[] = [] > =
    T extends any[] 
        ? false
        : T extends { [ key: string ]: any } 
            ? {
                [ K in keyof T ]: IsTypeExtendedInList< T[ K ], P > extends true ? true
                    : IsTypeRecursive< T[ K ], [ ...P, T ] >
            }[ keyof T ] extends false 
                ? false
                : true
            : IsTypeExtendedInList< T, P >;

/**
 * Type guard: detect whether a type is JSON serializable.
 * 
 * @remarks
 * Recursively inspects the structure of `T` to ensure all components
 * are compatible with JSON serialization rules.
 * 
 * Loose check: functions are considered non-serializable, but
 * JSON.stringify will allow them (they get stripped).
 * 
 * Will not detect cyclic references in objects.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsJSONSerializable< { a: string; b: number[] } >;  // true
 * type B = IsJSONSerializable< symbol >;                      // false
 */
export type IsJSONSerializable< T > =
    T extends JSONPrimitive ? true
        : T extends bigint | symbol ? false
        : T extends readonly ( infer U )[] ? IsJSONSerializable< U >
        : T extends object ? false extends {
            [ K in keyof T ]: IsJSONSerializable< T[ K ] >
        }[ keyof T ] ? false : true
        : true;

/**
 * Type guard: strictly detect whether a type is JSON serializable.
 * 
 * @remarks
 * Recursively inspects the structure of `T` to ensure all components
 * are fully compatible with JSON serialization rules.
 * 
 * Strict check: functions and undefined are considered non-serializable.
 * 
 * Will refuse any recursive type to ensure no cyclic references in objects.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsJSONSerializableStrict< { a: string; b: number[] } >;   // true
 * type B = IsJSONSerializableStrict< { a: string; b: undefined } >;  // false
 * type C = IsJSONSerializableStrict< ()=>void >;                     // false
 * type D = IsJSONSerializableStrict< ( string | undefined )[] >;     // false
 * type Recurse = { direct: Recurse, union: number | Recurse }
 * type E = IsJSONSerializableStrict< Recurse >;                      // false
 */
export type IsJSONSerializableStrict< T > =
    [ T ] extends [ ( ...args: any[] ) => any ] ? false
        : [ T ] extends [ bigint | symbol | undefined ] ? false
        : [ T ] extends [ string | number | boolean | null ] ? true
        : [ T ] extends [ readonly ( infer U )[] ]
            ? [ IsJSONSerializableStrict< U > ] extends [ true ] ? true : false
            : [ T ] extends [ object ]
                ? IsTypeRecursive< T > extends true
                    ? false
                    : false extends {
                        [ K in keyof T ]: IsJSONSerializableStrict< T[ K ] >
                    }[ keyof T ] ? false : true
                : false;
