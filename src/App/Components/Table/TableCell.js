import { useLocale } from '../Locale/LocaleHooks.js'
import { useCallback } from 'react'

import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconWave from '../Buttons/Icons/ButtonIconWave.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconPlay from '../Buttons/Icons/ButtonIconPlay.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'
import ButtonIconInfo from '../Buttons/Icons/ButtonIconInfo.js'

import styles from './Table.module.scss'

function TableCell ({data, selected, onSelect, onPlay, onInfo, onOptimizeAudio, onEdit, onDownload, onDelete}) {
  const
    {getLocale} = useLocale(),
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
    onCInfo = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onInfo === 'function' && onInfo(data)
      },
      [onInfo, data]
    ),
    onCOptimizeAudio = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        typeof onOptimizeAudio === 'function' && onOptimizeAudio(data)
      },
      [onOptimizeAudio, data]
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

  return <li className={[styles.cell, selected ? styles.cellSelected : '', data.cellDisabled ? styles.cellDisabled : ''].join(' ')} onClick={onCSelect}>
    <h5 className={styles.cellTitle} title={data.cellTitle}><span className={styles.cellEllipsis}>{data.cellTitle}</span></h5>
    {data.cellSubtitle && <p className={styles.cellSubtitle} title={data.cellSubtitle}><span className={styles.cellEllipsis}>{data.cellSubtitle}</span></p>}
    <div className={styles.imageContainer}>
      <img src={data.image} className={styles.cellImage} alt=""/>
      <div className={styles.cellImageBackground} style={{backgroundImage:'url("' + data.image.replaceAll('\\', '\\\\') + '")'}}/>
      {data.cellLabelIcon && <p className={styles.cellImageLabel} title={data.cellLabelIconText}>{data.cellLabelIcon}</p>}
    </div>
    {
      (onPlay || onEdit || onDownload || onDelete) &&
      <div className={styles.cellActionBar}>
        {onPlay && <ButtonIconPlay title={getLocale('listen-title')} onClick={onCPlay} className={styles.cellActionButton}/>}
        {onInfo && <ButtonIconInfo title={getLocale('informations')} onClick={onCInfo} className={styles.cellActionButton}/>}
        {onOptimizeAudio && <ButtonIconWave title={getLocale('telmios-optimize-audio')} onClick={onCOptimizeAudio} className={styles.cellActionButton}/>}
        {onEdit && <ButtonIconPen title={getLocale('edit')} onClick={onCEdit} className={styles.cellActionButton}/>}
        {onDownload && <ButtonIconDownload title={getLocale('download')} onClick={onCDownload} className={styles.cellActionButton}/>}
        {onDelete && <ButtonIconTrash title={getLocale('delete')} onClick={onCDelete} className={styles.cellActionButton}/>}
      </div>
    }
  </li>
}

export default TableCell
