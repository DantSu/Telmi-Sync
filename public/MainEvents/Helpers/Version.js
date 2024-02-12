const
  versionStringToObject = (str) => {
    const version = str.trim().split('.').map((v) => parseInt(v, 10))
    return version.length === 3 ? {major: version[0], minor: version[1], fix: version[2]} : null
  },

  isNewerVersion = (a, b) => {
    const
      va = typeof a === 'string' ? versionStringToObject(a) : a,
      vb = typeof b === 'string' ? versionStringToObject(b) : b

    return (
      va.major < vb.major ||
      (va.major === vb.major && va.minor < vb.minor) ||
      (va.major === vb.major && va.minor === vb.minor && va.fix < vb.fix)
    )
  }

export { versionStringToObject, isNewerVersion }
