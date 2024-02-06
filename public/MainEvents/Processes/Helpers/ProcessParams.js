function getProcessParams () {
  const tag = '[electron]', tagLength = tag.length
  return process.argv.filter(v => v.substring(0, tagLength) === tag).map(v => v.substring(tagLength))
}

export { getProcessParams }
