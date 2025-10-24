/**
 * Combinator Types
 * Union, tuple, and intersection type helpers.
 * 
 * @module types/combinators
 */

/**
 * Convert a tuple to a union
 * @example
 * type Tup = [string, number, boolean];
 * type U = TupleToUnion<Tup>; // string | number | boolean
 */
export type TupleToUnion< T extends readonly any[] > = T[ number ];

/**
 * Convert a union to an overloaded function and extract tuple form.
 * Note: this is an established trick but can be slow for very large unions.
 * @example
 * type U = 'a' | 'b' | 'c';
 * type Fn = UnionToOverloadedFn<U>; // (k: 'a') => void & (k: 'b') => void & (k: 'c') => void
 */
export type UnionToOverloadedFn< U > = (
    U extends any ? ( k: U ) => void : never
) extends ( k: infer I ) => void ? I : never;

/**
 * Union to tuple (order not guaranteed). Good for small unions.
 * @example
 * type U = 'a' | 'b' | 'c';
 * type Tup = UnionToTuple<U>; // ['a', 'b', 'c']
 */
export type UnionToTuple< U, T extends any[] = [] > = [ U ] extends [ never ] ? T
    : UnionToTuple< Exclude< U, UnionToTuple.Last< U > >, [ UnionToTuple.Last< U >, ...T ] >;

export namespace UnionToTuple {
    export type Last< U > = UnionToOverloadedFn< U > extends ( x: infer L ) => void ? L : never;
}

/**
 * Build a discriminated union from a tag key and mapping
 * @example
 * type Map = { cat: { meows: boolean }; dog: { barks: boolean } };
 * type DU = DiscriminatedUnion<'type', Map>;
 * // { type: 'cat'; meows: boolean } | { type: 'dog'; barks: boolean }
 */
export type DiscriminatedUnion< Tag extends string, Map extends Record< string, any > > = {
    [ K in keyof Map & string ]: { [ P in Tag ]: K } & Map[ K ]
}[ keyof Map & string ];
