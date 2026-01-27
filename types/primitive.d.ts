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
export type Primitive =
    | string
    | number
    | boolean
    | symbol
    | null
    | undefined;
