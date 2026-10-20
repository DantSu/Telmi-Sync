import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import RSSFeedStars from './RSSFeedStars.js'
import styles from './RSSFeed.module.scss'

function RSSFeedReviewsList({reviews}) {
  const {getLocale} = useLocale()
  const sorted = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className={styles.reviewsList}>
      {sorted.map((review, index) => (
        <div key={index} className={styles.reviewItem}>
          <ul className={styles.reviewHeader}>
            <li className={styles.reviewAuthor}>{review.authorName}</li>
            <RSSFeedStars count={review.stars}/>
            {review.minAge !== null && review.minAge !== undefined && (
              <li className={styles.reviewAge}> {getLocale('review-age', review.minAge)}</li>
            )}
            <li className={styles.reviewDate}>
              {new Date(review.createdAt).toLocaleDateString()}
            </li>
          </ul>
          {review.comment !== null && review.comment !== undefined && (
            <p className={styles.reviewComment}>{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default RSSFeedReviewsList
