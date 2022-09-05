/**
 * @param {number[]} arr
 * @returns {number}
 * Returns the average of a set of numbers given an array.
 */
export const getAverage = (arr: (number)[]): number =>
  arr.reduce((sum, num) => sum + num, 0) / arr.length
