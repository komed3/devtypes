/**
 * Union Types
 * 
 * Utility types for manipulating and transforming union types in TypeScript.
 * 
 * @module devtypes/union
 * @author komed3
 * @license MIT
 */


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

/** @internal */
export type UnionLast< U > =
    UnionToIntersection< U extends any ? ( x: U ) => 0 : never > extends
        ( x: infer L ) => 0 ? L : never;

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
export type DiscriminatedUnion< Tag extends string, Map extends Record< string, any > > = {
    [ K in keyof Map & string ]: { [ P in Tag ]: K } & Map[ K ];
}[ keyof Map & string ];

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
