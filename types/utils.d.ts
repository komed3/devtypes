/**
 * Utility Types
 * Common utilities for object transformation, key filtering, and type manipulation.
 * 
 * @module types/utils
 */

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
 * Pick specific members from a union by type
 * Extracts only the union members that extend a given type.
 * 
 * @template U - A union type
 * @template T - The type to match union members against
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionPick< U, string | number >; // string | number
 */
export type UnionPick< U, T > = U extends T ? U : never;

/**
 * Omit specific members from a union by type
 * Excludes union members that extend a given type.
 * 
 * @template U - A union type
 * @template T - The type to exclude from the union
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionOmit< U, string | null >; // number | boolean
 */
export type UnionOmit< U, T > = U extends T ? never : U;

/**
 * Pick properties with `never` value type
 * Useful for extracting placeholder properties from discriminated unions.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = PickNever< Obj >; // { b: never; d: never }
 */
export type PickNever< T > = Pick< T, { [ K in keyof T ]-?: T[ K ] extends never ? K : never }[ keyof T ] >;

/**
 * Omit properties with `never` value type
 * Removes placeholder or impossible properties from a type.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = OmitNever< Obj >; // { a: string; c: number }
 */
export type OmitNever< T > = Omit< T, { [ K in keyof T ]-?: T[ K ] extends never ? K : never }[ keyof T ] >;

/**
 * Test if an object has a specific property
 * Distinguishes between `undefined` and missing properties.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number };
 * type Has_a = HasProperty< Obj, 'a' >; // true
 * type Has_c = HasProperty< Obj, 'c' >; // false
 */
export type HasProperty< T, K extends PropertyKey > = K extends keyof T ? true : false;

/**
 * Test if an object has an optional property
 * Returns true only for properties declared with `?`.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsOpt_b = HasOptionalProperty< Obj, 'b' >; // true
 * type IsOpt_c = HasOptionalProperty< Obj, 'c' >; // false
 */
export type HasOptionalProperty< T, K extends PropertyKey > = K extends keyof T ? {} extends Pick< T, K > ? true : false : false;

/**
 * Test if an object has a required property
 * Returns true for properties that cannot be undefined.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsReq_a = HasRequiredProperty< Obj, 'a' >; // true
 * type IsReq_b = HasRequiredProperty< Obj, 'b' >; // false
 */
export type HasRequiredProperty< T, K extends PropertyKey > = K extends keyof T ? {} extends Pick< T, K > ? false : true : false;

/**
 * Make a specific property readonly
 * Marks only one property as readonly while keeping others mutable.
 * 
 * @template T - The object type
 * @template K - The key of the property to make readonly
 * 
 * @example
 * type Obj = { a: string; b: number };
 * type Result = ReadonlyProperty< Obj, 'a' >; // { readonly a: string; b: number }
 */
export type ReadonlyProperty< T, K extends keyof T > = Omit< T, K > & Readonly< Pick< T, K > >;

/**
 * Make a specific property mutable (remove readonly)
 * Removes readonly modifier from one property while keeping others unchanged.
 * 
 * @template T - The object type
 * @template K - The key of the property to make mutable
 * 
 * @example
 * type Obj = { readonly a: string; readonly b: number };
 * type Result = MutableProperty< Obj, 'a' >; // { a: string; readonly b: number }
 */
export type MutableProperty< T, K extends keyof T > = Omit< T, K > & { -readonly [ P in K ]: T[ P ] };
