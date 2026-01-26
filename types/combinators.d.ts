/**
 * Combinator Types
 * 
 * Utility types for composing, transforming, and restructuring unions,
 * tuples, and intersections.
 * 
 * @module types/combinators
 * @since 1.0.0
 */

/**
 * Convert a tuple or readonly array type to a union.
 * 
 * @remarks
 * Extracts the element types of a tuple or array and produces a union of
 * those element types.
 * 
 * @template T - Tuple or readonly array type
 * 
 * @example
 * type Tup = [ string, number, boolean ];
 * type U = TupleToUnion< Tup >;
 * // string | number | boolean
 */
export type TupleToUnion< T extends readonly any[] > = T[ number ];

/**
 * Convert a union type to an intersection.
 * 
 * @since 1.1.0
 * @remarks
 * Useful for merging the members of a union into a single composite type.
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
 * Internal helpers for union-to-tuple transformations.
 * 
 * @internal
 */
export namespace UnionToTuple {

    /**
     * Extract the "last" member of a union.
     * 
     * @remarks
     * The notion of "last" is implementation-dependent and should not be relied
     * upon for deterministic ordering.
     * 
     * @template U - Union type
     */
    export type Last< U > = UnionToIntersection< U > extends ( x: infer L ) => void ? L : never;

}

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
            Exclude< U, UnionToTuple.Last< U > >,
            [ UnionToTuple.Last< U >, ...T ]
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
export type DiscriminatedUnion<
    Tag extends string,
    Map extends Record< string, any >
> =
    { [ K in keyof Map & string ]:
        { [ P in Tag ]: K } & Map[ K ];
    }[ keyof Map & string ];

/**
 * Append an element to the end of a tuple.
 * 
 * @since 1.1.0
 * @remarks
 * Creates a new tuple type with the specified element added at the end.
 * 
 * @template T - Tuple type
 * @template V - Element to append
 * 
 * @example
 * type Tup = [ number, string ];
 * type Appended = TupleAppend< Tup, boolean >;
 * // [ number, string, boolean ]
 */
export type TupleAppend< T extends readonly any[], V > = [ ...T, V ];

/**
 * Prepend an element to the beginning of a tuple.
 * 
 * @since 1.1.0
 * @remarks
 * Creates a new tuple type with the specified element added at the start.
 * 
 * @template T - Tuple type
 * @template V - Element to prepend
 * 
 * @example
 * type Tup = [ number, string ];
 * type Prepended = TuplePrepend< Tup, boolean >;
 * // [ boolean, number, string ]
 */
export type TuplePrepend< T extends readonly any[], V > = [ V, ...T ];
