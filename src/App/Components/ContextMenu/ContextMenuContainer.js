
import styles from './ContextMenu.module.scss'

function ContextMenuContainer({className, children, ...props}) {
  return <ul {...props} className={[styles.container, className].join(' ')}>{children}</ul>
}

export default ContextMenuContainer