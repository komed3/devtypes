/**
 * Class Types
 * Utilities for class-based type manipulation and constructor-related operations.
 * 
 * @module types/classes
 */

/**
 * Extract the instance type from a constructor function
 * Gets the type of objects created by a constructor.
 * 
 * @template C - A constructor function
 * 
 * @example
 * class User { id: number; name: string; }
 * type UserInstance = InstanceType< typeof User >; // User
 */
export type InstanceType< C extends { new ( ...args: any[] ): any } > = C extends
    { new ( ...args: any[] ): infer I } ? I : never;

/**
 * Create a class constructor from instance properties
 * Converts an interface/type to a constructor signature.
 * 
 * @template T - The instance type
 * 
 * @example
 * type User = { id: number; name: string };
 * type UserCtor = Constructor< User >;
 * // new ( id: number, name: string ) => User
 */
export type Constructor< T > = { new ( ...args: any[] ): T };

/**
 * Create a abstract constructor (no instantiation check)
 * Used for class hierarchies and type constraints.
 * 
 * @template T - The instance type
 * 
 * @example
 * type BaseCtor = AbstractConstructor< Base >;
 */
export type AbstractConstructor< T > = abstract new ( ...args: any[] ) => T;

/**
 * Extract constructor parameters as a tuple
 * Retrieves all parameter types from a class constructor.
 * 
 * @template C - A constructor function
 * 
 * @example
 * class User { constructor( id: number, name: string ) {} }
 * type CtorParams = ConstructorParameters< typeof User >;
 * // [ id: number, name: string ]
 */
export type ConstructorParameters< C extends { new ( ...args: any[] ): any } > = C extends
    { new ( ...args: infer P ): any } ? P : never;

/**
 * Extract method names from a class
 * Returns a union of all method names (excluding readonly properties).
 * 
 * @template T - A class or object type
 * 
 * @example
 * class Service { getData() {} setData() {} value = 123; }
 * type Methods = MethodNames< Service >; // "getData" | "setData"
 */
export type MethodNames< T > = { [ K in keyof T ]-?: T[ K ] extends ( ...args: any[] ) => any ? K : never }[ keyof T ];

/**
 * Extract method types from a class as an object
 * Creates a record of all method signatures.
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
 * Create an object with property types extracted from a class
 * Useful for state management and property mapping.
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
 * Make all properties of a class optional for partial construction
 * Useful for factory functions and builder patterns.
 * 
 * @template T - The class type
 * 
 * @example
 * class User { id: number; name: string; email: string; }
 * type PartialUser = PartialClass< User >;
 * // { id?: number; name?: string; email?: string; }
 */
export type PartialClass< T > = Partial< Omit< T, MethodNames< T > > >;

/**
 * Extract static properties from a constructor
 * Returns types of static members.
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
 * Extract static properties from a constructor as an object
 * Returns an object type of all static properties.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Settings { static appName = "MyApp"; static maxUsers = 100; }
 * type StaticPropsObj = StaticPropertiesObject< typeof Settings >;
 * // { appName: string; maxUsers: number; }
 */
export type StaticPropertiesObject< T extends Function > = Pick< T, StaticPropertyNames< T > >;

/**
 * Extract static methods from a constructor
 * Returns names of all static methods.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Utils { static create() {} static format() {} }
 * type StaticMethods = StaticMethodNames< typeof Utils >; // "create" | "format"
 */
export type StaticMethodNames< T extends Function > = { [ K in keyof T ]-?: T[ K ] extends Function ? K : never }[ keyof T ];

/**
 * Extract static methods from a constructor as an object
 * Returns an object type of all static methods.
 * 
 * @template T - A constructor function
 * 
 * @example
 * class Helpers { static parse() {} static stringify() {} }
 * type StaticMethodsObj = StaticMethodsObject< typeof Helpers >;
 * // { parse: () => ...; stringify: () => ...; }
 */
export type StaticMethodsObject< T extends Function > = Pick< T, StaticMethodNames< T > >;
