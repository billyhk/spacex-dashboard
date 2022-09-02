export const countFrequency = (arr: string[]) => {
  var occurrences: { [key: string]: number } = {}
  for (var i = 0, j = arr.length; i < j; i++) {
    occurrences[arr[i]] = (occurrences[arr[i]] || 0) + 1
  }
  return occurrences
}
