/**
 * Primitive Types
 * 
 * Utility types for working with JavaScript primitive values and literals.
 * 
 * @module devtypes/primitive
 * @author komed3
 * @license MIT
 */


/**
 * All JavaScript primitive types.
 * 
 * @remarks
 * Includes all ECMAScript primitives as defined by the language specification.
 * 
 * @example
 * type P = Primitive;
 * // string | number | boolean | symbol | null | undefined
 */
export type Primitive = string | number | boolean | symbol | null | undefined;

/**
 * All non-primitive JavaScript types.
 * 
 * @remarks
 * Represents values that are not primitives, including objects and functions.
 * 
 * @example
 * type NP = NonPrimitive;  // object | Function
 */
export type NonPrimitive = object | Function;

/**
 * Literal union with IntelliSense autocomplete support.
 * 
 * @remarks
 * Creates a union that accepts a set of literal values while still allowing
 * arbitrary values of the base type. This preserves editor autocomplete for
 * the literals without restricting extensibility.
 * 
 * @template T - Union of literal types
 * @template U - Base type of the literals (defaults to `string`)
 * 
 * @example
 * type Size = LiteralUnion< 'small' | 'medium' | 'large' >;
 * // 'small' | 'medium' | 'large' | ( string & {} )
 */
export type LiteralUnion< T extends U, U = string > = T | ( U & Record< never, never > );
