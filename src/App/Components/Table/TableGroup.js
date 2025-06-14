import {useCallback} from 'react'
import {useLocale} from '../Locale/LocaleHooks.js'
import {checkGroupDisplayValue, isCellSelected} from './TableHelpers.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconGrip from '../Buttons/Icons/ButtonIconGrip.js'
import ButtonIconList from '../Buttons/Icons/ButtonIconList.js'
import ButtonIconChevronUp from '../Buttons/Icons/ButtonIconChevronUp.js'
import ButtonIconChevronDown from '../Buttons/Icons/ButtonIconChevronDown.js'
import TableCell from './TableCell.js'
import TableList from './TableList.js'

import styles from './Table.module.scss'

const getDisplayValue = (group) => group === undefined ? 0 : group.display
const getCollapsedValue = (group) => group === undefined ? false : group.collapsed

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
    collapsed = getCollapsedValue(tableState.group[data.tableGroup]),
    onCDisplay = () => updateTableState(checkGroupDisplayValue(getDisplayValue(tableState.group[data.tableGroup]) + 1), getCollapsedValue(tableState.group[data.tableGroup])),
    onCSelectGroup = useCallback(
      () => typeof onSelectAll === 'function' && onSelectAll(data.tableChildren),
      [onSelectAll, data]
    ),
    collapse = () => updateTableState(getDisplayValue(tableState.group[data.tableGroup]), true),
    expand = () => updateTableState(getDisplayValue(tableState.group[data.tableGroup]), false),
    updateTableState = useCallback(
      (display, collapsed) => setTableState((tableState) => ({
        ...tableState,
        group: {
          ...tableState.group,
          [data.tableGroup]: {
            display,
            collapsed
          }
        }
      })),
      [data.tableGroup, setTableState]
    )

  return <li className={styles.cellGroup}>
    <h3 className={[styles.cellGroupTitle, collapsed ? styles.collapsed : ''].join(" ")}>
      <span>{data.tableGroup}</span>
      <span>
        {
          collapsed ? '' :
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
        { collapsed ? 
          <ButtonIconChevronDown 
              title={getLocale('rssfeed-expand')} 
              onClick={expand} /> : 
          <ButtonIconChevronUp 
              title={getLocale('rssfeed-collapse')} 
              onClick={collapse}/> }
      </span>
    </h3>
    {
      collapsed ? '' :
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
