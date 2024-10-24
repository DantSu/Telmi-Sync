import {useCallback, useEffect, useRef, useState} from 'react'
import {useLocale} from '../Locale/LocaleHooks.js'
import Loader from '../Loader/Loader.js'

import {isCellSelected} from './TableHelpers.js'
import TableHeaderIcon from './TableHeaderIcon.js'
import TableCell from './TableCell.js'
import TableGroup from './TableGroup.js'

import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconWave from '../Buttons/Icons/ButtonIconWave.js'
import ButtonIconPlus from '../Buttons/Icons/ButtonIconPlus.js'

import styles from './Table.module.scss'

function Table({
                 className,
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
    [dataFiltered, setDataFiltered] = useState([]),
    searchInput = useRef(),
    onSearch = useCallback(
      () => {
        if (searchInput === null) {
          return
        }
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
    onSelectAllCallback = useCallback(
      () => typeof onSelectAll === 'function' && onSelectAll(
        dataFiltered.reduce(
          (acc, d) => d.tableGroup !== undefined ? [...acc, ...d.tableChildren] : [...acc, d],
          []
        )
      ),
      [onSelectAll, dataFiltered]
    )

  useEffect(() => onSearch(), [onSearch])

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

      <input type="text"
             placeholder={getLocale('search') + '...'}
             ref={searchInput}
             className={styles.headerSearchInput}
             onKeyUp={onSearch}/>

    </div>
    <div className={styles.content}>
      <div className={styles.contentScroller}>
        <ul className={styles.cells}>{
          dataFiltered.map((v, k) => {
            if (v.tableGroup !== undefined) {
              return <TableGroup key={'cell-' + k}
                                 data={v}
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
