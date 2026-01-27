/**
 * Class Types
 * 
 * Utilities for class-based type manipulation, constructor extraction,
 * and property mapping. Will be useful when working with class hierarchies
 * and OOP patterns in TypeScript.
 * 
 * @module devtypes/class
 * @author komed3
 * @license MIT
 */

import type { IfEquals } from './condition';


/**
 * Create a class constructor from instance properties.
 * 
 * @remarks
 * Converts an interface or type into a full constructor signature.
 * Useful for type-level operations where you need to represent class creation.
 * 
 * @template T - The instance type
 * 
 * @example
 * type User = { id: number; name: string };
 * type UserCtor = Constructor< User >;
 * // new ( id: number, name: string ) => User
 */
export type Constructor< T > = { new ( ...args: any[] ) : T };

/**
 * Create an abstract constructor (no instantiation check).
 * 
 * @remarks
 * Represents a class type that cannot be instantiated directly.
 * Commonly used in abstract class hierarchies or for type constraints.
 * 
 * @template T - The instance type
 * 
 * @example
 * type BaseCtor = AbstractConstructor< Base >;
 */
export type AbstractConstructor< T > = abstract new ( ...args: any[] ) => T;

/**
 * Extract constructor parameters as a tuple.
 * 
 * @remarks
 * Retrieves all parameter types from a class constructor.
 * Useful when defining factory functions or dependency injection signatures.
 * 
 * @template C - A constructor function
 * 
 * @example
 * class User { constructor( id: number, name: string ) {} }
 * type CtorParams = ConstructorParameters< typeof User >;
 * // [ id: number, name: string ]
 */
export type ConstructorParameters< C extends Constructor< any > > =
    C extends { new ( ...args: infer P ): any } ? P : never;

/**
 * Extract the instance type from a constructor function.
 * 
 * @remarks
 * Returns the type of objects created by a constructor.
 * This is particularly useful when working with factories or DI patterns.
 * 
 * @template C - A constructor function
 * 
 * @example
 * class User { id: number; name: string; }
 * type UserInstance = InstanceType< typeof User >; // User
 */
export type InstanceType< C extends Constructor< any > > =
    C extends { new ( ...args: any[] ): infer I } ? I : never;

/**
 * Extract method names from a class.
 * 
 * @remarks
 * Returns a union of all callable method names of the class.
 * Does not include readonly or non-function properties.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class Service { getData() {} setData() {} value = 123; }
 * type Methods = MethodNames< Service >; // "getData" | "setData"
 */
export type MethodNames< T > = {
    [ K in keyof T ]-?: T[ K ] extends ( ...args: any[] ) => any ? K : never
}[ keyof T ];

/**
 * Extract method types from a class as an object.
 * 
 * @remarks
 * Produces an object mapping method names to their signatures.
 * Represents the callable interface of the class, similar to its TypeScript interface.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class API { fetch( url: string ) {} post( url: string, data: any ) {} }
 * type Methods = MethodsObject< API >;
 * // { fetch: ( url: string ) => ...; post: ( url: string, data: any ) => ...; }
 */
export type MethodsObject< T > = Pick< T, MethodNames< T > >;

/**
 * Extract readonly property names from a class.
 * 
 * @remarks
 * Returns a union of all readonly properties, excluding methods.
 * Uses {@link IfEquals} to determine whether a property is readonly.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class Config { readonly version = "1.0"; readonly name = "app"; }
 * type ReadonlyProps = ReadonlyPropertyNames< Config >; // "version" | "name"
 */
export type ReadonlyPropertyNames< T > =
    { [ K in keyof T ]-?:
        T[ K ] extends ( ...args: any[] ) => any
            ? never
            : IfEquals< { [ P in K ]: T[ K ] }, { -readonly [ P in K ]: T[ K ] }, never, K >
    }[ keyof T ];

/**
 * Extract readonly properties from a class as an object.
 * 
 * @remarks
 * Produces an object type containing all readonly properties.
 * Useful for creating immutable views or snapshots of a class instance.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class Settings { readonly theme = "dark"; readonly language = "en"; }
 * type ReadonlyPropsObj = ReadonlyPropertiesObject< Settings >;
 * // { theme: string; language: string; }
 */
