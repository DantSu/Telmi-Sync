import styles from './Table.module.scss'
import { useCallback } from 'react'

function TableList ({data, selected, onSelect}) {
  const
    onCSelect = useCallback(
      (e) => typeof onSelect === 'function' && onSelect(e, data),
      [onSelect, data]
    )
  return <li className={[styles.list, selected ? styles.listSelected : '', data.cellDisabled ? styles.cellDisabled : ''].join(' ')}
             onClick={onCSelect}>
    {data.cellTitle}
  </li>
}

export default TableList
