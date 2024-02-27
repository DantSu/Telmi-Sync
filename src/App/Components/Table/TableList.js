import styles from './Table.module.scss'
import { useCallback } from 'react'

function TableList ({data, selected, onSelect}) {
  const
    onCSelect = useCallback(
      () => typeof onSelect === 'function' && onSelect(data),
      [onSelect, data]
    )
  return <li className={[styles.list, selected ? styles.listSelected : '', data.cellDisabled ? styles.cellDisabled : ''].join(' ')}
             onClick={onCSelect}>
    {data.cellTitle}
  </li>
}

export default TableList
