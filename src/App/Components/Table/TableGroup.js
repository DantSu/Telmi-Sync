import { useCallback, useState } from 'react'
import { useLocale } from '../Locale/LocaleHooks.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconGrip from '../Buttons/Icons/ButtonIconGrip.js'
import ButtonIconList from '../Buttons/Icons/ButtonIconList.js'
import {isCellSelected} from './TableHelpers.js';
import TableCell from './TableCell.js'
import TableList from './TableList.js'

import styles from './Table.module.scss'

function TableGroup ({data, selectedData, onSelect, onSelectAll, getAudioPath, onInfo, onEdit, onOptimizeAudio, onDownload, onDelete}) {
  const
    {getLocale} = useLocale(),
    [displayCells, setDisplayCells] = useState(false),
    onCDisplayCells = useCallback(
      () => setDisplayCells((v) => !v),
      [setDisplayCells]
    ),
    onCSelectGroup = useCallback(
      () => typeof onSelectAll === 'function' && onSelectAll(data.tableChildren),
      [onSelectAll, data]
    )

  return <li className={styles.cellGroup}>
    <h3 className={styles.cellGroupTitle}>
      <span>{data.tableGroup}</span>
      <span>
        {
          displayCells ?
            <ButtonIconList className={styles.cellGroupButton}
                            title={getLocale('display-list')}
                            onClick={onCDisplayCells}/> :
            <ButtonIconGrip className={styles.cellGroupButton}
                            title={getLocale('display-thumbnails')}
                            onClick={onCDisplayCells}/>
        }
        {
          onSelectAll &&
          <ButtonIconSquareCheck className={styles.cellGroupButton}
                                 title={getLocale('select-all')}
                                 onClick={onCSelectGroup}/>
        }
      </span>
    </h3>
    {
      displayCells ?
        <ul className={styles.cells}>
          {
            data.tableChildren.map((v, k) => {
              return <TableCell key={'cell-' + k}
                                data={v}
                                selected={isCellSelected(selectedData, v)}
                                onSelect={onSelect}
                                getAudioPath={getAudioPath}
                                onInfo={onInfo}
                                onOptimizeAudio={onOptimizeAudio}
                                onEdit={onEdit}
                                onDownload={onDownload}
                                onDelete={onDelete}/>
            })
          }
        </ul> :
        <div className={styles.groupList}>
          <img className={styles.groupListImage} src={data.tableChildren[0].image} alt=""/>
          <ul className={styles.listContainer}>
            {
              data.tableChildren.map((v, k) => <TableList key={'cell-' + k}
                                                          data={v}
                                                          selected={isCellSelected(selectedData, v)}
                                                          onSelect={onSelect}/>)
            }
          </ul>
        </div>
    }
  </li>
}

export default TableGroup
