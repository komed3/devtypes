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
