export const getImageSrc = (value) => {
  if (typeof value === 'string') {
    return `app://${value}`
  }
  if (value && typeof value === 'object') {
    if (value.file) {
      return URL.createObjectURL(value.file)
    }
    return URL.createObjectURL(value)
  }
  return null
}
