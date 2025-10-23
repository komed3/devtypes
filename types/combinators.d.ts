/** Combinators: union/tuple/intersection utilities */

/** Convert a tuple to a union */
export type TupleToUnion< T extends readonly any[] > = T[ number ];

/**
 * Convert a union to an overloaded function and extract tuple form.
 * Note: this is an established trick but can be slow for very large unions.
 */
export type UnionToOverloadedFn< U > = (
    U extends any ? ( k: U ) => void : never
) extends ( k: infer I ) => void ? I : never;

/** Union to tuple (order not guaranteed). Good for small unions. */
export type UnionToTuple< U, T extends any[] = [] > = [ U ] extends [ never ] ? T
    : UnionToTuple< Exclude< U, UnionToTuple.Last< U > >, [ UnionToTuple.Last< U >, ...T ] >;

export namespace UnionToTuple {
    export type Last< U > = UnionToOverloadedFn< U > extends ( x: infer L ) => void ? L : never;
}

/** Build a discriminated union from a tag key and mapping */
export type DiscriminatedUnion< Tag extends string, Map extends Record< string, any > > = {
    [ K in keyof Map & string ]: { [ P in Tag ]: K } & Map[ K ]
}[ keyof Map & string ];
