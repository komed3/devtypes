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
export type Primitive = string | number | boolean | symbol | null | undefined | bigint;

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
 * All JSON primitive types.
 * 
 * @remarks
 * Includes the primitive types that can be represented in JSON format.
 * 
 * @example
 * type JP = JSONPrimitive;
 * // string | number | boolean | null
 */
export type JSONPrimitive = string | number | boolean | null;

/**
 * All JSON bad values types.
 * 
 * @remarks
 * Includes the types that are not valid JSON values and will be:
 * - Omitted when found in an `object`.
 * - Changed to `[null]` if found in an `array`.
 * - Will cause the stringification process to return undefined.
 * 
 * `bigint` will throw an error.
 * In theory `bigint` can be handled by monkey patching `BigInt.prototype.toJSON = ...`.
 * And then converted to an object, and be parsed with a custom JSON parser.
 * Which is out of scope in this context.
 * 
 * Warnings, things TS cannot protect you against:
 * - `Infinity` and `NaN` will be converted to null.
 * - Any Object which has toJSON() method will behave in accordance to said method.
 * - Uncommon things not mentionned here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
 * 
 * @example
 * JSON.stringify({a: undefined, b: ()=>{}, c: Symbol('')}) // "{}"
 * JSON.stringify(undefined)                                // undefined
 * JSON.stringify(()=>{})                                   // undefined
 * JSON.stringify(Symbol("s"))                              // undefined
 * JSON.stringify([undefined, ()=>{}, Symbol('s')])         // "[null, null, null]"
 * JSON.stringify(BigInt(1))                                // Type Error               
 * 
 */
export type JSONBadValueTypes = bigint | undefined | Function | Symbol

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

/**
 * Convert primitive literal types to their boxed object counterparts.
 * 
 * @remarks
 * Useful when interacting with APIs or type constraints that expect
 * boxed primitives instead of their primitive forms.
 * 
 * @template T - Primitive literal type(s) to convert
 * 
 * @example
 * type Boxed = Box< 'hello' | 42 | true >;
 * // String | Number | Boolean
 */
export type Box< T > =
    T extends string ? String
        : T extends number ? Number
        : T extends boolean ? Boolean
        : T extends symbol ? Symbol
        : T;
