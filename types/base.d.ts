/**
 * Base Types
 * Core foundational utility types for high-performance type-level programming.
 * 
 * @module types/base
 */

/** Conditional helpers */
export type If< Cond extends boolean, Then, Else = never > = Cond extends true ? Then : Else;

/** Detect `any` */
export type IsAny< T > = 0 extends ( 1 & T ) ? true : false;

/** Detect `never` */
export type IsNever< T > = [ T ] extends [ never ] ? true : false;

/** Detect `unknown` (true when T is unknown but not any) */
export type IsUnknown< T > = IsAny< T > extends true ? false : unknown extends T ? ( T extends {} ? false : true ) : false;

/** Fast equality test — works for most practical cases */
export type Equals< A, B > = ( < T >() => T extends A ? 1 : 2 ) extends ( < T >() => T extends B ? 1 : 2 ) ? true : false;

/** Maybe type (null or undefined) */
export type Maybe< T > = T | null | undefined;

/** Simplify a type to make Intellisense show a friendly shape */
export type Simplify< T > = T extends Function ? T : { [ K in keyof T ]: T[ K ] } & {};

/** Narrow a type to a specific subtype (useful for literal narrowing) */
export type Narrow< T > = T extends string ? ( string extends T ? T : T ) : T extends number ? ( number extends T ? T : T ) : T;

/** Branding/nominal typing */
export type Brand< Base, Tag extends string > = Base & { readonly __brand?: Tag };

/** Cast a type to another, preserving assignability when possible */
export type Cast< T, U > = T extends U ? T : U;
