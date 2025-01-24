import styles from './ContextMenu.module.scss'

function ContextMenuItem({onClick, children}) {
  return <li className={styles.item}>
    <button type="button"
            className={styles.itemButton}
            onClick={onClick}>{children}</button>
  </li>
}

export default ContextMenuItem