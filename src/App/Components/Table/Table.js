import { useLocale } from '../Locale/LocaleHooks.js'
import Loader from '../Loader/Loader.js'
import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconWave from '../Buttons/Icons/ButtonIconWave.js'

import TableCell from './TableCell.js'
import TableGroup from './TableGroup.js'

import styles from './Table.module.scss'

function Table ({
                  className,
                  titleLeft,
                  titleRight,
                  data,
                  selectedData,
                  onSelect,
                  onSelectGroup,
                  onSelectAll,
                  onPlay,
                  onEdit,
                  onEditSelected,
  onOptimizeAudio,
  onOptimizeAudioSelected,
                  onDownload,
                  onDownloadSelected,
                  onDelete,
                  onDeleteSelected,
                  isLoading
                }) {

  const {getLocale} = useLocale()

  return <div className={[styles.tableContainer, className].join(' ')}>
    <div className={styles.header}>
      <h2 className={styles.headerTitleLeft}>{titleLeft}</h2>
      {titleRight && <p className={styles.headerTitleRight}>{titleRight}</p>}
      {
        (onSelectAll || onDeleteSelected || onDownloadSelected || onEditSelected || onOptimizeAudioSelected) &&
        <ul className={styles.headerIcons}>
          {
            onOptimizeAudioSelected && selectedData.length > 0 &&
            <li><ButtonIconWave className={styles.headerIcon}
                               title={getLocale('telmios-optimize-audio')}
                               onClick={onOptimizeAudioSelected}/></li>
          }
          {
            onEditSelected && selectedData.length > 0 &&
            <li><ButtonIconPen className={styles.headerIcon}
                               title={getLocale('edit-selected')}
                               onClick={onEditSelected}/></li>
          }
          {
            onDownloadSelected && selectedData.length > 0 &&
            <li><ButtonIconDownload className={styles.headerIcon}
                                    title={getLocale('download-selected')}
                                    onClick={onDownloadSelected}/></li>
          }
          {
            onDeleteSelected && selectedData.length > 0 &&
            <li><ButtonIconTrash className={styles.headerIcon}
                                 title={getLocale('delete-selected')}
                                 onClick={onDeleteSelected}/></li>
          }
          {
            onSelectAll &&
            <li><ButtonIconSquareCheck className={styles.headerIcon}
                                       title={getLocale('select-all')}
                                       onClick={onSelectAll}/></li>
          }
        </ul>
      }

    </div>
    <div className={styles.content}>
      <div className={styles.contentScroller}>
        <ul className={styles.cells}>{
          data.map((v, k) => {
            if (v.tableGroup) {
              return <TableGroup key={'cell-' + k}
                                 data={v}
                                 selectedData={selectedData}
                                 onSelect={onSelect}
                                 onSelectGroup={onSelectGroup}
                                 onPlay={onPlay}
                                 onOptimizeAudio={onOptimizeAudio}
                                 onEdit={onEdit}
                                 onDownload={onDownload}
                                 onDelete={onDelete}/>
            } else {
              return <TableCell key={'cell-' + k}
                                data={v}
                                selected={Array.isArray(selectedData) && selectedData.includes(v)}
                                onSelect={onSelect}
                                onPlay={onPlay}
                                onOptimizeAudio={onOptimizeAudio}
                                onEdit={onEdit}
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
