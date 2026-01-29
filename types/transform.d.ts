/**
 * Transforming Types
 * 
 * Deep transformations and utilities for manipulating object types, arrays,
 * and nested structures.
 * 
 * @module devtypes/transform
 * @author komed3
 * @license MIT
 */

import type { PlainObject } from './object';


/** @internal Extract value type from containers */
type ContainerValue< T > =
    T extends Array< infer U > ? U
        : T extends ReadonlyArray< infer U > ? U
        : T extends Map< infer _, infer V > ? V
        : T extends ReadonlyMap< infer _, infer V > ? V
        : T extends Set< infer U > ? U
        : T extends ReadonlySet< infer U > ? U
        : never;

/** @internal Reconstruct container with transformed value */
type MapContainer< T, U > =
    T extends Array< any > ? U[]
        : T extends ReadonlyArray< any > ? ReadonlyArray< U >
        : T extends Map< infer K, any > ? Map< K, U >
        : T extends ReadonlyMap< infer K, any > ? ReadonlyMap< K, U >
        : T extends Set< any > ? Set< U >
        : T extends ReadonlySet< any > ? ReadonlySet< U >
        : never;

/** @internal Check if should recurse (not a leaf type) */
type ShouldRecurse< T > = T extends Function | Date | PlainObject ? true : false;


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
 * type Flat = Flat< Nested >;  // ( number | string )[]
 */
export type Flat< T extends readonly any[] > =
    T extends readonly ( infer E )[]
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
export type DeepReadonly< T > = T extends Function
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
export type DeepMutable< T > = T extends Function
    ? T
    : T extends Array< infer U >
        ? Array< DeepMutable< U > >
        : T extends object
            ? { -readonly [ K in keyof T ]-?: DeepMutable< T[ K ] > }
            : T;
