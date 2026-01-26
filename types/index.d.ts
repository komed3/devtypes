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
 * import { Merge } from './types/utils';
 * import { RequireExactlyOne } from './types/constraints';
 * 
 * // Avoid: Importing everything
 * import { Merge, RequireExactlyOne } from './types';
 * ```
 * 
 * @author Paul Köhler (komed3)
 * @version 1.1.0
 * @license MIT
 */

export * from './base';
export * from './classes';
export * from './collections';
export * from './combinators';
export * from './constraints';
export * from './functionals';
export * from './lists';
export * from './primitives';
export * from './utils';
