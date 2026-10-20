import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import RSSFeedStars from './RSSFeedStars.js'
import styles from './RSSFeed.module.scss'

function RSSFeedRatingSummary({reviews}) {
  const
    {getLocale} = useLocale(),
    counts = reviews.reduce(
      (acc, r) => {
        acc[5 - r.stars]++
        return acc
      },
      new Array(5).fill(0)
    )

  return <div className={styles.ratingSummary}>
    <h4 className={styles.summaryTitle}>{getLocale('rates')}</h4>{
    counts.map((v, k) => (
      <div key={'stars-' + k} className={styles.ratingSummaryLine}>
        <RSSFeedStars count={5 - k}/>
        <span>{v}</span>
      </div>
    ))
  }</div>
}

export default RSSFeedRatingSummary
