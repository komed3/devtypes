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
 * type A = AssertSting< '42' >;  // ✓
 * type B = AssertSting< 42 >;    // ✗ TS error
 */
export type AssertSting< T extends string > = T;

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
 * type A = AssertSting< true >;    // ✓
 * type B = AssertSting< string >;  // ✗ TS error
 */
export type AssertBoolean< T extends boolean > = T;

/**
 * Assert that a type resolves to a `symbol`.
 * 
 * @remarks
 * Produces a compiler error if the provided type is not a `symbol`.
 * 
 * @template T - Type that must be a `symbol`
 * 
 * @example
 * type A = AssertSymbol< symbol >;  // ✓
 * type B = AssertSymbol< string >;  // ✗ TS error
 */
export type AssertSymbol< T extends symbol > = T;

export type AssertArray< T extends readonly any[] > = T;
export type AssertObject< T extends {} > = T;
export type AssertRecord< T extends Record< string | number | symbol, any > > = T;
export type AssertMap< T extends Map< any, any > > = T;
export type AssertSet< T extends Set< any > > = T;
export type AssertDate< T extends Date > = T;
export type AssertRegExp< T extends RegExp > = T;
export type AssertError< T extends Error > = T;

export type AssertFunction< T extends Function | CallableFunction > = T;
export type AssertFunctionObject< T extends { [ key: string ]: Function | CallableFunction } > = T;
export type AssertPromise< T extends Promise< any > > = T;
export type AssertPromiseLike< T extends PromiseLike< any > > = T;