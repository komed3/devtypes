/**
 * Constraint Types
 * Types for enforcing specific requirements on object properties and structure validation.
 * 
 * @module types/constraints
 */

/**
 * Extract the keys of properties that are optional
 * Identifies properties that have undefined in their value type.
 * 
 * @template T - The object type to analyze
 * 
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type OptKeys = OptionalKeys< Obj >; // "b" | "c"
 */
export type OptionalKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? K : never }[ keyof T ];

/**
 * Extract the keys of properties that are required
 * Identifies properties that do not have undefined in their value type.
 * 
 * @template T - The object type to analyze
 * 
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type ReqKeys = RequiredKeys< Obj >; // "a" | "d"
 */
export type RequiredKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? never : K }[ keyof T ];

/**
 * Extract specific properties as a partial type
 * Creates an optional subset of the target object properties.
 * 
 * @template T - The object type
 * @template K - The keys to extract as optional
 * 
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type Contact = ExtractFrom< User, 'email' | 'phone' >;
 * // { email?: string; phone?: string }
 */
export type ExtractFrom< T, K extends keyof T > = Partial< Pick< T, K > >;

/**
 * Require specific properties (make them required)
 * Creates a required subset of the target object properties.
 * 
 * @template T - The object type
 * @template K - The keys to require
 * 
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserID = RequireFrom< User, 'id' >;
 * // { id: number }
 */
export type RequireFrom< T, K extends keyof T > = Required< Pick< T, K > >;

/**
 * Require exactly one property from a set
 * Creates a union of types where each variant has exactly one of the specified properties required.
 * 
 * @template T - The object type
 * @template K - The keys where exactly one must be required (defaults to all keys)
 * 
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireExactlyOne< Test, 'a' | 'b' >;
 * // { a: string; b?: never; c: boolean } | { a?: never; b: number; c: boolean }
 */
export type RequireExactlyOne< T, K extends keyof T = keyof T > = {
    [ P in K ]: Required< Pick< T, P > > &
        Partial< Record< Exclude< K, P >, never > > &
        Omit< T, K >;
}[ K ];

/**
 * Require at least one property from a set
 * Creates a union of types where each variant has at least one of the specified properties required.
 * 
 * @template T - The object type
 * @template K - The keys where at least one must be required (defaults to all keys)
 * 
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireAtLeastOne< Test, 'a' | 'b' >;
 */
export type RequireAtLeastOne< T, K extends keyof T = keyof T > = Pick< T, Exclude< keyof T, K > > & {
    [ P in K ]: Required< Pick< T, P > > & Partial< Pick< T, Exclude< K, P > > >;
}[ K ];

/**
 * Create a strict object subset with required and optional properties
 * Builds a type with specified required and optional properties from the target.
 * 
 * @template T - The object type
 * @template R - The keys that must be required
 * @template O - The keys that should be optional
 * 
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserSubset = StrictSubset< User, 'id', 'email' | 'phone' >;
 * // { id: number; email?: string; phone?: string }
 */
export type StrictSubset< T extends object, R extends keyof T, O extends keyof T > =
    RequireFrom< T, R > & ExtractFrom< T, O >;
