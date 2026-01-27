/**
 * Compiler Assertions
 * 
 * Whitin this module are types that can be used to enforce certain conditions
 * at compile time. These assertions help catch type-related errors early in
 * the development process by validating assumptions about types.
 * 
 * If the provided type is `null` or `undefined`, there will be no compiler error.
 * 
 * Since TypeScript cannot assert undefined types, use this factory to create
 * your own compile-time assertions:
 * 
 * ```ts type Assert< T extends YourType > = T;```
 * 
 * @module devtypes/assert
 * @author komed3
 * @license MIT
 */

import type { Primitive } from './primitive';


/**
 * Assert that a boolean type resolves to `true`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not exactly `true`.
 * 
 * @template T - Boolean type that must be `true`
 * 
 * @example
 * type A = AssertTrue< true >;   // ✓
 * type B = AssertTrue< false >;  // ✗ TS error
 */
export type AssertTrue< T extends true > = T;

/**
 * Assert that a boolean type resolves to `false`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not exactly `false`.
 * 
 * @template T - Boolean type that must be `false`
 * 
 * @example
 * type A = AssertFalse< false >;  // ✓
 * type B = AssertFalse< true >;   // ✗ TS error
 */
export type AssertFalse< T extends false > = T;

/**
 * Assert that a type resolves to a JavaScript primitive type.
 * 
 * @remarks
 * Produces a compiler error if the provided type does not belong to these types:
 * string | number | boolean | symbol | null | undefined
 * 
 * @template T - Type that must be a primitive
 * 
 * @example
 * type A = AssertPrimitive< string >;  // ✓
 * type B = AssertPrimitive< {} >;      // ✗ TS error
 */
export type AssertPrimitive< T extends Primitive > = T;

/**
 * Assert that a type resolves to a `string`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not a `string`.
 * 
 * @template T - Type that must be a `string`
 * 
 * @example
 * type A = AssertString< '42' >;  // ✓
 * type B = AssertString< 42 >;    // ✗ TS error
 */
export type AssertString< T extends string > = T;

/**
 * Assert that a type resolves to a `number`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not a `number`.
 * 
 * @template T - Type that must be a `number`
 * 
 * @example
 * type A = AssertNumber< number >;   // ✓
 * type B = AssertNumber< boolean >;  // ✗ TS error
 */
export type AssertNumber< T extends number > = T;

/**
 * Assert that a type resolves to a `boolean`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not a `boolean`.
 * 
 * @template T - Type that must be `true` or `false`
 * 
 * @example
 * type A = AssertBoolean< true >;    // ✓
 * type B = AssertBoolean< string >;  // ✗ TS error
 */
export type AssertBoolean< T extends boolean > = T;

/**
 * Assert that a type resolves to a `symbol`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not a `symbol`.
 * Useful for validating symbol-based APIs at compile time.
 * 
 * @template T - Type that must be a `symbol`
 * 
 * @example
 * type A = AssertSymbol< symbol >;  // ✓
 * type B = AssertSymbol< string >;  // ✗ TS error
 */
export type AssertSymbol< T extends symbol > = T;

/**
 * Assert that a type is an array or readonly `array`.
 * 
 * @remarks
 * Ensures that the given type is assignable to a tuple or array type.
 * Fails at compile time for non-array types.
 * 
 * @template T - Type that must be an `array`
 * 
 * @example
 * type A = AssertArray< number[] >;           // ✓
 * type B = AssertArray< readonly string[] >;  // ✓
 * type C = AssertArray< string >;             // ✗ TS error
 */
export type AssertArray< T extends readonly any[] > = T;

/**
 * Assert that a type is an `object`.
 * 
 * @remarks
 * Accepts all non-primitive object types.
 * Does not exclude arrays or functions.
 * 
 * @template T - Type that must be an `object`
 * 
 * @example
 * type A = AssertObject< { a: number } >;  // ✓
 * type B = AssertObject< number >;         // ✗ TS error
 */
export type AssertObject< T extends {} > = T;

/**
 * Assert that a type is a `Record`.
 * 
 * @remarks
 * Ensures the type is indexable by `string`, `number`, or `symbol` keys.
 * Useful for validating dictionary-like structures.
 * 
 * @template T - Type that must be a record
 * 
 * @example
 * type A = AssertRecord< Record< string, number > >;  // ✓
 * type B = AssertRecord< { a: number } >;             // ✓
 * type C = AssertRecord< string >;                    // ✗ TS error
 */
