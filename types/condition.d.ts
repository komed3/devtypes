/**
 * Conditional Types
 * 
 * Module includes types for conditional logic and type equality checks.
 * 
 * @module devtypes/condition
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
 * type Result = If< true, string, number >;  // string
 */
export type If< Cond extends boolean, Then, Else = never > =
    Cond extends true ? Then : Else;

/**
 * Conditional type over multiple boolean conditions.
 * 
 * @remarks
 * Evaluates to `Then` if all conditions in the tuple are `true`.
 * Otherwise resolves to `Else`.
 * 
 * Empty tuples evaluate to `Then`.
 * 
 * @template T - Tuple of boolean conditions
 * @template Then - Result if all conditions are true
 * @template Else - Result if any condition is false
 * 
 * @example
 * type A = IfAll< [ true, true ], 'ok', 'fail' >;   // 'ok'
 * type B = IfAll< [ true, false ], 'ok', 'fail' >;  // 'fail'
 */
export type IfAll< T extends readonly boolean[], Then, Else = never > =
    T extends readonly [ infer H extends boolean, ...infer R extends boolean[] ]
        ? If< H, IfAll< R, Then, Else >, Else >
        : Then;

/**
 * Conditional type that succeeds if any condition is true.
 * 
 * @remarks
 * Evaluates to `Then` if at least one condition in the tuple is `true`.
 * Otherwise resolves to `Else`.
 * 
 * Empty tuples evaluate to `Else`.
 * 
 * @template T - Tuple of boolean conditions
 * @template Then - Result if any condition is true
 * @template Else - Result if all conditions are false
 * 
 * @example
 * type A = IfAny< [ false, true ], 'ok', 'fail' >;   // 'ok'
 * type B = IfAny< [ false, false ], 'ok', 'fail' >;  // 'fail'
 */
export type IfAny< T extends readonly boolean[], Then, Else = never > =
    T extends readonly [ infer H extends boolean, ...infer R extends boolean[] ]
        ? If< H, Then, IfAny< R, Then, Else > >
        : Else;

/**
 * Conditional type that succeeds if all conditions are false.
 * 
 * @remarks
 * Evaluates to `Then` if all conditions in the tuple are `false`.
 * Otherwise resolves to `Else`.
 * 
 * Empty tuples evaluate to `Then`.
 * 
 * @template T - Tuple of boolean conditions
 * @template Then - Result if all conditions are false
 * @template Else - Result if any condition is true
 * 
 * @example
 * type A = IfNon< [ false, false ], 'ok', 'fail' >;  // 'ok'
 * type B = IfNon< [ false, true ], 'ok', 'fail' >;   // 'fail'
 */
export type IfNon< T extends readonly boolean[], Then, Else = never > =
    If< IfAny< T, false, true >, Then, Else >;

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
 * type A = IfEquals< string, string, number, boolean >;  // number
 * type B = IfEquals< string, number, number, boolean >;  // boolean
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
 * 
 * @template A - First type to compare
 * @template B - Second type to compare
 * 
 * @example
 * type A = Equals< string, string >;  // true
 * type B = Equals< string, number >;  // false
 */
export type Equals< A, B > = IfEquals< A, B, true, false >;

/**
 * Multiple type equality test.
 * 
 * @remarks
 * Compares a tuple of types for equality and resolves to `true` if all types
 * are equal, or `false` if any type differs.
 * 
 * @template T - Tuple of types to compare
 * 
 * @example
 * type A = EqualsAll< [ string, string, string ] >;   // true
 * type B = EqualsAll< [ boolean, number, number ] >;  // false
 */
export type EqualsAll< T extends readonly any[] > =
    T extends readonly [ infer A, infer B, ...infer Rest ]
        ? If< Equals< A, B >, EqualsAll< [ B, ...Rest ] >, false >
        : true;

/**
 * Test whether any adjacent types in a tuple are strictly equal.
 * 
 * @remarks
 * Evaluates to `true` if at least one pair of neighboring types in the tuple
 * is strictly equal.
 * 
 * Tuples with fewer than two elements always evaluate to `false`.
 * 
 * @template T - Tuple of types to compare
 * 
 * @example
 * type A = EqualsAny< [ string, number, string ] >;  // false
 * type B = EqualsAny< [ string, string, number ] >;  // true
 * type C = EqualsAny< [ 1, 2, 3 ] >;                 // false
 */
export type EqualsAny< T extends readonly any[] > =
    T extends readonly [ infer A, infer B, ...infer Rest ]
        ? If< Equals< A, B >, true, EqualsAny< [ B, ...Rest ] > >
        : false;

/**
 * Exact type matching: ensure no extra properties.
 * 
 * @remarks
 * Validates that `T` matches exactly the shape of `Shape`.
 * Useful for type-level validation or enforcing strict interfaces.
 * 
 * @template T - The type to validate
 * @template Shape - The exact shape to match
 * 
 * @example
 * type A = Exact< { a: number }, { a: number } >;            // { a: number }
 * type B = Exact< { a: number; b: number }, { a: number } >; // never
 */
export type Exact< T, Shape > =
    T extends Shape
        ? Exclude< keyof T, keyof Shape > extends never
            ? T
            : never
        : never;
