/**
 * Functional Types
 * Function-related higher-order type utilities.
 * 
 * @module types/functionals
 */

/**
 * Curry a function type (simple 1-arg recursion)
 * @example
 * type Fn = (a: string, b: number, c: boolean) => void;
 * type CurriedFn = Curry<Fn>; // (a: string) => (b: number) => (c: boolean) => void
 */
export type Curry< F > = F extends ( ...args: infer Args ) =>
    infer R ? Args extends [ infer A, ...infer Rest ]
        ? ( a: A ) => Curry< ( ...args: Rest ) => R >
        : R : never;

/**
 * Build a tuple of the parameter types for a curried function
 * @example
 * type CurriedFn = (a: string) => (b: number) => (c: boolean) => void;
 * type Params = CurriedParams<CurriedFn>; // [string, number, boolean]
 */
export type CurriedParams< F > = F extends ( a: infer A ) =>
    infer R ? [ A, ...CurriedParams< R > ] : [];

/**
 * Compose two functions (R1 -> R2)
 * @example
 * type F = (x: number) => string;
 * type G = (y: string) => boolean;
 * type Composed = Compose<F, G>; // (arg: number) => boolean
 */
export type Compose< F extends Function, G extends Function > = F extends ( arg: any ) =>
    infer R1 ? G extends ( arg: infer A ) => any ? ( arg: A extends R1 ? A : R1 ) => any : never : never;

/**
 * Promisify a function type
 * @example
 * type Fn = (a: string, b: number) => boolean;
 * type PromisifiedFn = Promisify<Fn>; // (a: string, b: number) => Promise<boolean>
 */
export type Promisify< F > = F extends ( ...args: infer A ) =>
    infer R ? ( ...args: A ) => Promise< R > : never;

/**
 * Unwrap a Promise type (built-in Awaited exists in newer TS)
 * @example
 * type P = Promise<string>;
 * type U = UnwrapPromise<P>; // string
 */
export type UnwrapPromise< T > = T extends Promise< infer U > ? U : T;

/**
 * Get the return type of a function, unwrapping Promise if necessary
 * @example
 * type F1 = () => string;
 * type R1 = AwaitedReturnType<F1>; // string
 * type F2 = () => Promise<number>;
 * type R2 = AwaitedReturnType<F2>; // number
 */
export type AwaitedReturnType< F > = F extends ( ...args: any[] ) =>
    infer R ? R extends Promise< infer U > ? U : R : never;
