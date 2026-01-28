/**
 * Object-like Types
 * 
 * Types and utilities for working with object-like structures, including
 * plain objects, arrays, maps, sets, and other complex structures.
 * 
 * @module devtypes/object
 * @author komed3
 * @license MIT
 */


/**
 * Generic plain object type.
 * 
 * @remarks
 * Represents an object with string, number, or symbol keys and any value types.
 * Useful as a base type for object manipulations and transformations.
 * 
 * @example
 * type Obj = PlainObject;
 * // Record< string | number | symbol, any >
 */
export type PlainObject = Record< string | number | symbol, any >;

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
 * type NumKeys = KeysByValue< Obj, number >;  // "a" | "c"
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
 * type NumProps = PickByValue< Obj, number >;  // { a: number; c: number }
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
 * type NonNumProps = OmitByValue< Obj, number >;  // { b: string; d: boolean }
 */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;

/**
 * Pick properties with `never` value type.
 * 
 * @remarks
 * Extracts placeholder or impossible properties from a type.
 * Useful for discriminated unions or type-level validation.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = PickNever< Obj >;  // { b: never; d: never }
 */
export type PickNever< T > = Pick< T, {
    [ K in keyof T ]-?: T[ K ] extends never ? K : never
}[ keyof T ] >;

/**
 * Omit properties with `never` value type.
 * 
 * @remarks
 * Removes placeholder or impossible properties from a type.
 * Often used to clean up intermediate mapped types.
 * 
 * @template T - The object type to filter
 * 
 * @example
 * type Obj = { a: string; b: never; c: number; d: never };
 * type Result = OmitNever< Obj >;  // { a: string; c: number }
 */
export type OmitNever< T > = Omit< T, {
    [ K in keyof T ]-?: T[ K ] extends never ? K : never
}[ keyof T ] >;

/**
 * Test if an object has a specific property.
 * 
 * @remarks
 * Distinguishes between properties that are missing vs. undefined.
 * Useful for generic type checks in mapped or conditional types.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number };
 * type Has_a = HasProperty< Obj, 'a' >;  // true
 * type Has_c = HasProperty< Obj, 'c' >;  // false
 */
export type HasProperty< T, K extends PropertyKey > = K extends keyof T ? true : false;

/**
 * Test if an object has an optional property.
 * 
 * @remarks
 * Returns `true` only for properties declared with `?`.
 * Does not consider union types that include undefined.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsOpt_b = HasOptionalProperty< Obj, 'b' >;  // true
 * type IsOpt_c = HasOptionalProperty< Obj, 'c' >;  // false
 */
export type HasOptionalProperty< T, K extends PropertyKey > =
    K extends keyof T ? {} extends Pick< T, K > ? true : false : false;

/**
 * Test if an object has a required property.
 * 
 * @remarks
 * Returns `true` for properties that cannot be undefined.
 * Complementary to {@link HasOptionalProperty}.
 * 
 * @template T - The object type
 * @template K - The property key to check
 * 
 * @example
 * type Obj = { a: string; b?: number; c: number | undefined };
 * type IsReq_a = HasRequiredProperty< Obj, 'a' >;  // true
 * type IsReq_b = HasRequiredProperty< Obj, 'b' >;  // false
 */
export type HasRequiredProperty< T, K extends PropertyKey > =
    K extends keyof T ? {} extends Pick< T, K > ? false : true : false;

/**
 * Make a specific property readonly.
 * 
 * @remarks
 * Marks only one property as readonly while keeping all others mutable.
 * Useful for enforcing immutability at the type level.
 * 
 * @template T - The object type
 * @template K - The key of the property to make readonly
 * 
 * @example
 * type Obj = { a: string; b: number };
 * type Result = ReadonlyProperty< Obj, 'a' >;
 * // { readonly a: string; b: number }
 */
export type ReadonlyProperty< T, K extends keyof T > =
    Omit< T, K > & Readonly< Pick< T, K > >;

/**
 * Make a specific property mutable (remove readonly).
 * 
 * @remarks
 * Removes the readonly modifier from a single property while leaving others unchanged.
 * Useful for controlled mutability in type-level object transformations.
 * 
 * @template T - The object type
 * @template K - The key of the property to make mutable
 * 
 * @example
 * type Obj = { readonly a: string; readonly b: number };
 * type Result = MutableProperty< Obj, 'a' >;
 * // { a: string; readonly b: number }
 */
