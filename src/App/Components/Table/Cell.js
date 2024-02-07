import styles from './Table.module.scss'
import { useCallback } from 'react'
import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconPlay from '../Buttons/Icons/ButtonIconPlay.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'

function Cell ({data, selected, onSelect, onPlay, onEdit, onDownload, onDelete}) {
  const
    onCSelect = useCallback(
      () => typeof onSelect === 'function' && onSelect(data),
      [onSelect, data]
    ),
    onCPlay = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onPlay === 'function' && onPlay(data)
      },
      [onPlay, data]
    ),
    onCEdit = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onEdit === 'function' && onEdit(data)
      },
      [onEdit, data]
    ),
    onCDownload = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onDownload === 'function' && onDownload(data)
      },
      [onDownload, data]
    ),
    onCDelete = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onDelete === 'function' && onDelete(data)
      },
      [onDelete, data]
    )

  return <li className={[styles.cell, selected ? styles.cellSelected : ''].join(' ')} onClick={onCSelect}>
    <h5 className={styles.cellTitle} title={data.cellTitle}>{data.cellTitle}</h5>
    <p className={styles.cellSubtitle} title={data.cellSubtitle}>{data.cellSubtitle}</p>
    <div className={styles.imageContainer}><img src={data.image} className={styles.cellImage} alt=""/></div>
    {
      (onPlay || onEdit || onDownload || onDelete) &&
      <div className={styles.cellActionBar}>
        {onPlay && <ButtonIconPlay onClick={onCPlay} className={styles.cellActionButton}/>}
        {onEdit && <ButtonIconPen onClick={onCEdit} className={styles.cellActionButton}/>}
        {onDownload && <ButtonIconDownload onClick={onCDownload} className={styles.cellActionButton}/>}
        {onDelete && <ButtonIconTrash onClick={onCDelete} className={styles.cellActionButton}/>}
      </div>
    }
  </li>
}

export default Cell
