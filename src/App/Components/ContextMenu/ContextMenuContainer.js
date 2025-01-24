
import styles from './ContextMenu.module.scss'

function ContextMenuContainer({className, children}) {
  return <ul className={[styles.container, className].join(' ')}>{children}</ul>
}

export default ContextMenuContainer