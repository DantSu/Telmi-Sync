const
  printf = (string, ...args) => {
    if (!Array.isArray(args) || !args.length) {
      return string
    }
    return string.replace(/{(\d+)}/g, (match, number) => args[number] !== undefined ? args[number] : match)
  }

export { printf }
