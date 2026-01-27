/**
 * Collection Types
 * 
 * Deep transformations and utilities for objects, arrays, and nested structures.
 * Includes deep partials, readonlys, merges, and path-based type extraction.
 * 
 * @module types/collections
 * @since 1.0.0
 */

import type { Simplify } from './base';

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
 * type Elem = ElementOf< Arr >; // number
 */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/**
 * Generic plain object type.
 * 
 * @since 1.1.0
 * @remarks
 * Represents an object with string, number, or symbol keys and any value types.
 * Useful as a base type for object manipulations and transformations.
 * 
 * @example
 * type Obj = PlainObject;
 * // Record< string | number | symbol, any >
 */
export type PlainObject = Record< string | number | symbol, any >;

/**
 * Flatten an array by one level.
 * 
 * @remarks
 * If an element itself is an array, its element type is extracted.
 * Non-array elements are preserved as-is.
 * 
 * @template T - Array containing values or nested arrays
 * 
 * @example
 * type Nested = ( number[] | string[] )[];
 * type Flat = Flat< Nested >; // ( number | string )[]
 */
export type Flat< T extends readonly any[] > = T extends readonly ( infer E )[]
    ? ( E extends readonly any[] ? E[ number ] : E )[]
    : never;

/**
 * Recursively make all properties optional.
 * 
 * @remarks
 * Traverses objects and arrays and applies optional modifiers at every
 * nesting level without altering value types.
 * 
 * @template T - Object type to transform
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type PartialUser = DeepPartial< User >;
 * // { id?: number; profile?: { name?: string; address?: { city?: string } } }
 */
export type DeepPartial< T extends PlainObject > = {
    [ P in keyof T ]?: T[ P ] extends Array< infer U >
        ? DeepPartial< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepPartial< U > >
            : T[ P ] extends object
                ? DeepPartial< T[ P ] >
                : T[ P ];
};

/**
 * Recursively make all properties required.
 * 
 * @remarks
 * Removes optional property modifiers but does not remove `undefined`
 * from union types.
 * 
 * @template T - Object type to transform
 * 
 * @example
 * type User = { id?: number; profile?: { name?: string; address?: { city?: string } } };
 * type Required = DeepRequired< User >;
 * // { id: number; profile: { name: string; address: { city: string } } }
 */
export type DeepRequired< T extends PlainObject > = {
    [ P in keyof T ]-?: T[ P ] extends Array< infer U >
        ? DeepRequired< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepRequired< U > >
            : T[ P ] extends object
                ? DeepRequired< T[ P ] >
                : T[ P ];
};

/**
 * Recursively make all properties readonly.
 * 
 * @remarks
 * Applies `readonly` modifiers deeply to all properties.
 * Function types are preserved unchanged.
 * 
 * @template T - Object type to transform
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Readonly = DeepReadonly< User >;
 * // { readonly id: number; readonly profile: { readonly name: string; readonly address: { readonly city: string } } }
 */
export type DeepReadonly< T extends PlainObject > = T extends Function
    ? T
    : T extends Array< infer U >
        ? ReadonlyArray< DeepReadonly< U > >
        : T extends object
            ? { readonly [ K in keyof T ]: DeepReadonly< T[ K ] > }
            : T;

/**
 * Recursively remove readonly and optional modifiers.
 * 
 * @remarks
 * Produces a fully mutable and required version of a deeply readonly type.
 * 
 * @template T - Readonly object type to transform
 * 
 * @example
 * type User = { readonly id?: number; profile?: { readonly name?: string; address?: { readonly city?: string } } };
 * type Mutable = DeepMutable< User >;
 * // { id: number; profile: { name: string; address: { city: string } } }
 */
export type DeepMutable< T extends PlainObject > = T extends Function
    ? T
    : T extends Array< infer U >
        ? Array< DeepMutable< U > >
        : T extends object
            ? { -readonly [ K in keyof T ]-?: DeepMutable< T[ K ] > }
            : T;

/**
 * Build all nested property paths using dot notation.
 * 
 * @remarks
 * Generates a union of valid access paths up to a configurable recursion
 * depth. Path order is not guaranteed.
 * 
 * @template T - Object type to analyze
 * @template D - Maximum recursion depth (defaults to 5)
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Paths = Paths< User >;
 * // "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"
 */
export type Paths< T, D extends number = 5 > = [ D ] extends [ never ]
    ? never
    : T extends object
        ? { [ K in keyof T ]-?: K extends string | number
            ? T[ K ] extends readonly any[]
                ? K
                : T[ K ] extends object
                    ? K | Join< K, Paths< T[ K ], Prev[ D ] > >
                    : K
            : never }[ keyof T ]
        : '';

type Join< K, P > = K extends string | number
    ? P extends string | number
        ? `${ K & ( string | number ) }.${ P & ( string | number ) }`
        : never
    : never;

