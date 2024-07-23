import {useCallback} from 'react'

function SVGLayout({observer, scale, children}) {
  const callback = useCallback(
    (el) => {
      if (el !== null) {
        const
          bbox = el.getBBox(),
          width = bbox.x + bbox.width + 100,
          height = bbox.y + bbox.height + 100
        el.setAttribute('width', (width * (scale || 1)) + 'px')
        el.setAttribute('height', (height * (scale || 1)) + 'px')
        el.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
      }
    },
    [scale, observer]
  )
  return <svg ref={callback}>{children}</svg>
}

export default SVGLayout