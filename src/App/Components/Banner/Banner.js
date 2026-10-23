import ButtonExternalLink from '../Link/ButtonExternalLink.js'
import styles from './StorePacksList.module.scss'


function Banner({href, src, background}) {
  return <ButtonExternalLink href={href}>
        <div className={styles.bannerContainer} style={{background: background}}>
          <div className={styles.bannerInnerContainer}>
            <img className={styles.banner} src={src} alt=""/>
          </div>
        </div>
      </ButtonExternalLink>
}

export default Banner