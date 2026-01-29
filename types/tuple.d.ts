/**
 * Tuple Types
 * 
 * Utility types for manipulating and transforming Tuples in TypeScript.
 * 
 * @module devtypes/tuple
 * @author komed3
 * @license MIT
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
 * Concatenate two tuples.
 * 
 * @remarks
 * Creates a new tuple type by appending the elements of the second tuple
 * to the end of the first tuple.
 * 
 * @template A - First tuple
 * @template B - Second tuple
 * 
 * @example
 * type C = TupleConcat< [ 1, 2 ], [ 3, 4 ] >;  // [ 1, 2, 3, 4 ]
 */
export type TupleConcat< A extends readonly any[], B extends readonly any[] > =
    readonly [ ...A, ...B ];

/**
 * Append an element to the end of a tuple.
 * 
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

/**
 * Get the first element of a tuple.
 * 
 * @remarks
 * Extracts the type of the first element from a tuple type.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type H = TupleHead< [ number, string, boolean ] >;  // number
 */
export type TupleHead< T extends readonly any[] > =
    T extends readonly [ infer H, ...any[] ] ? H : never;

/**
 * Get the last element of a tuple.
 * 
 * @remarks
 * Extracts the type of the last element from a tuple type.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type L =TupleLast< [ number, string, boolean ] >;  // boolean
 */
export type TupleLast< T extends readonly any[] > =
    T extends readonly [ infer H, ...any[] ] ? H : never;

/**
 * Get all but the first element of a tuple.
 * 
 * @remarks
 * Extracts a new tuple type containing all elements except the first.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type H = TupleTail< [ number, string, boolean ] >;
 * // [ string, boolean ]
 */
export type TupleTail< T extends readonly any[] > =
    T extends readonly [ any, ...infer R ] ? R : [];

/**
 * Get the length of a tuple.
 * 
 * @remarks
 * Preserves literal length information for fixed tuples.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type L = TupleLength< [ string, string, number ] >;  // 3
 */
export type TupleLength< T extends readonly any[] > = T[ 'length' ];

/**
 * Reverse a tuple.
 * 
 * @remarks
 * Produces a new tuple with elements in reverse order.
 * Works with readonly tuples.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type R = TupleReverse< [ number, string, boolean ] >;
 * // [ boolean, string, number ]
 */
export type TupleReverse< T extends readonly any[], R extends readonly any[] = [] > =
    T extends readonly [ infer H, ...infer Rest ]
        ? TupleReverse< Rest, readonly [ H, ...R ] >
        : R;

/**
 * Zip two tuples into a tuple of pairs.
 * 
 * @remarks
 * Combines two tuples by pairing elements at corresponding positions.
 * Stops at the shorter tuple length.
 * 
 * @template A - First tuple
 * @template B - Second tuple
 * 
 * @example
 * type Z = TupleZip< [ 1, 2 ], [ 'a', 'b', 'c' ] >;
 * // [ [ 1, 'a' ], [ 2, 'b' ] ]
 */
export type TupleZip< A extends readonly any[], B extends readonly any[] > =
    A extends readonly [ infer AH, ...infer AT ]
        ? B extends readonly [ infer BH, ...infer BT ]
            ? readonly [ readonly [ AH, BH ], ...TupleZip< AT, BT > ]
            : readonly []
        : readonly [];

/**
 * Flatten a tuple recursively.
 * 
 * @remarks
 * Will recursively flatten nested tuples into a single-level tuple.
 * Only flattens tuple types, not general arrays.
 * 
 * @template T - Tuple type
 * 
 * @example
 * type F = TupleFlatten< [ 1, [ 2, [ 3 ] ], 4 ] >;  // [ 1, 2, 3, 4 ]
 */
export type TupleFlatten< T extends readonly any[] > =
    T extends readonly [ infer H, ...infer R ]
        ? H extends readonly any[]
            ? readonly [ ...TupleFlatten< H >, ...TupleFlatten< R > ]
            : readonly [ H, ...TupleFlatten< R > ]
        : readonly [];