export type AssertRecord< T extends Record< string | number | symbol, any > > = T;

/**
 * Assert that a type is a `Map`.
 * 
 * @remarks
 * Ensures the type extends the built-in `Map` type.
 * Key and value types are not restricted.
 * 
 * @template T - Type that must be a `Map`
 * 
 * @example
 * type A = AssertMap< Map< string, number > >;  // ✓
 * type B = AssertMap< Set< number > >;          // ✗ TS error
 */
export type AssertMap< T extends Map< any, any > > = T;

/**
 * Assert that a type is a `Set`.
 * 
 * @remarks
 * Ensures the type extends the built-in `Set` type.
 * Element type is not restricted.
 * 
 * @template T - Type that must be a `Set`
 * 
 * @example
 * type A = AssertSet< Set< number > >;  // ✓
 * type B = AssertSet< number[] >;       // ✗ TS error
 */
export type AssertSet< T extends Set< any > > = T;

/**
 * Assert that a type is a `Date`.
 * 
 * @remarks
 * Ensures the type extends the built-in `Date` object.
 * Useful for APIs that rely on actual Date instances.
 * 
 * @template T - Type that must be a `Date`
 * 
 * @example
 * type A = AssertDate< Date >;    // ✓
 * type B = AssertDate< string >;  // ✗ TS error
 */
export type AssertDate< T extends Date > = T;

/**
 * Assert that a type is a `RegExp`.
 * 
 * @remarks
 * Ensures the type extends the built-in `RegExp` object.
 * 
 * @template T - Type that must be a `RegExp`
 * 
 * @example
 * type A = AssertRegExp< RegExp >;  // ✓
 * type B = AssertRegExp< string >;  // ✗ TS error
 */
export type AssertRegExp< T extends RegExp > = T;

/**
 * Assert that a type is an `Error`.
 * 
 * @remarks
 * Accepts all error subclasses such as `TypeError` or `RangeError`.
 * 
 * @template T - Type that must extend `Error`
 * 
 * @example
 * type A = AssertError< Error >;      // ✓
 * type B = AssertError< TypeError >;  // ✓
 * type C = AssertError< string >;     // ✗ TS error
 */
export type AssertError< T extends Error > = T;

/**
 * Assert that a type is a function.
 * 
 * @remarks
 * Accepts callable types including function declarations
 * and arrow function types.
 * 
 * @template T - Type that must be callable
 * 
 * @example
 * type A = AssertFunction< () => void >;  // ✓
 * type B = AssertFunction< {} >;          // ✗ TS error
 */
export type AssertFunction< T extends Function | CallableFunction > = T;

/**
 * Assert that a type is an object whose values are functions.
 * 
 * @remarks
 * Useful for validating method maps or API surfaces
 * consisting exclusively of callable properties.
 * 
 * @template T - Object type with function-valued properties
 * 
 * @example
 * type A = AssertFunctionObject< { a(): void; b(): number } >;  // ✓
 * type B = AssertFunctionObject< { a: number } >;               // ✗ TS error
 */
export type AssertFunctionObject< T extends { [ key: string ]: Function | CallableFunction } > = T;

/**
 * Assert that a type is a `Promise`.
 * 
 * @remarks
 * Ensures the type extends the built-in `Promise` class.
 *
 * @template T - Type that must be a `Promise`
 * 
 * @example
 * type A = AssertPromise< Promise< number > >;  // ✓
 * type B = AssertPromise< number >;             // ✗ TS error
 */
export type AssertPromise< T extends Promise< any > > = T;

/**
 * Assert that a type is `PromiseLike`.
 * 
 * @remarks
 * Accepts any thenable object compatible with `PromiseLike`.
 * Does not require an actual Promise instance.
 * 
 * @template T - Type that must be `Promise`-like
 * 
 * @example
 * type A = AssertPromiseLike< Promise< number > >;  // ✓
 * type B = AssertPromiseLike< { then(): void } >;   // ✓
 * type C = AssertPromiseLike< number >;             // ✗ TS error
 */
export type AssertPromiseLike< T extends PromiseLike< any > > = T;
