/**
 * Base Types
 * Core foundational utility types for high-performance type-level programming.
 * Includes conditional logic, type guards, branding, and basic transformations.
 * 
 * @module types/base
 */

/**
 * Conditional type helper
 * 
 * @template Cond - The condition to evaluate
 * @template Then - Type returned if condition is true
 * @template Else - Type returned if condition is false (defaults to never)
 * 
 * @example
 * type Result = If< true, string, number >; // string
 */
export type If< Cond extends boolean, Then, Else = never > = Cond extends true ? Then : Else;

/**
 * Type guard: detect `any`
 * Distinguishes `any` from other types through distributive conditional logic.
 * 
 * @template T - The type to test
 * 
 * @example
 * type A = IsAny< any >;     // true
 * type B = IsAny< string >;  // false
 */
export type IsAny< T > = 0 extends ( 1 & T ) ? true : false;

/**
 * Type guard: detect `never`
 * Identifies the bottom type `never` using tuple-based detection.
 * 
 * @template T - The type to test
 * 
 * @example
 * type A = IsNever< never >;  // true
 * type B = IsNever< string >; // false
 */
export type IsNever< T > = [ T ] extends [ never ] ? true : false;

/**
 * Type guard: detect `unknown` (but not `any`)
 * Distinguishes `unknown` from `any` and from concrete types using constraint checking.
 * 
 * @template T - The type to test
 * 
 * @example
 * type A = IsUnknown< unknown >; // true
 * type B = IsUnknown< any >;     // false
 * type C = IsUnknown< string >;  // false
 */
export type IsUnknown< T > = IsAny< T > extends true ? false : unknown extends T ? ( T extends {} ? false : true ) : false;

/**
 * Fast equality test
 * Works for most practical cases using function signature comparison.
 * 
 * @template A - The first type to compare
 * @template B - The second type to compare
 * 
 * @example
 * type A = Equals< string, string >; // true
 * type B = Equals< string, number >; // false
 */
export type Equals< A, B > = ( < T >() => T extends A ? 1 : 2 ) extends ( < T >() => T extends B ? 1 : 2 ) ? true : false;

/**
 * Conditional type for equality
 * Returns one of two types based on whether two types are equal.
 * 
 * @template X - The first type to compare
 * @template Y - The second type to compare
 * @template A - Type returned if X and Y are equal (defaults to X)
 * @template B - Type returned if X and Y are not equal (defaults to never)
 * 
 * @example
 * type A = IfEquals< string, string, number, boolean >; // number
 * type B = IfEquals< string, number, number, boolean >; // boolean
 */
export type IfEquals< X, Y, A = X, B = never > = ( < T >() => T extends X ? 1 : 2 ) extends ( < T >() => T extends Y ? 1 : 2 ) ? A : B;

/**
 * Maybe type: a value or null/undefined
 * Shorthand for optional union types.
 * 
 * @template T - The value type
 * 
 * @example
 * type A = Maybe< string >; // string | null | undefined
 */
export type Maybe< T > = T | null | undefined;

/**
 * Simplify a type structure for IntelliSense display
 * Expands intersections and simplifies nested types for better IDE hover previews.
 * 
 * @template T - The type to simplify
 * 
 * @example
 * type Complex = { a: string } & { b: number } & { c: boolean };
 * type Simple = Simplify< Complex >; // { a: string; b: number; c: boolean }
 */
export type Simplify< T > = T extends Function ? T : { [ K in keyof T ]: T[ K ] } & {};

/**
 * Narrow a type to exclude its parent type
 * Useful for refining literal types and narrowing union types.
 * 
 * @template T - The type to narrow
 * 
 * @example
 * type A = Narrow< 'hello' >; // 'hello'
 * type B = Narrow< string >; // string
 */
export type Narrow< T > = T extends string ? ( string extends T ? T : T ) : T extends number ? ( number extends T ? T : T ) : T;

/**
 * Brand a type with a unique tag for nominal typing
 * Creates distinct types that are structurally equivalent but nominally different.
 * 
 * @template Base - The base type to brand
 * @template Tag - A unique string tag for the brand
 * @template Key - The property name for the brand marker (defaults to '__brand')
 * @template Required - Whether the brand marker is required (defaults to false)
 * 
 * @example
 * type UserID = Brand< number, 'UserID' >;
 * const id: UserID = 123 as UserID;
 */
export type Brand< Base, Tag extends string, Key extends string = '__brand', Required extends boolean = false > =
    Base & If< Required, { readonly [ K in Key ]: Tag }, { readonly [ K in Key ]?: Tag } >;

/**
 * Cast a type to another while preserving assignability
 * Attempts to keep the source type if possible, otherwise falls back to the target.
 * 
 * @template T - The source type to cast
 * @template U - The target type to cast to
 * 
 * @example
 * type A = Cast< string, string | number >;   // string
 * type B = Cast< number, string | number >;   // number
 * type C = Cast< boolean, string | number >;  // string | number
 */
export type Cast< T, U > = T extends U ? T : U;
