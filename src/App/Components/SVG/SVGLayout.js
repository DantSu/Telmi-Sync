import {useCallback} from 'react'

function SVGLayout({children}) {
  const callback = useCallback(
    (el) => {
      if (el !== null) {
        const bbox = el.getBBox()
        el.setAttribute("width", bbox.x + bbox.width + 100)
        el.setAttribute("height", bbox.y + bbox.height + 100)
      }
    },
    [children]
  )
  return <svg ref={callback}>{children}</svg>
}

export default SVGLayout