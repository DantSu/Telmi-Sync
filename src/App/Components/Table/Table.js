import styles from './Table.module.scss'
import Cell from './Cell.js'
import Loader from '../Loader/Loader.js'

function Table ({
                  className,
                  titleLeft,
                  titleRight,
                  data,
                  selectedData,
                  onSelect,
                  onPlay,
                  onEdit,
                  onDownload,
                  onDelete,
                  isLoading
                }) {

  return <div className={[styles.tableContainer, className].join(' ')}>
    <div className={styles.header}>
      <h2 className={styles.headerTitle}>{titleLeft}</h2>
      {titleRight && <p className={styles.headerTitle}>{titleRight}</p>}
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
