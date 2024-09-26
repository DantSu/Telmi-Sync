import {useCallback} from 'react'

function SVGLayout({observer, scale, children, marginRight, marginBottom}) {
  const callback = useCallback(
    (el) => {
      if (el !== null) {
        const
          bbox = el.getBBox(),
          width = bbox.x + bbox.width + marginRight,
          height = bbox.y + bbox.height + marginBottom
        el.setAttribute('width', (width * (scale || 1)) + 'px')
        el.setAttribute('height', (height * (scale || 1)) + 'px')
        el.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
      }
    },
    [marginRight, marginBottom, scale, observer]
  )
  return <svg ref={callback}>{children}</svg>
}

export default SVGLayout