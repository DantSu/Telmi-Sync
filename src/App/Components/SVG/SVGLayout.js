import {useLayoutEffect, useRef} from 'react'

function SVGLayout({children}) {
  const svgRef = useRef(null)

  useLayoutEffect(
    () => {
      const bbox = svgRef.current.getBBox()
      svgRef.current.setAttribute("width", bbox.x + bbox.width + 100)
      svgRef.current.setAttribute("height", bbox.y + bbox.height + 100)
    },
    [children]
  )

  return <svg ref={svgRef}>{children}</svg>
}

export default SVGLayout