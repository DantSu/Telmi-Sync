import styles from './Table.module.scss'
import Cell from './Cell.js'
import Loader from '../Loader/Loader.js'
import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'

function Table ({
                  className,
                  titleLeft,
                  titleRight,
                  data,
                  selectedData,
                  onSelect,
                  onSelectAll,
                  onPlay,
                  onEdit,
                  onDownload,
                  onDownloadSelected,
                  onDelete,
                  onDeleteSelected,
                  isLoading
                }) {

  return <div className={[styles.tableContainer, className].join(' ')}>
    <div className={styles.header}>
      <h2 className={styles.headerTitleLeft}>{titleLeft}</h2>
      {titleRight && <p className={styles.headerTitleRight}>{titleRight}</p>}
      {
        (onSelectAll || onDeleteSelected || onDownloadSelected) &&
        <ul className={styles.headerIcons}>
          {
            onDownloadSelected && selectedData.length > 0 &&
            <li><ButtonIconDownload className={styles.headerIcon}
                                    title="Télécharger la sélection"
                                    onClick={onDownloadSelected}/></li>
          }
          {
            onDeleteSelected && selectedData.length > 0 &&
            <li><ButtonIconTrash className={styles.headerIcon}
                                 title="Supprimer la sélection"
                                 onClick={onDeleteSelected}/></li>
          }
          {
            onSelectAll &&
            <li><ButtonIconSquareCheck className={styles.headerIcon}
                                       title="Sélectionner tout"
                                       onClick={onSelectAll}/></li>
          }
        </ul>
      }

    </div>
    <div className={styles.content}>
      <div className={styles.contentScroller}>
        <ul className={styles.cells}>{
          data.map((v, k) => <Cell key={'cell-' + k}
                                   data={v}
                                   selected={Array.isArray(selectedData) && selectedData.includes(v)}
                                   onSelect={onSelect}
                                   onPlay={onPlay}
                                   onEdit={onEdit}
                                   onDownload={onDownload}
                                   onDelete={onDelete}/>)
        }</ul>
      </div>
    </div>
    {isLoading && <Loader/>}
  </div>

}

export default Table