export type MutableProperty< T, K extends keyof T > =
    Omit< T, K > & { -readonly [ P in K ]: T[ P ] };

/**
 * Build all nested property paths using dot notation.
 * 
 * @remarks
 * Generates a union of valid access paths up to a configurable recursion
 * depth. Path order is not guaranteed.
 * 
 * @template T - Object type to analyze
 * @template D - Maximum recursion depth (defaults to 5)
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type Paths = Paths< User >;
 * // "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"
 */
export type Paths< T, D extends number = 5 > = [ D ] extends [ never ]
    ? never : T extends object
        ? { [ K in keyof T ]-?: K extends string | number
            ? T[ K ] extends readonly any[]
                ? K : T[ K ] extends object
                    ? K | Join< K, Paths< T[ K ], Prev[ D ] > > : K
            : never }[ keyof T ]
        : '';

/** @internal */
type Join< K, P > = K extends string | number
    ? P extends string | number
        ? `${ K & ( string | number ) }.${ P & ( string | number ) }`
        : never
    : never;

/** @internal */
type Prev = [ never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

/**
 * Resolve the value type at a given property path.
 * 
 * @remarks
 * Supports dot-separated paths and resolves deeply nested property types.
 * Returns `never` for invalid paths.
 * 
 * @template T - Object type to traverse
 * @template P - Dot-separated property path
 * 
 * @example
 * type User = { id: number; profile: { name: string; address: { city: string } } };
 * type City = PathValue< User, "profile.address.city" >;  // string
 */
export type PathValue< T, P extends string > = P extends `${ infer K }.${ infer Rest }`
    ? K extends keyof T ? PathValue< T[ K ], Rest > : never
    : P extends keyof T ? T[ P ] : never;

/**
 * Nest an object with set strings recursively
 * 
 * @remarks 
 * 
 * This is useful to reduce boilerplate while having a strong
 * type safety.
 * 
 * Note that if no keys are provided, this turns into <K,T> => T
 * @param K - A list of string template
 * @param T - The type associated with the deepest object's keys
 * 
 * @example
 * type RestaurantMenu = ChainMapped<['night' | 'day', 'entry' | 'main' | 'dessert' ], ()=>void> 
 * type RestaurantMenu = {
 *  night: {
 *    entry: () => void;
 *    main: () => void;
 *    dessert: () => void;
 *  };
 *  day: {
 *      entry: () => void;
 *      main: () => void;
 *      dessert: () => void;
 *  };
 * }
 */

export type ChainMapped<K extends string[], T> = 
    K extends [infer F extends string, ...infer R extends string[]]
        ? { [key in F]: ChainMapped<R, T> }
        : T

/**
 * Constructs an object whose properties keys are Keys and property values are T
 * @remarks
 * This type is like the base utility type Record but Keys are enforced to be strings.
 * Which makes the object safely accessible by string based properties.
 * 
 * This is because object normally are accessible by 'string' | 'number' | 'symbol' types
 * Which makes iterating an Object properties with a string throwing an error.
 * 
 * Also it reduces the amount of boilerplate by not having to create a new type
 * for anything that require a list of properties to be fully implemented
 * with a good code completion support
 * 
 * @param Keys - a string type, likely string template.
 * @param T - Any type that can fit into an object.
 * 
 * @example
 * const isInformationPublic: Mapped<'username' | 'email', boolean> = {
 *     username: true,
 *     email: false
 * };
 */
export type Mapped<Keys extends string, T> = {
    [key in Keys]: T 
}

/**
 * Constructs an object whose properties are optional and which keys are Keys and property values are T
 * 
 * @remarks 
 * Complementary to {@link Mapped}.
 * 
 * @param Keys - a string type, likely string template.
 * @param T - Any type that can fit into an object.
 * 
 * @example
 * const stringValidator: PartiallyMapped<'username' | 'email', (field: string)=>boolean> = {
 *     username: (field: string)=>regex.validate('username', field),
 * };
 */
export type PartiallyMapped<Keys extends string, T> = {
    [key in Keys]?: T 
}