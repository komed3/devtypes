/**
 * Utility Types
 * 
 * Common utilities for object transformation, key filtering, and type manipulation.
 * 
 * @module types/utils
 * @since 1.0.0
 */

/**
 * Extract keys of an object whose values match a type.
 * 
 * @remarks
 * Filters object keys based on their value type.
 * Useful for mapping or picking properties programmatically.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumKeys = KeysByValue< Obj, number >; // "a" | "c"
 */
export type KeysByValue< T, V > = {
    [ K in keyof T ]-?: T[ K ] extends V ? K : never
}[ keyof T ];

/**
 * Pick properties by their value type.
 * 
 * @remarks
 * Creates a new type containing only properties whose values match the specified type.
 * Useful for extracting numeric, string, or other specific property subsets.
 * 
 * @template T - The object type to filter
 * @template V - The value type to match
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NumProps = PickByValue< Obj, number >; // { a: number; c: number }
 */
export type PickByValue< T, V > = Pick< T, KeysByValue< T, V > >;

/**
 * Omit properties by their value type.
 * 
 * @remarks
 * Creates a new type excluding properties whose values match the specified type.
 * Useful for removing certain types from object types in type-level transformations.
 * 
 * @template T - The object type to filter
 * @template V - The value type to exclude
 * 
 * @example
 * type Obj = { a: number; b: string; c: number; d: boolean };
 * type NonNumProps = OmitByValue< Obj, number >; // { b: string; d: boolean }
 */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;

/**
 * Expand object type for better IntelliSense display.
 * 
 * @remarks
 * Flattens intersection types for clearer hover and auto-completion.
 * Does not change the type but improves editor readability.
 * 
 * @template T - The type to expand
 * 
 * @example
 * type Nested = { a: { b: { c: number } } };
 * type Expanded = Expand< Nested >; // { a: { b: { c: number } } }
 */
export type Expand< T > = T extends object ? { [ K in keyof T ]: T[ K ] } & {} : T;

/**
 * Flatten array type for better IntelliSense display.
 * 
 * @remarks
 * Improves readability of array types in hover information.
 * Useful when working with deeply nested arrays or tuple types.
 * 
 * @template T - The type to flatten
 * 
 * @example
 * type Arr = Array< { a: number } >;
 * type FlatArr = Flatten< Arr >; // { a: number }[]
 */
export type Flatten< T > = T extends any[] ? { [ K in keyof T ]: T[ K ] } : T;

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

/**
 * Pick specific members from a union by type.
 * 
 * @since 1.1.0
 * @remarks
 * Extracts only the union members that extend a given type.
 * Useful for filtering union types without modifying the original type.
 * 
 * @template U - A union type
 * @template T - The type to match union members against
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionPick< U, string | number >; // string | number
 */
export type UnionPick< U, T > = U extends T ? U : never;

/**
 * Omit specific members from a union by type.
 * 
 * @since 1.1.0
 * @remarks
 * Excludes union members that extend a given type.
 * Complementary to {@link UnionPick}, useful for narrowing unions.
 * 
 * @template U - A union type
 * @template T - The type to exclude from the union
 * 
 * @example
 * type U = string | number | boolean | null;
 * type Filtered = UnionOmit< U, string | null >; // number | boolean
 */
export type UnionOmit< U, T > = U extends T ? never : U;

/**
 * Pick properties with `never` value type.
 * 
 * @since 1.1.0
 * @remarks
 * Extracts placeholder or impossible properties from a type.
 * Useful for discriminated unions or type-level validation.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = PickNever< Obj >; // { b: never; d: never }
 */
export type PickNever< T > = Pick< T, {
    [ K in keyof T ]-?: T[ K ] extends never ? K : never
}[ keyof T ] >;

/**
 * Omit properties with `never` value type.
 * 
 * @since 1.1.0
 * @remarks
 * Removes placeholder or impossible properties from a type.
 * Often used to clean up intermediate mapped types.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = OmitNever< Obj >; // { a: string; c: number }
 */
export type OmitNever< T > = Omit< T, {
    [ K in keyof T ]-?: T[ K ] extends never ? K : never
}[ keyof T ] >;

/**
 * Test if an object has a specific property.
 * 
 * @since 1.1.0
 * @remarks
 * Distinguishes between properties that are missing vs. undefined.
 * Useful for generic type checks in mapped or conditional types.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number };
 * type Has_a = HasProperty< Obj, 'a' >; // true
 * type Has_c = HasProperty< Obj, 'c' >; // false
 */
export type HasProperty< T, K extends PropertyKey > = K extends keyof T ? true : false;

/**
 * Test if an object has an optional property.
 * 
 * @since 1.1.0
 * @remarks
 * Returns `true` only for properties declared with `?`.
 * Does not consider union types that include undefined.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsOpt_b = HasOptionalProperty< Obj, 'b' >; // true
 * type IsOpt_c = HasOptionalProperty< Obj, 'c' >; // false
 */
export type HasOptionalProperty< T, K extends PropertyKey > =
    K extends keyof T ? {} extends Pick< T, K > ? true : false : false;

/**
 * Test if an object has a required property.
 * 
 * @since 1.1.0
 * @remarks
 * Returns `true` for properties that cannot be undefined.
 * Complementary to {@link HasOptionalProperty}.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsReq_a = HasRequiredProperty< Obj, 'a' >; // true
 * type IsReq_b = HasRequiredProperty< Obj, 'b' >; // false
 */
export type HasRequiredProperty< T, K extends PropertyKey > =
    K extends keyof T ? {} extends Pick< T, K > ? false : true : false;

/**
 * Make a specific property readonly.
 * 
 * @since 1.1.0
 * @remarks
 * Marks only one property as readonly while keeping all others mutable.
 * Useful for enforcing immutability at the type level.
 * 
 * @template T - The object type
 * @template K - The key of the property to make readonly
 * 
 * @example
 * type Obj = { a: string; b: number };
 * type Result = ReadonlyProperty< Obj, 'a' >; // { readonly a: string; b: number }
 */
export type ReadonlyProperty< T, K extends keyof T > =
    Omit< T, K > & Readonly< Pick< T, K > >;

/**
 * Make a specific property mutable (remove readonly).
 * 
 * @since 1.1.0
 * @remarks
 * Removes the readonly modifier from a single property while leaving others unchanged.
 * Useful for controlled mutability in type-level object transformations.
 * 
 * @template T - The object type
 * @template K - The key of the property to make mutable
 * 
 * @example
 * type Obj = { readonly a: string; readonly b: number };
 * type Result = MutableProperty< Obj, 'a' >; // { a: string; readonly b: number }
 */
export type MutableProperty< T, K extends keyof T > =
    Omit< T, K > & { -readonly [ P in K ]: T[ P ] };
