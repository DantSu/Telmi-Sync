import SVGLine from '../../../../Components/SVG/SVGLine.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeAction({fromX, fromY, toX, toY, bezierCoefStart = 35, bezierCoefEnd = 35, arrows}) {
  const id = 'line-' + (fromX + 'x' + fromY + 'x' + toX + 'x' + toY).replace('.', '_')
  return <>
    <SVGLine fromX={fromX}
             fromY={fromY}
             toX={toX}
             toY={toY}
             id={id}
             bezierCoefStart={bezierCoefStart}
             bezierCoefEnd={bezierCoefEnd}
             className={styles.line}/>
    {
      arrows !== undefined && arrows > 0 &&
      <text className={styles.text}>{
        Array.from(
          Array(arrows),
          (_, k) => <textPath key={id + '-' + k}
                              xlinkHref={'#' + id}
                              startOffset={((k + 1) / (arrows + 1) * 100) + '%'}>➤</textPath>
        )
      }</text>
    }
  </>
}

export default StudioStoryNodeAction