/**
 * Collection Types
 * Deep transformations and utilities for objects, arrays, and nested structures.
 * 
 * @module types/collections
 */

import type { Simplify } from './base';

/**
 * Extract the element type from an array or tuple
 * 
 * @template T - An array or tuple type
 * 
 * @example
 * type Arr = number[];
 * type Elem = ElementOf< Arr >; // number
 */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/**
 * Flatten arrays by one level
 * 
 * @template T - An array of arrays or array of elements
 * 
 * @example
 * type Nested = ( number | string )[];
 * type Flat = Flat< Nested >; // (number | string)[]
 */
export type Flat< T extends readonly any[] > = T extends readonly ( infer E )[]
    ? ( E extends readonly any[] ? E[ number ] : E )[]
    : never;

/**
 * Recursively make all properties optional
 * Transforms all properties at any depth to be optional.
 * 
 * @template T - The object type to transform
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Partial = DeepPartial< User >;
 * // { id?: number; profile?: { name?: string; address?: { city?: string } } }
 */
export type DeepPartial< T > = {
    [ P in keyof T ]?: T[ P ] extends Array< infer U >
        ? DeepPartial< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
        ? ReadonlyArray< DeepPartial< U > >
        : T[ P ] extends object
            ? DeepPartial< T[ P ] >
            : T[ P ];
};

/**
 * Recursively make all properties required
 * Removes optional markers and nullability at any depth.
 * 
 * @template T - The object type to transform
 * 
 * @example
 * type User = { id?: number; profile?: { name?: string; address?: { city?: string } } };
 * type Required = DeepRequired< User >;
 * // { id: number; profile: { name: string; address: { city: string } } }
 */
export type DeepRequired< T > = {
    [ P in keyof T ]-?: T[ P ] extends Array< infer U >
        ? DeepRequired< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
        ? ReadonlyArray< DeepRequired< U > >
        : T[ P ] extends object
            ? DeepRequired< T[ P ] >
            : T[ P ];
};

/**
 * Recursively make all properties readonly
 * Transforms all properties and nested properties to be immutable.
 * 
 * @template T - The object type to transform
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Readonly = DeepReadonly< User >;
 * // { readonly id: number; readonly profile: { readonly name: string; readonly address: { readonly city: string } } }
 */
export type DeepReadonly< T > = T extends Function ? T
    : T extends Array< infer U > ? ReadonlyArray< DeepReadonly< U > >
    : T extends object ? { readonly [ K in keyof T ]: DeepReadonly< T[ K ] > }
    : T;

/**
 * Recursively remove readonly modifiers
 * Makes all nested properties mutable and required.
 * 
 * @template T - The readonly object type to transform
 * 
 * @example
 * type User = { readonly id?: number; profile?: { readonly name?: string; address?: { readonly city?: string } } };
 * type Mutable = DeepMutable< User >;
 * // { id: number; profile: { name: string; address: { city: string } } }
 */
export type DeepMutable< T > = T extends Function ? T
    : T extends Array< infer U > ? Array< DeepMutable< U > >
    : T extends object ? { -readonly [ K in keyof T ]-?: DeepMutable< T[ K ] > }
    : T;

type Join< K, P > = K extends string | number ? P extends string | number
    ? `${ K & ( string | number ) }.${ P & ( string | number ) }`
    : never : never;

