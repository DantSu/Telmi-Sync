import { useCallback } from 'react'
import { useLocale } from '../Locale/LocaleHooks.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import TableCell from './TableCell.js'

import styles from './Table.module.scss'

function TableGroup ({data, selectedData, onSelect, onSelectGroup, onPlay, onEdit, onDownload, onDelete}) {
  const
    {getLocale} = useLocale(),
    onCSelectGroup = useCallback(
      () => typeof onSelectGroup === 'function' && onSelectGroup(data.tableChildren),
      [onSelectGroup, data]
    )

  return <li className={styles.cellGroup}>
    <h3 className={styles.cellGroupTitle}>
      <span>{data.tableGroup}</span>
      {
        onSelectGroup &&
        <span><ButtonIconSquareCheck className={styles.cellGroupButton} title={getLocale('select-all')} onClick={onCSelectGroup}/></span>
      }
    </h3>
    <ul className={styles.cells}>
      {
        data.tableChildren.map((v, k) => {
          return <TableCell key={'cell-' + k}
                            data={v}
                            selected={Array.isArray(selectedData) && selectedData.includes(v)}
                            onSelect={onSelect}
                            onPlay={onPlay}
                            onEdit={onEdit}
                            onDownload={onDownload}
                            onDelete={onDelete}/>
        })
      }
    </ul>
  </li>
}

export default TableGroup
