/**
 * Base Types
 * 
 * Core foundational utility types for high-performance type-level programming.
 * Includes conditional logic, type guards, branding, and basic transformations.
 * 
 * @module types/base
 * @since 1.0.0
 */

/**
 * Conditional type helper.
 * 
 * @remarks
 * Evaluates a boolean condition at the type level and resolves to one of two
 * branches. Commonly used as a building block for more complex utilities.
 * 
 * @template Cond - Boolean condition to evaluate
 * @template Then - Type returned if the condition is `true`
 * @template Else - Type returned if the condition is `false` (defaults to `never`)
 * 
 * @example
 * type Result = If< true, string, number >;
 * // string
 */
export type If< Cond extends boolean, Then, Else = never > =
    Cond extends true ? Then : Else;

/**
 * Type guard: detect `any`.
 * 
 * @remarks
 * Uses the `0 extends (1 & T)` trick to reliably distinguish `any` from all
 * other types, including `unknown`.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsAny< any >;     // true
 * type B = IsAny< string >;  // false
 */
export type IsAny< T > = 0 extends ( 1 & T ) ? true : false;

/**
 * Type guard: detect `never`.
 * 
 * @remarks
 * Identifies the bottom type `never` using tuple-based detection to avoid
 * distributive conditional behavior.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsNever< never >;   // true
 * type B = IsNever< string >;  // false
 */
export type IsNever< T > = [ T ] extends [ never ] ? true : false;

/**
 * Type guard: detect `unknown` (excluding `any`).
 * 
 * @remarks
 * Differentiates `unknown` from `any` and from concrete types by combining
 * constraint checks with an explicit `any` exclusion.
 * 
 * @template T - Type to test
 * 
 * @example
 * type A = IsUnknown< unknown >; // true
 * type B = IsUnknown< any >;     // false
 * type C = IsUnknown< string >;  // false
 */
export type IsUnknown< T > =
    IsAny< T > extends true
        ? false
        : unknown extends T
            ? ( T extends {} ? false : true )
            : false;

/**
 * Conditional type based on type equality.
 * 
 * @since 1.1.0
 * @remarks
 * Resolves to one of two branches depending on whether two types are equal.
 * Internal implementation uses function signature variance for comparison.
 * This approach works well for most practical structural equality checks.
 * 
 * @template X - First type to compare
 * @template Y - Second type to compare
 * @template A - Type returned if X and Y are equal (defaults to X)
 * @template B - Type returned if X and Y are not equal (defaults to `never`)
 * 
 * @example
 * type A = IfEquals< string, string, number, boolean >; // number
 * type B = IfEquals< string, number, number, boolean >; // boolean
 */
export type IfEquals< X, Y, A = X, B = never > =
    ( < T >() => T extends X ? 1 : 2 ) extends
    ( < T >() => T extends Y ? 1 : 2 )
        ? A : B;

/**
 * Fast type equality test.
 * 
 * @remarks
 * Compares two types for equality and resolves to `true` or `false`.
 * Uses {@link IfEquals} internally for the comparison logic.
 * 
 * @template A - First type to compare
 * @template B - Second type to compare
 * 
 * @example
 * type A = Equals< string, string >; // true
 * type B = Equals< string, number >; // false
 */
export type Equals< A, B > = IfEquals< A, B, true, false >;

/**
 * Optional value type.
 * 
 * @remarks
 * Represents a value that may be `null` or `undefined`. Useful as a concise
 * shorthand for optional union types.
 * 
 * @template T - Value type
 * 
 * @example
 * type A = Maybe< string >;
 * // string | null | undefined
 */
export type Maybe< T > = T | null | undefined;

/**
 * Simplify a type for improved IntelliSense display.
 * 
 * @remarks
 * Expands intersections and flattens mapped types to produce cleaner IDE
 * hover tooltips. Functions are left untouched.
 * 
 * @template T - Type to simplify
 * 
 * @example
 * type Complex = { a: string } & { b: number } & { c: boolean };
 * type Simple = Simplify< Complex >;
 * // { a: string; b: number; c: boolean }
 */
export type Simplify< T > =
    T extends Function
        ? T
        : { [ K in keyof T ]: T[ K ] } & {};

/**
 * Narrow a type without widening literals.
 * 
 * @remarks
 * Preserves literal types while leaving their corresponding base types
 * unchanged. Primarily useful as a semantic marker in public APIs.
 * 
 * @template T - Type to narrow
 * 
 * @example
 * type A = Narrow< 'hello' >; // 'hello'
 * type B = Narrow< string >;  // string
 */
export type Narrow< T > =
    T extends string
        ? ( string extends T ? T : T )
        : T extends number
            ? ( number extends T ? T : T )
            : T;

/**
 * Brand a type for nominal typing.
 * 
 * @remarks
 * Creates a nominally distinct type by intersecting a base type with a
 * readonly marker property. This prevents accidental mixing of otherwise
 * structurally compatible types.
 * 
 * @template Base - Base type to brand
 * @template Tag - Unique string literal identifying the brand
 * @template Key - Property name used as the brand marker (defaults to `__brand`)
 * @template Required - Whether the marker is required (defaults to `false`)
 * 
 * @example
 * type UserID = Brand< number, 'UserID' >;
 * const id: UserID = 123 as UserID;
 */
export type Brand<
    Base, Tag extends string, Key extends string = '__brand',
    Required extends boolean = false
> =
    Base & If<
        Required,
        { readonly [ K in Key ]: Tag },
        { readonly [ K in Key ]?: Tag }
    >;

/**
 * Cast a type while preserving assignability.
 * 
 * @remarks
 * Keeps the source type if it is assignable to the target type; otherwise,
 * resolves to the target type.
 * 
 * @template T - Source type
 * @template U - Target type
 * 
 * @example
 * type A = Cast< string, string | number >;   // string
 * type B = Cast< number, string | number >;   // number
 * type C = Cast< boolean, string | number >;  // string | number
 */
export type Cast< T, U > = T extends U ? T : U;
