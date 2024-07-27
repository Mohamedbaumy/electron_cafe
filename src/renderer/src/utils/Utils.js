export const getUniqueOptions = (options) => {
  const seen = new Set()
  return options.filter((option) => {
    const duplicate = seen.has(option.value)
    seen.add(option.value)
    return !duplicate
  })
}
