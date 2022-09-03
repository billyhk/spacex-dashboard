type NestedStringArray = any[]

/**
 * Recursively flatten array of arbitrarily nested arrays of Strings into a flat array of Strings.
 *
 * @typedef {(string|NestedStringArray)[]} NestedStringArray
 * @param {NestedStringArray} arr
 * @return {String[]}
 *
 */

export const flattenStrArray = (arr: NestedStringArray): string[] => {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenStrArray(val) : val),
    []
  ) as string[]
}
