/**
 * Constraint Types
 * Types for enforcing specific requirements on object properties.
 * 
 * @module types/constraints
 */

/**
 * Extract specific properties as optional
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserContact = ExtractFrom<User, 'email' | 'phone'>;
 * // { email?: string; phone?: string }
 */
export type ExtractFrom< T, K extends keyof T > = Partial< Pick< T, K > >;

/**
 * Require specific properties
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserID = RequireFrom<User, 'id'>;
 * // { id: number }
 */
export type RequireFrom< T, K extends keyof T > = Required< Pick< T, K > >;

/**
 * Require exactly one property from a set of properties
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireExactlyOne<Test, 'a' | 'b'>;
 * // { a: string; b?: never; c: boolean } | { a?: never; b: number; c: boolean }
 */
export type RequireExactlyOne< T, K extends keyof T = keyof T > = {
    [ P in K ]: Required< Pick< T, P > > &
        Partial< Record< Exclude< K, P >, never > > &
        Omit< T, K >;
}[ K ];

/**
 * Require at least one property from a set of properties
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireAtLeastOne<Test, 'a' | 'b'>;
 */
export type RequireAtLeastOne< T, K extends keyof T = keyof T > = Pick< T, Exclude< keyof T, K > > & {
    [ P in K ]: Required< Pick< T, P > > & Partial< Pick< T, Exclude< K, P > > >;
}[ K ];

/**
 * Create a strict subset of an object type with required and optional properties
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserSubset = StrictSubset<User, 'id', 'email' | 'phone'>;
 * // { id: number; email?: string; phone?: string }
 */
export type StrictSubset< T extends object, R extends keyof T, O extends keyof T > =
    RequireFrom< T, R > & ExtractFrom< T, O >;
