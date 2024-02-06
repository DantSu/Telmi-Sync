const
  parseInfFile = (str) => {
    return str
      .split('\n')
      .reduce(
        (acc, v) => {
          const a = v.split('=', 2)
          if (a[1] === undefined) {
            return acc
          }
          return {...acc, [a[0]]: a[1]}
        },
        {}
      )
  }

export { parseInfFile }
