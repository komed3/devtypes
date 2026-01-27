/**
 * Base Types
 * 
 * Module includes basic concepts such as conditional logic, type branding, casting,
 * and basic transformations.
 * 
 * @module devtypes/base
 * @author komed3
 * @license MIT
 */


/**
 * Conditional type helper.
 * 
 * @remarks
 * Evaluates a boolean condition at the type level and resolves to one of two branches.
 * 
 * @template Cond - Boolean condition to evaluate
 * @template Then - Type returned if the condition is `true`
 * @template Else - Type returned if the condition is `false` (defaults to `never`)
 * 
 * @example
 * type Result = If< true, string, number >; // string
 */
export type If< Cond extends boolean, Then, Else = never > =
    Cond extends true ? Then : Else;

/**
 * Conditional type based on type equality.
 * 
 * @remarks
 * Resolves to one of two branches depending on whether two types are equal.
 * Internal implementation uses function signature variance for comparison.
 * This approach works well for most practical structural equality checks.
 * 
 * @template X - First type to compare
 * @template Y - Second type to compare
 * @template A - Type returned if `X` and `Y` are equal (defaults to `X`)
 * @template B - Type returned if `X` and `Y` are not equal (defaults to `never`)
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
 * Uses `{@link IfEquals}` internally for the comparison logic.
 * 
 * @template A - First type to compare
 * @template B - Second type to compare
 * 
 * @example
 * type A = Equals< string, string >; // true
 * type B = Equals< string, number >; // false
 */
export type Equals< A, B > = IfEquals< A, B, true, false >;
