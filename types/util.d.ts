/**
 * Utility Types
 * 
 * This module provides a collection of advanced utility types for TypeScript
 * development. These types facilitate nominal typing, type casting, boxing of
 * primitives, optional values, type simplification, and type narrowing.
 * 
 * @module devtypes/util
 * @author komed3
 * @license MIT
 */

import type { If } from './condition';


/**
 * Brand a type for nominal typing.
 * 
 * @remarks
 * Creates a nominally distinct type by intersecting a base type with a
 * readonly marker property. This prevents accidental mixing of otherwise
 * structurally compatible types.
 * 
 * @template Base - Base type to brand
 * @template Tag - Unique string literal identifying the brand
 * @template Key - Property name used as the brand marker (defaults to `__brand`)
 * @template Required - Whether the marker is required (defaults to `false`)
 * 
 * @example
 * type UserID = Brand< number, 'UserID' >;
 * const id: UserID = 123 as UserID;
 */
export type Brand<
    Base, Tag extends string, Key extends string = '__brand',
    Required extends boolean = false
> =
    Base & If<
        Required,
        { readonly [ K in Key ]: Tag },
        { readonly [ K in Key ]?: Tag }
    >;

/**
 * Coerce a type while preserving assignability.
 * 
 * @remarks
 * Keeps the source type if it is assignable to the target type; otherwise,
 * resolves to the target type.
 * 
 * @template T - Source type
 * @template U - Target type
 * 
 * @example
 * type A = Coerce< string, string | number >;   // string
 * type B = Coerce< number, string | number >;   // number
 * type C = Coerce< boolean, string | number >;  // string | number
 */
export type Coerce< T, U > = T extends U ? T : U;

/**
 * Optional value type.
 * 
 * @remarks
 * Represents a value that may be `null` or `undefined`. Useful as a concise
 * shorthand for optional union types.
 * 
 * @template T - Value type
 * 
 * @example
 * type A = Maybe< string >;
 * // string | null | undefined
 */
export type Maybe< T > = T | null | undefined;

/**
 * Simplify a type for improved IntelliSense display.
 * 
 * @remarks
 * Expands intersections and flattens mapped types to produce cleaner IDE
 * hover tooltips. Functions are left untouched.
 * 
 * @template T - Type to simplify
 * 
 * @example
 * type Complex = { a: string } & { b: number } & { c: boolean };
 * type Simple = Simplify< Complex >;
 * // { a: string; b: number; c: boolean }
 */
export type Simplify< T > = T extends Function ? T : { [ K in keyof T ]: T[ K ] } & {};

/**
 * Expand object type for better IntelliSense display.
 * 
 * @remarks
 * Flattens intersection types for clearer hover and auto-completion.
 * Does not change the type but improves editor readability.
 * 
 * @template T - The type to expand
 * 
 * @example
 * type Nested = { a: { b: { c: number } } };
 * type Expanded = Expand< Nested >; // { a: { b: { c: number } } }
 */
export type Expand< T > = T extends object ? { [ K in keyof T ]: T[ K ] } & {} : T;

/**
 * Flatten array type for better IntelliSense display.
 * 
 * @remarks
 * Improves readability of array types in hover information.
 * Useful when working with deeply nested arrays or tuple types.
 * 
 * @template T - The type to flatten
 * 
 * @example
 * type Arr = Array< { a: number } >;
 * type FlatArr = Flatten< Arr >; // { a: number }[]
 */
export type Flatten< T > = T extends any[] ? { [ K in keyof T ]: T[ K ] } : T;

/**
 * Narrow a type without widening literals.
 * 
 * @remarks
 * Preserves literal types while leaving their corresponding base types
 * unchanged. Primarily useful as a semantic marker in public APIs.
 * 
 * @template T - Type to narrow
 * 
 * @example
 * type A = Narrow< 'hello' >;  // 'hello'
 * type B = Narrow< string >;   // string
 */
export type Narrow< T > =
    T extends string
        ? ( string extends T ? T : T )
        : T extends number
            ? ( number extends T ? T : T )
            : T;

/**
 * Compute intersections across multiple types and unions.
 * 
 * @remarks
 * Finds common members among a tuple of types or unions. Useful for
 * detecting overlapping keys or values.
 * 
 * Will return never if only one type is given.
 * 
 * Can be slow for large tuples due to combinatorial explosion.
 * 
 * @template T - Tuple of types
 * 
 * @example
 * type KeysA = 'a' | 'aa'
 * type KeysB = 'a' | 'bb'
 * type KeysX = 'x' | 'bb'
 * type Int1 = Intersect< [ KeysA, KeysB, KeysX ] >   // 'a' | 'bb'
 * type Int2 = Intersect< [ true, false, 1, true ] >  // true
 */
export type Intersect< T extends unknown[] > =
    T extends [ infer F, infer S, ...infer R ]
        ? ( F & S )
            | Intersect< [ S, ...R ] >
            | Intersect< [ F, ...R ] >
        : T extends [ infer F, infer S ]
            ? F & S
            : never;
