/**
 * Object-like Types
 * 
 * Types and utilities for working with object-like structures, including
 * plain objects, arrays, maps, sets, and other complex structures.
 * 
 * @module devtypes/object
 * @author komed3
 * @license MIT
 */


/**
 * Extract keys of an object whose values match a type.
 * 
 * @remarks
 * Filters object keys based on their value type.
 * Useful for mapping or picking properties programmatically.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumKeys = KeysByValue< Obj, number >;  // "a" | "c"
 */
export type KeysByValue< T, V > = {
    [ K in keyof T ]-?: T[ K ] extends V ? K : never
}[ keyof T ];

/**
 * Pick properties by their value type.
 * 
 * @remarks
 * Creates a new type containing only properties whose values match the specified type.
 * Useful for extracting numeric, string, or other specific property subsets.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumProps = PickByValue< Obj, number >;  // { a: number; c: number }
 */
export type PickByValue< T, V > = Pick< T, KeysByValue< T, V > >;

/**
 * Omit properties by their value type.
 * 
 * @remarks
 * Creates a new type excluding properties whose values match the specified type.
 * Useful for removing certain types from object types in type-level transformations.
 * 
 * @template T - The object type to filter
 * @template V - The value type to exclude
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NonNumProps = OmitByValue< Obj, number >;  // { b: string; d: boolean }
 */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;
