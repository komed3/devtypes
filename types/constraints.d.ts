/**
 * Constraint Types
 * 
 * Utility types for enforcing structural constraints on object types,
 * including required/optional properties and mutually exclusive fields.
 * 
 * @module types/constraints
 * @since 1.0.0
 */

/**
 * Extract the keys of optional properties.
 * 
 * @remarks
 * Identifies properties that are optional in the object type, including
 * properties whose value type explicitly allows `undefined`.
 * 
 * @template T - Object type to analyze
 * 
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type OptKeys = OptionalKeys< Obj >;
 * // "b" | "c"
 */
export type OptionalKeys< T > =
    { [ K in keyof T ]-?: {} extends Pick< T, K > ? K : never }[ keyof T ];

/**
 * Extract the keys of required properties.
 * 
 * @remarks
 * Identifies properties that must be present and do not allow `undefined`.
 * 
 * @template T - Object type to analyze
 * 
 * @example
 * type Obj = { a: number; b?: string; c: number | undefined; d: boolean };
 * type ReqKeys = RequiredKeys< Obj >;
 * // "a" | "d"
 */
export type RequiredKeys< T > =
    { [ K in keyof T ]-?: {} extends Pick< T, K > ? never : K }[ keyof T ];

/**
 * Extract specific properties as optional.
 * 
 * @remarks
 * Creates a new object type containing only the selected keys, all marked
 * as optional regardless of their original required state.
 * 
 * @template T - Source object type
 * @template K - Keys to extract
 * 
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type Contact = ExtractFrom< User, 'email' | 'phone' >;
 * // { email?: string; phone?: string }
 */
export type ExtractFrom< T, K extends keyof T > = Partial< Pick< T, K > >;

/**
 * Extract specific properties as required.
 * 
 * @remarks
 * Creates a new object type containing only the selected keys, all marked
 * as required regardless of their original optional state.
 * 
 * @template T - Source object type
 * @template K - Keys to require
 * 
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserID = RequireFrom< User, 'id' >;
 * // { id: number }
 */
export type RequireFrom< T, K extends keyof T > = Required< Pick< T, K > >;

/**
 * Require exactly one property from a set.
 * 
 * @remarks
 * Produces a union of object variants where exactly one of the specified
 * properties is present and all others are explicitly disallowed.
 * 
 * @template T - Source object type
 * @template K - Keys where exactly one must be present (defaults to all keys)
 * 
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireExactlyOne< Test, 'a' | 'b' >;
 * // { a: string; b?: never; c: boolean } | { a?: never; b: number; c: boolean }
 */
export type RequireExactlyOne< T, K extends keyof T = keyof T > =
    { [ P in K ]:
        Required< Pick< T, P > > &
        Partial< Record< Exclude< K, P >, never > > &
        Omit< T, K >;
    }[ K ];

/**
 * Require at least one property from a set.
 * 
 * @remarks
 * Produces a union of object variants where at least one of the specified
 * properties must be present.
 * 
 * @template T - Source object type
 * @template K - Keys where at least one must be present (defaults to all keys)
 * 
 * @example
 * type Test = { a?: string; b?: number; };
 * type Result = RequireAtLeastOne< Test, 'a' | 'b' >;
 * // { a: string; b?: number; } | { a?: string; b: number; } | { a: string; b: number; }
 */
export type RequireAtLeastOne< T, K extends keyof T = keyof T > =
    Pick< T, Exclude< keyof T, K > > &
    { [ P in K ]:
        Required< Pick< T, P > > &
        Partial< Pick< T, Exclude< K, P > > >;
    }[ K ];

/**
 * Require none of the specified properties.
 * 
 * @since 1.1.0
 * @remarks
 * Explicitly disallows a set of properties by forcing them to `never`.
 * Useful for mutually exclusive object shapes.
 * 
 * @template T - Source object type
 * @template K - Keys that must not be present
 * 
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireNone< Test, 'a' | 'b' >;
 * // { c: boolean; a?: never; b?: never; }
 */
export type RequireNone< T, K extends keyof T > =
    Omit< T, K > &
    Partial< Record< K, never > >;

/**
 * Require all or none of a set of properties.
 * 
 * @since 1.1.0
 * @remarks
 * Either all specified properties must be present, or none of them.
 * 
 * @template T - Source object type
 * @template K - Keys participating in the constraint
 * 
 * @example
 * type Test = { a?: string; b?: number; c: boolean };
 * type Result = RequireAllOrNone< Test, 'a' | 'b' >;
 * // { a: string; b: number; c: boolean } | { c: boolean; a?: never; b?: never; }
 */
export type RequireAllOrNone< T, K extends keyof T > =
    | ( T & Required< Pick< T, K > > )
    | RequireNone< T, K >;

/**
 * Make specific properties non-nullable.
 *
 * @since 1.1.0
 * @remarks
 * Removes `null` and `undefined` from the selected property value types.
 *
 * @template T - Source object type
 * @template K - Keys to make non-nullable
 * 
 * @example
 * type User = { id: number | null; name?: string | undefined; email: string | null };
 * type NonNullableUser = NonNullableProps< User, 'id' | 'name' >;
 * // { id: number; name?: string; email: string | null; }
 */
export type NonNullableProps< T, K extends keyof T > =
    Omit< T, K > &
    { [ P in K ]: NonNullable< T[ P ] > };

/**
 * Create a strict object subset.
 *
 * @remarks
 * Builds a new object type consisting only of explicitly required and
 * optional properties. All other properties are excluded.
 *
 * @template T - Source object type
 * @template R - Keys that must be required
 * @template O - Keys that should be optional
 *
 * @example
 * type User = { id: number; name: string; email?: string; phone?: string };
 * type UserSubset = StrictSubset< User, 'id', 'email' | 'phone' >;
 * // { id: number; email?: string; phone?: string }
 */
export type StrictSubset< T extends object, R extends keyof T, O extends keyof T > =
    RequireFrom< T, R > &
    ExtractFrom< T, O >;
