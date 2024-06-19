import {SVG_ANCHOR_LEFT, SVG_ANCHOR_TOP} from './SVGConstants.js'


function SVGHtml({x, y, width, height, anchorX, anchorY, children}) {
  const aX = anchorX || SVG_ANCHOR_LEFT, aY = anchorY || SVG_ANCHOR_TOP
  return <foreignObject x={x - width * aX / 2}
                        y={y - height * aY / 2}
                        width={width}
                        height={height}>{children}</foreignObject>
}

export default SVGHtml