type Prev = [ never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

/**
 * Resolve the value type at a given property path.
 * 
 * @remarks
 * Supports dot-separated paths and resolves deeply nested property types.
 * Returns `never` for invalid paths.
 * 
 * @template T - Object type to traverse
 * @template P - Dot-separated property path
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type City = PathValue< User, "profile.address.city" >; // string
 */
export type PathValue< T, P extends string > = P extends `${ infer K }.${ infer Rest }`
    ? K extends keyof T ? PathValue< T[ K ], Rest > : never
    : P extends keyof T ? T[ P ] : never;

/**
 * Merge two object types shallowly.
 * 
 * @remarks
 * Properties from the right-hand type override properties from the left-hand
 * type on key conflicts.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: number; b: string };
 * type B = { b: number; c: boolean };
 * type Merged = Merge< A, B >; // { a: number; b: number; c: boolean }
 */
export type Merge< Left, Right > = Simplify<
    Pick< Left, Exclude< keyof Left, keyof Right > > & Right
>;

/**
 * Deeply merge two object types.
 * 
 * @remarks
 * Recursively merges nested objects. On conflicts, the right-hand type
 * always takes precedence.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: { x: number; y: string }; b: string };
 * type B = { a: { y: number; z: boolean }; c: boolean };
 * type Merged = DeepMerge< A, B >;
 * // { a: { x: number; y: number; z: boolean }; b: string; c: boolean }
 */
export type DeepMerge< Left, Right > = {
    [ K in keyof Left | keyof Right ]:
        K extends keyof Right
            ? K extends keyof Left
                ? Left[ K ] extends ReadonlyArray< any >
                    ? Right[ K ]
                    : Left[ K ] extends object
                        ? Right[ K ] extends object
                            ? DeepMerge< Left[ K ], Right[ K ] >
                            : Right[ K ]
                        : Right[ K ]
                : Right[ K ]
            : K extends keyof Left
                ? Left[ K ]
                : never;
} & {};

/**
 * Strict deep merge of two object types.
 * 
 * @since 1.1.0
 * @remarks
 * Similar to {@link DeepMerge} but preserves array types from the left-hand
 * side by injecting right-hand properties into array element types.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: { x: { foo: true } } };
 * type B = { a: { x: { foo: number, bar: string } } };
 * type Merged = < A, B >;
 * // { a: { x: { foo: true, bar: string } } }
 */
export type DeepMergeStrict< Left, Right > =
    Left extends Array< infer U >
        ? DeepMergeStrict< U, Right >[]
        : Left extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepMergeStrict< U, Right > >
            : Left extends object
                ? Right extends object
                    ? { [ K in keyof Left ]: K extends keyof Right
                            ? DeepMergeStrict< Left[ K ], Right[ K ] >
                            : DeepMergeStrict< Left[ K ], Right > } & {
                        [ K in Exclude< keyof Right, keyof Left > ]: Right[ K ] }
                    : Left
                : Left;

/**
 * Merge multiple object types sequentially.
 * 
 * @remarks
 * Applies shallow merges from left to right over a tuple of object types.
 * 
 * @template T - Tuple of object types
 * 
 * @example
 * type U = { a: number } | { b: string };
 * type V = { b: number } | { c: boolean };
 * type Merged = MergeMany< [ U, V ] >;
 */
export type MergeMany< T extends unknown[] > =
    T extends [ infer H, ...infer R ]
        ? Merge< H, MergeMany< R > >
        : {};

/**
 * Deeply inject properties into an object tree.
 * 
 * @since 1.1.0
 * @remarks
 * Injects properties from type D into every nested object within T.
 * Handles arrays and readonly arrays by injecting into their element types.
 * 
 * Properties in T are never overwritten by properties from D.
 * 
 * @template T - Target object type
 * @template D - Injected type
 * 
 * @example
 * type Nested = { level_1: { level_2: { } } };
 * type Metadata = { metadata?: string };
 * type DeepIntersected = DeepIntersection< Nested, Metadata >;
 * // { level_1: { level_2: { metadata?: string }, metadata?: string }, metadata?: string }
 */
export type DeepInject< T, D > =
    T extends Array< infer U >
        ? DeepInject< U, D >[]
        : T extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepInject< U, D > >
            : T extends object
                ? { [ K in keyof T ]: T[ K ] extends object
                        ? DeepInject< T[ K ], D >
                        : T[ K ] } & {
                    [ K in Exclude< {
                        [ K in keyof D ]-?: {} extends Pick< D, K > ? K : never
                    }[ keyof D ], keyof T > ]?: D[ K ] } & {
                    [ K in Exclude< {
                        [ K in keyof D ]-?: {} extends Pick< D, K > ? never : K
                    }[ keyof D ], keyof T > ]-?: D[ K ] }
                : T;

/**
 * Compute chained intersections across multiple types.
 * 
 * @since 1.1.0
 * @remarks
 * Produces all pairwise and transitive intersections across a tuple
 * of types. Useful for detecting overlapping keys or values.
 * 
 * Will return never if only one type is given.
 * 
 * Can be slow for large tuples due to combinatorial explosion.
 * 
 * @template T - Tuple of types
 * 
 * @example
 * type KeysA = 'a' | 'aa'
 * type KeysB = 'b' | 'bb'
 * type KeysX = 'x' | 'bb'
 * type Intersection1 = ChainedIntersection< [ KeysA, KeysB, KeysX ] >  // "bb"
 * type Intersection2 = ChainedIntersection< [ true, false, 1, true ] > // true
 */
export type ChainedIntersection< T extends unknown[] > =
    T extends [ infer F, infer S, ...infer R ]
        ? ( F & S )
            | ChainedIntersection< [ S, ...R ] >
            | ChainedIntersection< [ F, ...R ] >
        : T extends [ infer F, infer S ]
            ? F & S
            : never;
