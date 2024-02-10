import styles from './Table.module.scss'
import { useCallback } from 'react'

function TableList ({data, selected, onSelect}) {
  const
    onCSelect = useCallback(
      () => typeof onSelect === 'function' && onSelect(data),
      [onSelect, data]
    )
  return <li className={selected ? styles.listSelected : styles.list}
             onClick={onCSelect}>
    {data.cellTitle}
  </li>
}

export default TableList
