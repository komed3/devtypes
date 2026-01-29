/**
 * Union Types
 * 
 * Utility types for manipulating and transforming union types in TypeScript.
 * 
 * @module devtypes/union
 * @author komed3
 * @license MIT
 */

import { Simplify } from './util';


/** @internal */
type UnionLast< U > =
    UnionToIntersection< U extends any ? ( x: U ) => 0 : never > extends
        ( x: infer L ) => 0 ? L : never;


/**
 * Convert a union type to an intersection.
 * 
 * @remarks
 * Type with all members of the union merged into a single composite type.
 * 
 * @template U - Union type
 * 
 * @example
 * type U = { a: string } | { b: number };
 * type I = UnionToIntersection< U >;
 * // { a: string } & { b: number }
 */
export type UnionToIntersection< U > =
    ( U extends any ? ( k: U ) => void : never ) extends ( k: infer I ) => void
        ? I
        : never;

/**
 * Convert a union type to a tuple.
 * 
 * @remarks
 * Produces a tuple containing all members of the union. The resulting order
 * is not guaranteed and should be treated as arbitrary.
 * 
 * Performance degrades for large unions due to recursive conditional types.
 * 
 * @template U - Union type
 * @template T - Internal accumulator (used during recursion)
 * 
 * @example
 * type U = 'a' | 'b' | 'c';
 * type Tup = UnionToTuple< U >;
 * // [ 'a', 'b', 'c' ] (order may vary)
 */
export type UnionToTuple< U, T extends any[] = [] > =
    [ U ] extends [ never ]
        ? T
        : UnionToTuple<
            Exclude< U, UnionLast< U > >,
            [ UnionLast< U >, ...T ]
        >;

/**
 * Build a discriminated union from a tag key and a mapping object.
 * 
 * @remarks
 * Creates a union of object types where each member is tagged with a literal
 * discriminator value derived from the mapping keys.
 * 
 * @template Tag - Discriminator property name
 * @template Map - Mapping of discriminator values to object shapes
 * 
 * @example
 * type AnimalMap = {
 *   cat: { meows: boolean };
 *   dog: { barks: boolean };
 * };
 * 
 * type Animal = DiscriminatedUnion< 'type', AnimalMap >;
 * // { type: 'cat'; meows: boolean } | { type: 'dog'; barks: boolean }
 */
export type DiscriminatedUnion< Tag extends string, Map extends Record< string, any > > =
    Simplify< {
        [ K in keyof Map & string ]: { [ P in Tag ]: K } & Map[ K ];
    }[ keyof Map & string ] >;

/**
 * Pick specific members from a union by type.
 * 
 * @remarks
 * Extracts only the union members that extend a given type.
 * Useful for filtering union types without modifying the original type.
 * 
 * @template U - A union type
 * @template T - The type to match union members against
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionPick< U, string | number >;  // string | number
 */
export type UnionPick< U, T > = U extends T ? U : never;

/**
 * Omit specific members from a union by type.
 * 
 * @remarks
 * Excludes union members that extend a given type.
 * Complementary to {@link UnionPick}, useful for narrowing unions.
 * 
 * @template U - A union type
 * @template T - The type to exclude from the union
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionOmit< U, string | null >;  // number | boolean
 */
export type UnionOmit< U, T > = U extends T ? never : U;

/**
 * Extract all keys from a union of object types.
 * 
 * @remarks
 * Produces the union of keys that appear in at least one member
 * of the union.
 * 
 * @template U - Union of object types
 * 
 * @example
 * type U = { a: string } | { b: number };
 * type K = UnionKeys< U >;  // 'a' | 'b'
 */
export type UnionKeys< U > = U extends any ? keyof U : never;

/**
 * Extract all value types from a union of object types.
 * 
 * @remarks
 * Produces a union of all property value types across all members.
 * 
 * @template U - Union of object types
 * 
 * @example
 * type U = { a: string } | { b: number };
 * type V = UnionValues< U >;  // string | number
 */
export type UnionValues< U > = U extends any ? U[ keyof U ] : never;

/**
 * Merge a union of object types into a single object type.
 * 
 * @remarks
 * All properties from all union members are combined.
 * Properties not present in every member become optional.
 * 
 * This is a structural merge and may lose discriminant information.
 * 
 * @template U - Union of object types
 * 
 * @example
 * type U = { a: string } | { b: number };
 * type M = UnionMerge< U >;
 * // { a?: string; b?: number }
 */
export type UnionMerge< U > = {
    [ K in UnionKeys< U > ]?: U extends any
        ? K extends keyof U
            ? U[ K ]
            : never
        : never;
};

/**
 * Check if a union type includes a specific type.
 * 
 * @remarks
 * Evaluates to `true` if the type `T` is assignable to the union `U`,
 * otherwise evaluates to `false`.
 * 
 * @template U - A union type
 * @template T - The type to check for membership in the union
 * 
 * @example
 * type U = string | number | boolean;
 * type HasString = UnionHas< U, string >;  // true
 * type HasDate = UnionHas< U, Date >;      // false
 */
export type UnionHas< U, T > = [ T ] extends [ U ] ? true : false;

/**
 * Get the intersection of two union types.
 * 
 * @remarks
 * Produces a union of types that are present in both `A` and `B`.
 * 
 * @template A - First union type
 * @template B - Second union type
 * 
 * @example
 * type A = 'a' | 'b' | 'c';
 * type B = 'a' | 'x';
 * type C = UnionDifference< A, B >;  // 'a'
 */
export type UnionIntersect< A, B > = A extends B ? A : never;

/**
 * Get the difference of two union types.
 * 
 * @remarks
 * Produces a union of types that are in `A` but not in `B`.
 * 
 * @template A - First union type
 * @template B - Second union type
 * 
 * @example
 * type A = 'a' | 'b' | 'c';
 * type B = 'a' | 'x';
 * type C = UnionDifference< A, B >;  // 'b' | 'c'
 */
export type UnionDifference< A, B > = A extends B ? never : A;
