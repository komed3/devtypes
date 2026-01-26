/**
 * Functional Types
 * Higher-order type utilities for function manipulation and composition.
 * 
 * @module types/functionals
 */

/**
 * Curry a function type
 * Transforms a multi-argument function into a sequence of single-argument functions.
 * 
 * @template F - The function type to curry
 * 
 * @example
 * type Fn = ( a: string, b: number, c: boolean ) => void;
 * type CurriedFn = Curry< Fn >;
 * // ( a: string ) => ( b: number ) => ( c: boolean ) => void
 */
export type Curry< F > = F extends ( ...args: infer Args ) =>
    infer R ? Args extends [ infer A, ...infer Rest ]
        ? ( a: A ) => Curry< ( ...args: Rest ) => R >
        : R : never;

/**
 * Extract parameter types from a curried function
 * Builds a tuple of all parameter types from a curried function.
 * 
 * @template F - A curried function type
 * 
 * @example
 * type CurriedFn = ( a: string ) => ( b: number ) => ( c: boolean ) => void;
 * type Params = CurriedParams< CurriedFn >; // [ string, number, boolean ]
 */
export type CurriedParams< F > = F extends ( a: infer A ) =>
    infer R ? [ A, ...CurriedParams< R > ] : [];

/**
 * Compose two functions: (F → R1) then (G: R1 → ?)
 * Creates a new function that applies F then G with proper type chaining.
 * 
 * @template F - The first function type
 * @template G - The second function type
 * 
 * @example
 * type F = ( x: number ) => string;
 * type G = ( y: string ) => boolean;
 * type Composed = Compose< F, G >; // ( arg: number ) => boolean
 */
export type Compose< F extends Function, G extends Function > = F extends ( arg: any ) =>
    infer R1 ? G extends ( arg: infer A ) => any ? ( arg: A extends R1 ? A : R1 ) => any : never : never;

/**
 * Compose multiple functions in sequence
 * Chains several functions together, ensuring type compatibility.
 * 
 * @template Fns - An array of function types to compose
 * 
 * @example
 * type F1 = ( x: number ) => string;
 * type F2 = ( y: string ) => boolean;
 * type F3 = ( z: boolean ) => Date;
 * type ComposedMany = ComposeMany< [ F1, F2, F3 ] >; // ( arg: number ) => Date
 */
export type ComposeMany< Fns extends Function[] > = Fns extends [ infer F1, infer F2, ...infer Rest ]
    ? ComposeMany< [ Compose< F1 & Function, F2 & Function >, ...Rest & Function[] ] >
    : Fns extends [ infer F ] ? F : never;

/**
 * Promisify a function type
 * Wraps a function's return type in a Promise.
 * 
 * @template F - The function type to promisify
 * 
 * @example
 * type Fn = ( a: string, b: number ) => boolean;
 * type PromisifiedFn = Promisify< Fn >;
 * // ( a: string, b: number ) => Promise< boolean >
 */
export type Promisify< F > = F extends ( ...args: infer A ) =>
    infer R ? ( ...args: A ) => Promise< R > : never;

/**
 * Unwrap a Promise type to get its resolved value
 * Extracts the value type from a Promise or returns the type as-is if not a Promise.
 * 
 * @template T - The type to unwrap
 * 
 * @example
 * type P = Promise< string >;
 * type U = UnwrapPromise< P >; // string
 */
export type UnwrapPromise< T > = T extends Promise< infer U > ? U : T;

/**
 * Get the return type of a function, awaited if it's a Promise
 * Combines return type extraction with automatic Promise unwrapping.
 * 
 * @template F - The function type
 * 
 * @example
 * type F1 = () => string;
 * type R1 = AwaitedReturnType< F1 >; // string
 * type F2 = () => Promise< number >;
 * type R2 = AwaitedReturnType< F2 >; // number
 */
export type AwaitedReturnType< F > = F extends ( ...args: any[] ) =>
    infer R ? R extends Promise< infer U > ? U : R : never;

/**
 * Extract parameter types from a function (as a tuple)
 * Retrieves all parameter types in order.
 * 
 * @template F - The function type to extract from
 * 
 * @example
 * type Fn = ( a: string, b: number, c: boolean ) => void;
 * type Params = Parameters< Fn >; // [ string, number, boolean ]
 */
export type Parameters< F extends Function > = F extends ( ...args: infer P ) =>
    any ? P : never;

/**
 * Get the this binding type from a function
 * Extracts the `this` context type if present.
 * 
 * @template F - The function type
 * 
 * @example
 * type Fn = ( this: { x: number }, y: string ) => void;
 * type ThisType = ThisParameterType< Fn >; // { x: number }
 */
export type ThisParameterType< F extends Function > = F extends ( this: infer T, ...args: any[] ) =>
    any ? T : unknown;

/**
 * Remove the `this` parameter from a function
 * Creates a new function type without the this binding.
 * 
 * @template F - The function type to modify
 * 
 * @example
 * type Fn = ( this: { x: number }, y: string ) => void;
 * type WithoutThis = OmitThisParameter< Fn >; // ( y: string ) => void
 */
export type OmitThisParameter< F extends Function > = F extends ( this: any, ...args: infer A ) =>
    infer R ? ( ...args: A ) => R : F;
