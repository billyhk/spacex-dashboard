type NestedIntegerArray = any[]

/**
 * Recursively flatten array of arbitrarily nested arrays of integers into a flat array of integers.
 *
 * @typedef {(number|NestedIntegerArray)[]} NestedIntegerArray
 * @param {NestedIntegerArray} arr
 * @return {number[]}
 *
 */

export const flattenIntArray = (arr: NestedIntegerArray): number[] => {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenIntArray(val) : val),
    []
  ) as number[]
}
