/**
 * Combinator Types
 * Union, tuple, and intersection type transformations.
 * 
 * @module types/combinators
 */

/**
 * Convert a tuple/array to a union
 * Extracts the element types of a tuple and creates a union from them.
 * 
 * @template T - A readonly tuple type
 * 
 * @example
 * type Tup = [ string, number, boolean ];
 * type U = TupleToUnion< Tup >; // string | number | boolean
 */
export type TupleToUnion< T extends readonly any[] > = T[ number ];

/**
 * Convert a union to an overloaded function signature
 * Useful as an intermediary step for union manipulations.
 * 
 * Note: can be slow for very large unions.
 * 
 * @template U - A union type
 * 
 * @example
 * type U = 'a' | 'b' | 'c';
 * type Fn = UnionToOverloadedFn< U >;
 * // ( k: 'a' ) => void & ( k: 'b' ) => void & ( k: 'c' ) => void
 */
export type UnionToOverloadedFn< U > = ( U extends any ? ( k: U ) => void : never ) extends ( k: infer I ) => void ? I : never;

/**
 * Namespace for UnionToTuple utilities
 * Provides helper types for working with unions and tuples.
 * 
 * @internal
 */
export namespace UnionToTuple {

    /**
     * Extract the "last" member of a union (implementation-specific)
     * Used internally for building tuples from unions.
     * 
     * @template U - A union type
     */
    export type Last< U > = UnionToOverloadedFn< U > extends ( x: infer L ) => void ? L : never;

}

/**
 * Convert a union to a tuple (order not guaranteed)
 * Works well for small to medium unions; performance degrades for large unions.
 * 
 * @template U - A union type
 * @template T - Internal accumulator (used during recursion)
 * 
 * @example
 * type U = 'a' | 'b' | 'c';
 * type Tup = UnionToTuple< U >; // [ 'a', 'b', 'c' ] (order may vary)
 */
export type UnionToTuple< U, T extends any[] = [] > = [ U ] extends [ never ] ? T
    : UnionToTuple< Exclude< U, UnionToTuple.Last< U > >, [ UnionToTuple.Last< U >, ...T ] >;

/**
 * Build a discriminated union from a tag key and type mapping
 * Creates a union of types where each member has a specific tag value.
 * 
 * @template Tag - The discriminator property name
 * @template Map - An object mapping tag values to their corresponding types
 * 
 * @example
 * type AnimalMap = { cat: { meows: boolean }; dog: { barks: boolean } };
 * type Animal = DiscriminatedUnion< 'type', AnimalMap >;
 * // { type: 'cat'; meows: boolean } | { type: 'dog'; barks: boolean }
 */
export type DiscriminatedUnion< Tag extends string, Map extends Record< string, any > > = {
    [ K in keyof Map & string ]: { [ P in Tag ]: K } & Map[ K ]
}[ keyof Map & string ];
