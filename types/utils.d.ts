/**
 * Utility Types
 * Common utilities for object transformation, key filtering, and type manipulation.
 * 
 * @module types/utils
 */

/**
 * Convert a union type to an intersection
 * All union members must be combined into a single type.
 * 
 * @template U - A union type
 * 
 * @example
 * type U = { a: number } | { b: string };
 * type I = UnionToIntersection< U >; // { a: number } & { b: string }
 */
export type UnionToIntersection< U > = ( U extends any ? ( k: U ) => void : never ) extends ( ( k: infer I ) => void ) ? I : never;

/**
 * Extract keys of an object whose values match a type
 * Filters object keys by their value type.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumKeys = KeysByValue< Obj, number >; // "a" | "c"
 */
export type KeysByValue< T, V > = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

/**
 * Pick properties by their value type
 * Creates a new type containing only properties whose values match the specified type.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumProps = PickByValue< Obj, number >; // { a: number; c: number }
 */
export type PickByValue< T, V > = Pick< T, KeysByValue< T, V > >;

/**
 * Omit properties by their value type
 * Creates a new type excluding properties whose values match the specified type.
 * 
 * @template T - The object type to filter
 * @template V - The value type to exclude
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NonNumProps = OmitByValue< Obj, number >; // { b: string; d: boolean }
 */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;

/**
 * Expand object type for better IntelliSense display
 * Flattens intersection types for cleaner hover information.
 * 
 * @template T - The type to expand
 * 
 * @example
 * type Nested = { a: { b: { c: number } } };
 * type Expanded = Expand< Nested >; // { a: { b: { c: number } } }
 */
export type Expand< T > = T extends object ? { [ K in keyof T ]: T[ K ] } & {} : T;

/**
 * Flatten array type for better IntelliSense display
 * Improves readability of array types in hover information.
 * 
 * @template T - The type to flatten
 * 
 * @example
 * type Arr = Array< { a: number } >;
 * type FlatArr = Flatten< Arr >; // { a: number }[]
 */
export type Flatten< T > = T extends any[] ? { [ K in keyof T ]: T[ K ] } : T;

/**
 * Exact type matching: ensure no extra properties
 * Validates that T has exactly the properties in Shape, no more, no less.
 * 
 * Usage:
 * - `Exact< { a: number }, { a: number } >`            ✓ passes
 * - `Exact< { a: number; b: number }, { a: number } >` ✗ fails
 * 
 * @template T - The type to validate
 * @template Shape - The exact shape to match
 * 
 * @example
 * type A = Exact< { a: number }, { a: number } >;            // { a: number }
 * type B = Exact< { a: number; b: number }, { a: number } >; // never
 */
export type Exact< T, Shape > = T extends Shape ? Exclude< keyof T, keyof Shape > extends never ? T : never : never;
