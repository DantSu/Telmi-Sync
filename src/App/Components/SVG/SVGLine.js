function SVGLine({id, fromX, fromY, toX, toY, bezierCoefStart, bezierCoefEnd, className}) {
  return <path d={'M' + fromX + ',' + fromY + ' C' + fromX + ',' + (fromY + bezierCoefStart) + ' ' + toX + ',' + (toY - bezierCoefEnd) + ' ' + toX + ',' + toY + ''}
               id={id}
               className={className}/>
}

export default SVGLine