export type ReadonlyProperties< T > = Pick< T, ReadonlyPropertyNames< T > >;

/**
 * Extract writable (mutable) property names from a class.
 * 
 * @remarks
 * Returns a union of all properties that can be modified.
 * Excludes methods and readonly properties.
 * Complementary to {@link ReadonlyPropertyNames}.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class User { readonly id: number; name: string; }
 * type WritableProps = WritablePropertyNames< User >; // "name"
 */
export type WritablePropertyNames< T > =
    Exclude< keyof T, MethodNames< T > | ReadonlyPropertyNames< T > >;

/**
 * Extract writable (mutable) properties from a class as an object.
 * 
 * @remarks
 * Returns an object type containing all writable properties.
 * Useful for state updates, patches, or builders.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class Profile { readonly id: number; bio: string; avatarUrl: string; }
 * type WritablePropsObj = WritablePropertiesObject< Profile >;
 * // { bio: string; avatarUrl: string; }
 */
export type WritableProperties< T > = Pick< T, WritablePropertyNames< T > >;

/**
 * Create an object with property types extracted from a class.
 * 
 * @remarks
 * Removes all method properties, leaving only fields.
 * Useful for property mapping, validation, or state extraction.
 * 
 * @template T - A class or object type
 * 
 * @example
 * class User { id: number; name: string; email: string; }
 * type UserProperties = PropertyTypes< User >;
 * // { id: number; name: string; email: string; }
 */
export type PropertyTypes< T > = Omit< T, MethodNames< T > >;

/**
 * Extract static properties from a constructor.
 * 
 * @remarks
 * Produces a union of static property names of the constructor.
 * Excludes methods and the built-in `prototype` key.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Config { static readonly version = "1.0"; static readonly debug = false; }
 * type StaticProps = StaticPropertyNames< typeof Config >;
 * // "version" | "debug"
 */
export type StaticPropertyNames< T extends Function > = Exclude< {
    [ K in keyof T ]-?: T[ K ] extends Function ? never : K
}[ keyof T ], 'prototype' >;

/**
 * Extract static properties from a constructor as an object.
 * 
 * @remarks
 * Produces an object type containing all static properties of the class.
 * Useful for reflecting or copying static values.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Settings { static appName = "MyApp"; static maxUsers = 100; }
 * type StaticPropsObj = StaticPropertiesObject< typeof Settings >;
 * // { appName: string; maxUsers: number; }
 */
export type StaticProperties< T extends Function > = Pick< T, StaticPropertyNames< T > >;

/**
 * Extract static methods from a constructor.
 * 
 * @remarks
 * Returns a union of all static method names of the class.
 * Useful for creating type-safe wrappers or proxies.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Utils { static create() {} static format() {} }
 * type StaticMethods = StaticMethodNames< typeof Utils >; // "create" | "format"
 */
export type StaticMethodNames< T extends Function > = {
    [ K in keyof T ]-?: T[ K ] extends Function ? K : never
}[ keyof T ];

/**
 * Extract static methods from a constructor as an object.
 * 
 * @remarks
 * Produces an object type containing all static methods.
 * Useful for creating facades, type-safe proxies, or mocks.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Helpers { static parse() {} static stringify() {} }
 * type StaticMethodsObj = StaticMethodsObject< typeof Helpers >;
 * // { parse: () => ...; stringify: () => ...; }
 */
export type StaticMethods< T extends Function > = Pick< T, StaticMethodNames< T > >;

/**
 * Make all properties of a class optional for partial construction.
 * 
 * @remarks
 * Useful for factory functions, builder patterns, or when only a subset of properties
 * needs to be provided at initialization.
 * 
 * @template T - The class type
 * 
 * @example
 * class User { id: number; name: string; email: string; }
 * type PartialUser = PartialClass< User >;
 * // { id?: number; name?: string; email?: string; }
 */
export type PartialClass< T > = Partial< Omit< T, MethodNames< T > > >;
