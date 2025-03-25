import {useCallback, useEffect, useRef, useState} from 'react'
import {useLocale} from '../Locale/LocaleHooks.js'
import {useElectronEmitter, useElectronListener} from '../Electron/Hooks/UseElectronEvent.js'

import {isCellSelected} from './TableHelpers.js'
import TableHeaderIcon from './TableHeaderIcon.js'
import TableCell from './TableCell.js'
import TableGroup from './TableGroup.js'

import Loader from '../Loader/Loader.js'

import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconWave from '../Buttons/Icons/ButtonIconWave.js'
import ButtonIconPlus from '../Buttons/Icons/ButtonIconPlus.js'
import ButtonIconXMark from '../Buttons/Icons/ButtonIconXMark.js'

import styles from './Table.module.scss'

const {ipcRenderer} = window.require('electron')

function Table({
                 className,
                 id,
                 titleLeft,
                 titleRight,
                 data,
                 selectedData,
                 onSelect,
                 onSelectAll,
                 onPlay,
                 onStudio,
                 onInfo,
                 onAdd,
                 onEdit,
                 onEditSelected,
                 onOptimizeAudio,
                 onOptimizeAudioSelected,
                 onDownload,
                 onDownloadSelected,
                 onDelete,
                 onDeleteSelected,
                 additionalHeaderButtons,
                 isLoading
               }) {

  const
    {getLocale} = useLocale(),
    [tableState, setTableState] = useState(null),
    [dataFiltered, setDataFiltered] = useState([]),
    searchInput = useRef(),
    onSearch = useCallback(
      () => {
        if (searchInput === null) {
          return
        }

        setTableState((tableState) => {
          if (tableState.search === searchInput.current.value) {
            return tableState
          }
          return {
            ...tableState,
            search: searchInput.current.value
          }
        })

        if (searchInput.current.value === '') {
          setDataFiltered(data)
          return
        }

        const regSearch = '.*(' + searchInput.current.value.split(' ').join(').*(') + ').*'
        setDataFiltered(
          data.reduce(
            (acc, d) => {
              if (d.tableGroup !== undefined) {
                const children = d.tableChildren.filter((d) => new RegExp(regSearch, 'gi').test(d.cellTitle))
                if (children.length) {
                  return [
                    ...acc,
                    {
                      tableGroup: d.tableGroup,
                      tableChildren: children
                    }
                  ]
                }
              } else {
                if (new RegExp(regSearch, 'gi').test(d.cellTitle)) {
                  return [...acc, d]
                }
              }
              return acc
            },
            []
          )
        )
      },
      [searchInput, data, setDataFiltered]
    ),
    clearSearch = useCallback(
      () => {
        searchInput.current.value = ''
        onSearch()
      },
      [searchInput, onSearch]
    ),
    onSelectAllCallback = useCallback(
      () => typeof onSelectAll === 'function' && onSelectAll(
        dataFiltered.reduce(
          (acc, d) => d.tableGroup !== undefined ? [...acc, ...d.tableChildren] : [...acc, d],
          []
        )
      ),
      [onSelectAll, dataFiltered]
    )

  useElectronEmitter('tablestate-get', [id, data])
  useElectronListener(
    'tablestate-data',
    (tableId, tableState) => {
      if (data.length === 0 || tableId !== id) {
        return
      }
      setTableState({
        search: tableState === null ? '' : tableState.search,
        group: data.reduce(
          (acc, v) => {
            if (v.tableGroup === undefined) {
              return acc
            }
            return {
              ...acc,
              [v.tableGroup]: {
                display: (tableState === null || tableState.group[v.tableGroup] === undefined) ? (v.tableGroupDisplay || 0) : tableState.group[v.tableGroup].display
              }
            }
          },
          {}
        )
      })
    },
    [id, data]
  )

  useEffect(
    () => {
      if (searchInput === null || tableState === null) {
        return
      }
      searchInput.current.value = tableState.search
      onSearch()
    },
    [tableState, searchInput, onSearch]
  )

  useEffect(
    () => {
      const timeout = setTimeout(
        () => {
          if (tableState !== null) {
            ipcRenderer.send('tablestate-save', id, tableState)
          }
        },
        500
      )
      return () => clearTimeout(timeout)
    },
    [id, tableState]
  )

  return <div className={[styles.tableContainer, className].join(' ')}>
    <div className={styles.header}>
      <h2 className={styles.headerTitleLeft}>{titleLeft}</h2>
      {titleRight && <p className={styles.headerTitleRight}>{titleRight}</p>}
      {
        (onAdd || onSelectAll || onDeleteSelected || onDownloadSelected || onEditSelected || onOptimizeAudioSelected) &&
        <ul className={styles.headerIcons}>
          {
            onOptimizeAudioSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconWave}
                             title="telmios-optimize-audio"
                             onClick={onOptimizeAudioSelected}/>
          }
          {
            onEditSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconPen}
                             title="edit-selected"
                             onClick={onEditSelected}/>
          }
          {
            onDownloadSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconDownload}
                             title="download-selected"
                             onClick={onDownloadSelected}/>
          }
          {
            onDeleteSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconTrash}
                             title="delete-selected"
                             onClick={onDeleteSelected}/>
          }
          {
            onSelectAll &&
            <TableHeaderIcon componentIcon={ButtonIconSquareCheck}
                             title="select-all"
                             onClick={onSelectAllCallback}/>
          }
          {
            onAdd &&
            <TableHeaderIcon componentIcon={ButtonIconPlus}
                             title="story-create"
                             onClick={onAdd}/>
          }
          {additionalHeaderButtons || null}
        </ul>
      }

      <div className={styles.headerSearchContainer}>
        <input type="text"
               placeholder={getLocale('search') + '...'}
               ref={searchInput}
               className={styles.headerSearchInput}
               onKeyUp={onSearch}/>
        <ButtonIconXMark className={styles.headerSearchReset}
                         onClick={clearSearch}/>
      </div>

    </div>
    <div className={styles.content}>
      <div className={styles.contentScroller}>
        <ul className={styles.cells}>{
          dataFiltered.map((v, k) => {
            if (v.tableGroup !== undefined) {
              return <TableGroup key={'cell-' + k}
                                 data={v}
                                 tableState={tableState}
                                 setTableState={setTableState}
                                 selectedData={selectedData}
                                 onSelect={onSelect}
                                 onSelectAll={onSelectAll}
                                 onPlay={onPlay}
                                 onStudio={onStudio}
                                 onOptimizeAudio={onOptimizeAudio}
                                 onEdit={onEdit}
                                 onInfo={onInfo}
                                 onDownload={onDownload}
                                 onDelete={onDelete}/>
            } else {
              return <TableCell key={'cell-' + k}
                                data={v}
                                selected={isCellSelected(selectedData, v)}
                                onSelect={onSelect}
                                onPlay={onPlay}
                                onStudio={onStudio}
                                onOptimizeAudio={onOptimizeAudio}
                                onEdit={onEdit}
                                onInfo={onInfo}
                                onDownload={onDownload}
                                onDelete={onDelete}/>
            }
          })
        }</ul>
      </div>
    </div>
    {isLoading && <Loader/>}
  </div>

}

export default Table
