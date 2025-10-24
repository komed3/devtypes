/**
 * Primitive Types
 * Primitive-related helpers and literal utilities.
 * 
 * @module types/primitives
 */

import { IsAny } from './base';

/** Primitive types union */
export type Primitive = string | number | boolean | symbol | null | undefined;

/** Non-primitive */
export type NonPrimitive = object | Function;

/**
 * Create a union type that can be assigned a literal or its base type
 * while maintaining autocomplete for the literal type
 */
export type LiteralUnion< T extends U, U = string > = T | ( U & Record< never, never > );

/** Is a type a literal (approximate): string literal, number literal, boolean literal */
export type IsLiteral< T > = IsAny< T > extends true ? false : (
    string extends T ? false : number extends T ? false : boolean extends T ? false : true
);

/** Convert a union of primitive literals to a union of corresponding boxed types */
export type Box< T > = T extends string ? String
    : T extends number ? Number
    : T extends boolean ? Boolean
    : T extends Symbol ? Symbol
    : T;
