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

const
  getDisplayValue = (group) => group === undefined ? 0 : group.display,
  getCollapsedValue = (group) => group === undefined ? false : group.collapsed,

  updateTableState = (setTableState, tableGroup, getNewValue) => setTableState(
    (tableState) => ({
        ...tableState,
        group: {
          ...tableState.group,
          [tableGroup]: {...tableState.group[tableGroup], ...getNewValue(tableState.group[tableGroup])}
        }
      })
  )

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
    onCSelectGroup = useCallback(
      () => typeof onSelectAll === 'function' && onSelectAll(data.tableChildren),
      [onSelectAll, data]
    ),
    onCDisplay = useCallback(
      () => updateTableState(
        setTableState,
        data.tableGroup,
        (data) => ({display: checkGroupDisplayValue(getDisplayValue(data) + 1)})
      ),
      [data.tableGroup, setTableState]
    ),
    onCCollapse = useCallback(
      () => updateTableState(
        setTableState,
        data.tableGroup,
        (data) => ({collapsed: !getCollapsedValue(data)})
      ),
      [data.tableGroup, setTableState]
    )

  return <li className={[styles.cellGroup, collapsed ? styles.collapsed : ''].join(' ')}>
    <h3 className={styles.cellGroupTitle}>
      <span>{data.tableGroup}</span>
      <span>
        {
          !collapsed && (
            display === 1 ?
              <ButtonIconList className={styles.cellGroupButton}
                              title={getLocale('display-list')}
                              onClick={onCDisplay}/> :
              <ButtonIconGrip className={styles.cellGroupButton}
                              title={getLocale('display-thumbnails')}
                              onClick={onCDisplay}/>
          )
        }
        {
          onSelectAll &&
          <ButtonIconSquareCheck className={styles.cellGroupButton}
                                 title={getLocale('select-all')}
                                 onClick={onCSelectGroup}/>
        }
        {collapsed ?
          <ButtonIconChevronDown className={styles.cellGroupButton}
                                 title={getLocale('expand')}
                                 onClick={onCCollapse}/> :
          <ButtonIconChevronUp className={styles.cellGroupButton}
                               title={getLocale('collapse')}
                               onClick={onCCollapse}/>}
      </span>
    </h3>
    {
      !collapsed && (
        display === 1 ?
          <ul className={styles.cells}>
            {
              data.tableChildren.map(
                (v, k) => <TableCell key={'cell-' + k}
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
              )
            }
          </ul> :
          <div className={styles.groupList}>
            <img className={styles.groupListImage} src={data.tableChildren[0].image} alt="" loading="lazy"/>
            <ul className={styles.listContainer}>
              {
                data.tableChildren.map(
                  (v, k) => <TableList key={'cell-' + k}
                                       data={v}
                                       selected={isCellSelected(selectedData, v)}
                                       onSelect={onSelect}/>
                )
              }
            </ul>
          </div>
      )
    }
  </li>
}

export default TableGroup
