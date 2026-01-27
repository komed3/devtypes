/**
 * Functional Types
 * 
 * Higher-order type utilities for function manipulation, currying, composition,
 * and promise handling.
 * 
 * Includes additional utilities for parameter and this-type extraction.
 * 
 * @module devtypes/function
 * @author komed3
 * @license MIT
 */

/**
 * Curry a function type.
 * 
 * @remarks
 * Transforms a multi-argument function into a sequence of unary functions.
 * Used for functional programming patterns.
 * 
 * @template F - Function type to curry
 * 
 * @example
 * type Fn = ( a: string, b: number, c: boolean ) => void;
 * type CurriedFn = Curry< Fn >;
 * // ( a: string ) => ( b: number ) => ( c: boolean ) => void
 */
export type Curry< F > =
    F extends ( ...args: infer Args ) => infer R
        ? Args extends [ infer A, ...infer Rest ]
            ? ( a: A ) => Curry< ( ...args: Rest ) => R >
            : R
        : never;

/**
 * Compose two functions.
 * 
 * @remarks
 * Creates a new function that applies F then G with proper type chaining.
 * If types mismatch, the result is `never`.
 * 
 * @template F - First function type
 * @template G - Second function type
 * 
 * @example
 * type F = ( x: number ) => string;
 * type G = ( y: string ) => boolean;
 * type Composed = Compose< F, G >;
 * // ( arg: number ) => boolean
 */
export type Compose< F extends ( arg: any ) => any, G extends ( arg: any ) => any > =
    Parameters< G >[ 0 ] extends ReturnType< F >
        ? ( arg: Parameters< F >[ 0 ] ) => ReturnType< G >
        : never;

/**
 * Compose multiple functions in sequence.
 * 
 * @remarks
 * Chains several functions together, ensuring type compatibility.
 * The output of each function must match the input of the next.
 * Used {@link Compose} recursively.
 * 
 * @template Fns - Array of function types to compose
 * 
 * @example
 * type F1 = ( x: number ) => string;
 * type F2 = ( y: string ) => boolean;
 * type F3 = ( z: boolean ) => Date;
 * type ComposedMany = ComposeMany< [ F1, F2, F3 ] >; // ( arg: number ) => Date
 */
export type ComposeMany< Fns extends Array< ( ...args: any[] ) => any > > =
    Fns extends [ infer F, infer G, ...infer Rest ]
        ? F extends ( ...args: any[] ) => any
            ? G extends ( ...args: any[] ) => any
                ? ComposeMany< [
                    Compose< F, G >,
                    ...Extract< Rest, ( ( ...args: any[] ) => any )[] >
                ] >
                : never
            : never
        : Fns extends [ infer F ] ? F : never;

/**
 * Promisify a function type.
 * 
 * @remarks
 * Wraps a function's return type in a Promise, preserving argument types.
 * Will result in `never` if input is not a function.
 * 
 * @template F - Function type to promisify
 * 
 * @example
 * type Fn = ( a: string, b: number ) => boolean;
 * type PromisifiedFn = Promisify< Fn >;
 * // ( a: string, b: number ) => Promise< boolean >
 */
export type Promisify< F > =
    F extends ( ...args: infer A ) => infer R
        ? ( ...args: A ) => Promise< R >
        : never;

/**
 * Unwrap a Promise type.
 * 
 * @remarks
 * Extracts the resolved value type of a Promise. Returns type as-is if not a Promise.
 * 
 * @template T - Type to unwrap
 * 
 * @example
 * type P = Promise< string >;
 * type U = UnwrapPromise< P >; // string
 */
export type UnwrapPromise< T > = T extends Promise< infer U > ? U : T;

/**
 * Get the awaited return type of a function.
 * 
 * @remarks
 * Combines return type extraction with automatic Promise unwrapping.
 * It's come in handy when dealing with async functions.
 * 
 * @template F - Function type
 * 
 * @example
 * type F1 = () => string;
 * type R1 = AwaitedReturnType< F1 >; // string
 * type F2 = () => Promise< number >;
 * type R2 = AwaitedReturnType< F2 >; // number
 */
export type AwaitedReturnType< F > =
    F extends ( ...args: any[] ) => infer R
        ? R extends Promise< infer U >
            ? U
            : R
        : never;

/**
 * Extract parameter types from a function.
 * 
 * @remarks
 * Retrieves all parameter types as a tuple in declaration order.
 * 
 * @template F - Function type to extract from
 * 
 * @example
 * type Fn = ( a: string, b: number, c: boolean ) => void;
 * type Params = Parameters< Fn >; // [ string, number, boolean ]
 */
export type Parameters< F extends Function > = F extends ( ...args: infer P ) => any ? P : never;

/**
 * Extract parameter types from a curried function.
 * 
 * @remarks
 * Builds a tuple of all parameter types from a curried function recursively.
 * Used for type-level analysis of curried signatures.
 * 
 * @template F - Curried function type
 * 
 * @example
 * type CurriedFn = ( a: string ) => ( b: number ) => ( c: boolean ) => void;
 * type Params = CurriedParameters< CurriedFn >;
 * // [ string, number, boolean ]
 */
export type CurriedParameters< F > =
    F extends ( a: infer A ) => infer R ? [ A, ...CurriedParameters< R > ] : [];

/**
 * Get the this binding type from a function.
 * 
 * @remarks
 * Extracts the `this` context type if present, or `unknown` if absent.
 * 
 * @template F - Function type
 * 
 * @example
 * type Fn = ( this: { x: number }, y: string ) => void;
 * type ThisType = ThisParameterType< Fn >; // { x: number }
 */
export type ThisParameterType< F extends Function > =
    F extends ( this: infer T, ...args: any[] ) => any ? T : unknown;

/**
 * Remove the `this` parameter from a function.
 * 
 * @remarks
 * Produces a new function type without the this binding.
 * 
 * @template F - Function type to modify
 * 
 * @example
 * type Fn = ( this: { x: number }, y: string ) => void;
 * type WithoutThis = OmitThisParameter< Fn >; // ( y: string ) => void
 */
export type OmitThisParameter< F extends Function > =
    F extends ( this: any, ...args: infer A ) => infer R ? ( ...args: A ) => R : F;
