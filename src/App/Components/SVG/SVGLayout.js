import {useCallback, forwardRef} from 'react'

const scrollCompute = (ref, pxWidth, pxHeight) => {
  if (ref.current === null) {
    return [null, null]
  }

  const
    halfClientWidth = ref.current.clientWidth / 2,
    halfClientHeight = ref.current.clientHeight / 2
  return [
    ((ref.current.scrollLeft + halfClientWidth) * pxWidth / ref.current.scrollWidth) - halfClientWidth,
    ((ref.current.scrollTop + halfClientHeight) * pxHeight / ref.current.scrollHeight) - halfClientHeight
  ]
}

function SVGLayout({observer, scale, children, marginRight, marginBottom}, ref) {
  const callback = useCallback(
    (el) => {
      if (el !== null) {
        const
          bbox = el.getBBox(),
          width = bbox.x + bbox.width + marginRight,
          height = bbox.y + bbox.height + marginBottom,
          pxWidth = width * (scale || 1),
          pxHeight = height * (scale || 1),
          newScrollPos = scrollCompute(ref, pxWidth, pxHeight)

        el.setAttribute('width', pxWidth + 'px')
        el.setAttribute('height', pxHeight + 'px')
        el.setAttribute('viewBox', '0 0 ' + width + ' ' + height)

        if (newScrollPos[0] !== null) {
          ref.current.scrollLeft = newScrollPos[0]
          ref.current.scrollTop = newScrollPos[1]
        }
      }
    },
    [marginRight, marginBottom, scale, observer]
  )
  return <svg ref={callback}>{children}</svg>
}

export default forwardRef(SVGLayout)