type Prev = [ never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

/**
 * Build all nested property paths for an object (dot notation)
 * Generates all valid path strings up to a configurable recursion depth.
 * 
 * @template T - The object type to extract paths from
 * @template D - Maximum recursion depth (defaults to 5)
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Paths = Paths< User >;
 * // "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"
 */
export type Paths< T, D extends number = 5 > = [ D ] extends [ never ] ? never : T extends object ? {
    [ K in keyof T ]-?: K extends string | number ? T[ K ] extends object
        ? K | Join< K, Paths< T[ K ], Prev[ D ] > >
        : K : never
}[ keyof T ] : '';

/**
 * Retrieve the type of a nested value by path (dot notation)
 * Resolves the type at any depth in an object structure using path strings.
 * 
 * @template T - The object type to navigate
 * @template P - A dot-separated path string
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type City = PathValue< User, "profile.address.city" >; // string
 */
export type PathValue< T, P extends string > = P extends `${ infer K }.${ infer Rest }`
    ? K extends keyof T ? PathValue< T[ K ], Rest > : never
    : P extends keyof T ? T[ P ] : never;

/**
 * Merge two object types (shallow)
 * The right-hand type's fields override the left-hand type's fields.
 * 
 * @template Left - The base object type
 * @template Right - The overriding object type
 * 
 * @example
 * type A = { a: number; b: string };
 * type B = { b: number; c: boolean };
 * type Merged = Merge< A, B >; // { a: number; b: number; c: boolean }
 */
export type Merge< Left, Right > = Simplify< Pick< Left, Exclude< keyof Left, keyof Right > > & Right >;

/**
 * Merge two object types deeply (recursive)
 * Merges nested properties recursively; right-hand fields override left-hand ones.
 * 
 * @template Left - The base object type
 * @template Right - The overriding object type
 * 
 * @example
 * type A = { a: { x: number; y: string }; b: string };
 * type B = { a: { y: number; z: boolean }; c: boolean };
 * type Merged = DeepMerge< A, B >;
 * // { a: { x: number; y: number; z: boolean }; b: string; c: boolean }
 */
export type DeepMerge< Left, Right > = {
    [ K in keyof Left | keyof Right ]:
        K extends keyof Right ? (
            K extends keyof Left ?
                Left[ K ] extends object ?
                    Right[ K ] extends object ?
                        DeepMerge< Left[ K ], Right[ K ] >
                    : Right[ K ]
                : Right[ K ]
            : Right[ K ]
        )
    : K extends keyof Left ? Left[ K ] : never;
} & {};

/**
 * Merge multiple object types in sequence
 * Applies merge operations left to right on an array of types.
 * 
 * @template T - An array of object types to merge
 * 
 * @example
 * type U = { a: number } | { b: string };
 * type V = { b: number } | { c: boolean };
 * type Merged = MergeMany< [ U, V ] >;
 */
export type MergeMany< T extends any[] > = T extends [ infer H, ...infer R ] ? Merge< H, MergeMany< R > > : {};

/**
 * Deep recursive intersection of two types
 * Merges two types deeply, with the target type taking precedence on conflicts.
 * 
 * @template T - The target type (takes precedence)
 * @template D - The additional type to merge in
 * 
 * @remarks
 * Properties in T are never overwritten by properties from D.
 * 
 * @example
 * type Nested = { level_1: { level_2: { } } };
 * type Metadata = { metadata?: string };
 * type DeepIntersected = DeepIntersection< Nested, Metadata >;
 * // { level_1: { level_2: { metadata?: string } } }
 */
export type DeepIntersection< T, D > = {
    [ P in keyof T ]: T[ P ] extends Array< infer U >
        ? DeepIntersection< U, D >[]
        : T[ P ] extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepIntersection< U, D > >
            : T[ P ] extends object
                ? DeepIntersection< T[ P ], D >
                : T[ P ];
} & {
    [ P in keyof D ]: P extends keyof T ? never : D[ P ]
};

/**
 * (recursive)
 * From an array of type, will return any type that intersect with another
 * 
 * @example
 * Can be useful to highlight potential key conflicts from multiple sources
 * type KeysA = 'a' | 'aa'
 * type KeysB = 'b' | 'bb'
 * type KeysX = 'x' | 'bb'
 * type ChainedIntersectionType = ChainedIntersection<[KeysA, KeysB, KeysX]>
 * // "bb"
 * type ChainedIntersectionType2 = ChainedIntersection<[true, false, 1, true]>
 * // true
 * 
 * @remarks
 * Will return never if only one type is given
 */
export type ChainedIntersection<T extends any[]> =
  T extends [infer F, infer S, ...infer R]
    ? (F & S) | ChainedIntersection<[S, ...R]> | ChainedIntersection<[F, ...R]>
    : T extends [infer F, infer S]
        ? F & S
        : never
