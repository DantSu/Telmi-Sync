import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import styles from './RSSFeed.module.scss'

function RSSFeedAgeSummary({reviews}) {
  const
    {getLocale} = useLocale(),
    counts = reviews.reduce((acc, review) => {
        if (review.minAge === null || review.minAge === undefined) {
          return acc
        }
        return {...acc, [review.minAge]: (acc[review.minAge] || 0) + 1}
      },
      {}
    ),
    ages = Object.keys(counts).map(Number).sort((a, b) => a - b),
    total = Object.values(counts).reduce((acc, v) => acc + v, 0)

  if (!ages.length) {
    return null
  }

  return (
    <div className={styles.ageSummary}>
      <h4 className={styles.summaryTitle}>{getLocale('ages-recommendations')}</h4>
      {ages.map((age) => (
        <div key={age} className={styles.ageLine}>
          <div className={styles.ageLineTop}>
            <span className={styles.ageLabel}>{age}+</span>
            <div className={styles.ageBarContainer}>
              <div className={styles.ageBar} style={{width: counts[age] / total * 100 + '%'}}/>
            </div>
          </div>
          <span className={styles.ageText}>
            {counts[age] > 1 ? getLocale('persons-think-age', counts[age], age) : getLocale('persons-think-age-singular', age)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default RSSFeedAgeSummary
