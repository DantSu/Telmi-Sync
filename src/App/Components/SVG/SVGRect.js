import {SVG_ANCHOR_LEFT, SVG_ANCHOR_TOP} from './SVGConstants.js'


function SVGRect({x, y, width, height, anchorX, anchorY, className, rx, ry}) {

  const aX = anchorX || SVG_ANCHOR_LEFT, aY = anchorY || SVG_ANCHOR_TOP

  return <rect x={x - width * aX / 2}
               y={y - height * aY / 2}
               width={width}
               height={height}
               rx={rx}
               ry={ry}
               className={className}/>
}

export default SVGRect