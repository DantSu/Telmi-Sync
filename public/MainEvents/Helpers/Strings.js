const
  stringNormalizeFileName = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\-.]+/g, ' ')
  },
  stringSlugify = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  },
  stripHtmlTags = (html) => {
    let cursorPos = 0, inTag = false
    while (true) {
      const
        nextQuote = html.indexOf('"', cursorPos),
        nextOpenTag = html.indexOf('<', cursorPos),
        nextCloseTag = html.indexOf('>', cursorPos)

      if (nextQuote === -1 || nextOpenTag === -1 || nextCloseTag === -1) {
        break
      }

      if ((inTag || nextQuote > nextOpenTag) && nextQuote < nextCloseTag) {
        const nextQuote2 = html.indexOf('"', nextQuote + 1)
        if (nextQuote2 === -1) {
          break
        }
        cursorPos = nextQuote2 + 1
        html = html.slice(0, nextQuote) + html.slice(cursorPos)
        cursorPos -= cursorPos - nextQuote
        inTag = true
      } else {
        cursorPos = nextCloseTag + 1
        inTag = false
      }
    }
    return html.replaceAll(/<\/p>|<br>|<br\/>|<br \/>/g, '\n').replaceAll(/<[^>]+>/g, '').replaceAll('&nbsp;', ' ')
  }

export { stringSlugify, stringNormalizeFileName, stripHtmlTags }
