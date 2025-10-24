/**
 * Utility Types
 * Common utility types for manipulating and transforming types.
 * 
 * @module types/utils
 */

import { Simplify } from './base';

/**
 * Merge two object types; right-hand fields override left-hand ones
 * @example
 * type A = { a: number; b: string };
 * type B = { b: number; c: boolean };
 * type Merged = Merge<A, B>;
 * // { a: number; b: number; c: boolean }
 */
export type Merge< Left, Right > = Simplify< Pick< Left, Exclude< keyof Left, keyof Right > > & Right >;

/**
 * Deep merge two object types; right-hand fields override left-hand ones recursively
 * @example
 * type A = { a: { x: number; y: string }; b: string };
 * type B = { a: { y: number; z: boolean }; c: boolean };
 * type Merged = DeepMerge<A, B>;
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
 * Intersection of unions -> prefer mapped merge strategy
 * @example
 * type U = { a: number } | { b: string };
 * type V = { b: number } | { c: boolean };
 * type Merged = MergeMany<[U, V]>;
 * // { a: number; b: number } | { a: number; c: boolean } | { b: string; b: number } | { b: string; c: boolean }
 */
export type MergeMany< T extends any[] > = T extends [ infer H, ...infer R ] ? Merge< H, MergeMany< R > > : {};

/**
 * Convert a union to an intersection
 * @example
 * type U = { a: number } | { b: string };
 * type I = UnionToIntersection<U>;
 * // { a: number } & { b: string }
 */
export type UnionToIntersection< U > = ( U extends any ? ( k: U ) => void : never ) extends ( ( k: infer I ) => void ) ? I : never;

/**
 * Extract keys of T whose values match V
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumKeys = KeysByValue<Obj, number>; // "a" | "c"
 */
export type KeysByValue< T, V > = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

/**
 * Pick by value type
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumProps = PickByValue<Obj, number>;
 * // { a: number; c: number }
 */
export type PickByValue< T, V > = Pick< T, KeysByValue< T, V > >;

/**
 * Omit keys whose value matches V
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NonNumProps = OmitByValue<Obj, number>;
 * // { b: string; d: boolean }
 */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;

/**
 * Get keys of T that are optional
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type OptKeys = OptionalKeys<Obj>; // "b" | "c"
 */
export type OptionalKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? K : never }[ keyof T ];

/**
 * Get keys of T that are required
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type ReqKeys = RequiredKeys<Obj>; // "a" | "d"
 */
export type RequiredKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? never : K }[ keyof T ];

/**
 * Expand/flatten insertion points for nicer hover results
 * @example
 * type Nested = { a: { b: { c: number } } };
 * type Expanded = Expand<Nested>;
 * // { a: { b: { c: number } } }
 */
export type Expand< T > = T extends object ? { [ K in keyof T ]: T[ K ] } & {} : T;

/**
 * Flatten array types for nicer hover results
 * @example
 * type Arr = Array<{ a: number }>;
 * type FlatArr = Flatten<Arr>;
 * // { a: number }[]
 */
export type Flatten< T > = T extends any[] ? { [ K in keyof T ]: T[ K ] } : T;

/**
 * Exact - ensure T has exactly the properties of Shape (no more)
 * Usage: Exact< { a:number }, { a:number } > -> passes;
 *        Exact< { a:number; b: number }, { a:number } > -> fails
 * @example
 * type A = Exact<{ a: number }, { a: number }>; // { a: number }
 * type B = Exact<{ a: number; b: number }, { a: number }>; // never
 */
export type Exact< T, Shape > = T extends Shape ? Exclude< keyof T, keyof Shape > extends never ? T : never : never;
