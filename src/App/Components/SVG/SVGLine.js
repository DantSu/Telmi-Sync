function SVGLine({fromX, fromY, toX, toY}) {
  return <path d={'M' + fromX + ',' + fromY + ' C' + fromX + ',' + (fromY + 200) + ' ' + toX + ',' + (toY - 200) + ' ' + toX + ',' + toY + ''}
               stroke="#FFFFFF55"
               strokeWidth="3"
               fill="none"/>
}

export default SVGLine