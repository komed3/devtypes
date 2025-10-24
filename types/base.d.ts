/**
 * Base Types
 * Core foundational utility types for high-performance type-level programming.
 * 
 * @module types/base
 */

/**
 * Conditional helpers
 * @example
 * type Result = If< true, string, number >; // string
 */
export type If< Cond extends boolean, Then, Else = never > = Cond extends true ? Then : Else;

/**
 * Detect `any`
 * @example
 * type A = IsAny<any>; // true
 * type B = IsAny<string>; // false
 */
export type IsAny< T > = 0 extends ( 1 & T ) ? true : false;

/**
 * Detect `never`
 * @example
 * type A = IsNever<never>; // true
 * type B = IsNever<string>; // false
 */
export type IsNever< T > = [ T ] extends [ never ] ? true : false;

/**
 * Detect `unknown` (true when T is unknown but not any)
 * @example
 * type A = IsUnknown<unknown>; // true
 * type B = IsUnknown<any>; // false
 * type C = IsUnknown<string>; // false
 */
export type IsUnknown< T > = IsAny< T > extends true ? false : unknown extends T ? ( T extends {} ? false : true ) : false;

/**
 * Fast equality test — works for most practical cases
 * @example
 * type A = Equals<string, string>; // true
 * type B = Equals<string, number>; // false
 */
export type Equals< A, B > = ( < T >() => T extends A ? 1 : 2 ) extends ( < T >() => T extends B ? 1 : 2 ) ? true : false;

/**
 * Maybe type (null or undefined)
 * @example
 * type A = Maybe<string>; // string | null | undefined
 */
export type Maybe< T > = T | null | undefined;

/**
 * Simplify a type to make Intellisense show a friendly shape
 * @example
 * type Complex = { a: string } & { b: number } & { c: boolean };
 * type Simple = Simplify<Complex>; // { a: string; b: number; c: boolean }
 */
export type Simplify< T > = T extends Function ? T : { [ K in keyof T ]: T[ K ] } & {};

/**
 * Narrow a type to a specific subtype (useful for literal narrowing)
 * @example
 * type A = Narrow<"hello">; // "hello"
 * type B = Narrow<string>; // string
 */
export type Narrow< T > = T extends string ? ( string extends T ? T : T ) : T extends number ? ( number extends T ? T : T ) : T;

/**
 * Branding/nominal typing
 * @example
 * type UserID = Brand<number, 'UserID'>; // nominally typed UserID
 */
export type Brand< Base, Tag extends string > = Base & { readonly __brand?: Tag };

/**
 * Cast a type to another, preserving assignability when possible
 * @example
 * type A = Cast<string, string | number>; // string
 * type B = Cast<number, string | number>; // string | number
 */
export type Cast< T, U > = T extends U ? T : U;
