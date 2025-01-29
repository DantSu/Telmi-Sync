import {useCallback} from 'react'
import {useLocale} from '../Locale/LocaleHooks.js'
import {checkGroupDisplayValue, isCellSelected} from './TableHelpers.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconGrip from '../Buttons/Icons/ButtonIconGrip.js'
import ButtonIconList from '../Buttons/Icons/ButtonIconList.js'
import TableCell from './TableCell.js'
import TableList from './TableList.js'

import styles from './Table.module.scss'

const getDisplayValue = (group) => group === undefined ? 0 : group.display

function TableGroup({
                      data,
                      tableState,
                      setTableState,
                      selectedData,
                      onSelect,
                      onSelectAll,
                      onPlay,
                      onStudio,
                      onInfo,
                      onEdit,
                      onOptimizeAudio,
                      onDownload,
                      onDelete
                    }) {
  const
    {getLocale} = useLocale(),
    display = getDisplayValue(tableState.group[data.tableGroup]),
    onCDisplay = useCallback(
      () => setTableState((tableState) => ({
        ...tableState,
        group: {
          ...tableState.group,
          [data.tableGroup]: {
            display: checkGroupDisplayValue(getDisplayValue(tableState.group[data.tableGroup]) + 1)
          }
        }
      })),
      [data.tableGroup, setTableState]
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
          display === 1 ?
            <ButtonIconList className={styles.cellGroupButton}
                            title={getLocale('display-list')}
                            onClick={onCDisplay}/> :
            <ButtonIconGrip className={styles.cellGroupButton}
                            title={getLocale('display-thumbnails')}
                            onClick={onCDisplay}/>
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
      display === 1 ?
        <ul className={styles.cells}>
          {
            data.tableChildren.map((v, k) => {
              return <TableCell key={'cell-' + k}
                                data={v}
                                selected={isCellSelected(selectedData, v)}
                                onSelect={onSelect}
                                onPlay={onPlay}
                                onStudio={onStudio}
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
