/**
 * Primitive Types
 * Utilities for working with primitive types, literals, and type narrowing.
 * 
 * @module types/primitives
 */

import { IsAny } from './base';

/**
 * All primitive types
 * A union of all JavaScript primitive types.
 * 
 * @example
 * type P = Primitive; // string | number | boolean | symbol | null | undefined
 */
export type Primitive = string | number | boolean | symbol | null | undefined;

/**
 * All non-primitive types
 * 
 * @example
 * type NP = NonPrimitive; // object | Function
 */
export type NonPrimitive = object | Function;

/**
 * Literal union with autocomplete
 * Creates a union that allows a literal value or any value of its base type,
 * while maintaining IntelliSense autocomplete for the literals.
 * 
 * @template T - The union of literal types
 * @template U - The base type of the literals (defaults to string)
 * 
 * @example
 * type Size = LiteralUnion< 'small' | 'medium' | 'large' >;
 * // 'small' | 'medium' | 'large' | (string & {})
 */
export type LiteralUnion< T extends U, U = string > = T | ( U & Record< never, never > );

/**
 * Test if a type is a literal (string, number, or boolean literal)
 * Distinguishes between literal types and their general base types.
 * 
 * @template T - The type to test
 * 
 * @example
 * type A = IsLiteral< 'hello' >;  // true
 * type B = IsLiteral< 42 >;       // true
 * type C = IsLiteral< true >;     // true
 * type D = IsLiteral< string >;   // false
 */
export type IsLiteral< T > = IsAny< T > extends true ? false : (
    string extends T ? false : number extends T ? false : boolean extends T ? false : true
);

/**
 * Convert primitive literals to their boxed object types
 * Maps primitive literal types to their corresponding wrapper objects.
 * 
 * @template T - The primitive literal type(s) to box
 * 
 * @example
 * type Boxed = Box< 'hello' | 42 | true >; // String | Number | Boolean
 */
export type Box< T > = T extends string ? String
    : T extends number ? Number
    : T extends boolean ? Boolean
    : T extends Symbol ? Symbol
    : T;
