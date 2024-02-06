const
  stringNormalizeFileName = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\-.]+/g, ' ')
  },
  stringSlugify = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

export { stringSlugify, stringNormalizeFileName }
