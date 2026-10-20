import styles from './RSSFeed.module.scss'

function RSSFeedStars({count}) {
  const rdCount = Math.round(count) - 1
  return <ul className={styles.stars}>{
    new Array(5).fill(true).map((v, k) => k <= rdCount
        ? <li key={'star-' + k} className={styles.starFilled}>{'\uf005'}</li>
        : <li key={'star-' + k} className={styles.starEmpty}>{'\uf005'}</li>
    )
  }</ul>
}

export default RSSFeedStars
