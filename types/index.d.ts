/**
 * TypeScript Advanced Type Utilities
 * 
 * A comprehensive collection of highly-optimized TypeScript type utilities
 * for building type-safe applications.
 * 
 * Key Features:
 * - Zero runtime overhead (types only)
 * - Modular design for optimal IDE performance
 * - Comprehensive type constraints and transformations
 * - Deep object manipulation utilities
 * - Advanced type-level programming tools
 * 
 * Recommended Usage:
 * Import from specific modules to keep IntelliSense fast:
 * ```ts
 * // Good: Direct module imports
 * import type { Merge } from './types/collections';
 * import type { RequireExactlyOne } from './types/constraints';
 * 
 * // Avoid: Importing everything
 * import type { Merge, RequireExactlyOne } from './types';
 * ```
 * 
 * @author Paul Köhler (komed3)
 * @version 1.1.0
 * @license MIT
 */

export type * from './base';
export type * from './classes';
export type * from './collections';
export type * from './combinators';
export type * from './constraints';
export type * from './functionals';
export type * from './lists';
export type * from './primitives';
export type * from './utils';
