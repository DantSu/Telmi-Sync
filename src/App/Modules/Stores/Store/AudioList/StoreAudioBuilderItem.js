import {useCallback, useMemo} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStoreAudioBuilder} from './Provider/StoreAudioBuilderProviderHooks.js'
import {getElementInAudioList, removeAudioItem} from './Provider/StoreBuilderHelpers.js'
import {useStoreAudioBuilderDragAndDrop} from './StoreAudioBuilderHooks.js'
import ButtonIconTrash from '../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StoreAudioList.module.scss'

function StoreAudioBuilderItem({audioListKeys}) {
  const
    {getLocale} = useLocale(),
    {audioList, setAudioList} = useStoreAudioBuilder(),
    audioData = useMemo(() => getElementInAudioList(audioList, [...audioListKeys]), [audioList, audioListKeys]),
    audioCategoryParent = useMemo(() => getElementInAudioList(audioList, audioListKeys.slice(0, audioListKeys.length - 1)), [audioList, audioListKeys]),

    onDelete = useCallback(
      () => setAudioList(
        (audioList) => removeAudioItem(audioList, [...audioListKeys])
      ),
      [setAudioList, audioListKeys, audioData]
    ),

    {
      onDragStart,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onPreventChildDraggable
    } = useStoreAudioBuilderDragAndDrop(audioListKeys, setAudioList)

  return <li className={[
    styles.storeBuilderItemContainer,
    audioListKeys.length % 2 ? styles.storeBuilderItemContainerBlue : styles.storeBuilderItemContainerBlue2
  ].join(' ')}>
    <div className={styles.storeBuilderItemTitleBar}
         draggable={true}
         onDragStart={onDragStart}
         onDragOver={onDragOver}
         onDragEnter={onDragEnter}
         onDragLeave={onDragLeave}
         onDrop={onDrop}>
      <div className={styles.storeBuilderItemTitleContainer}>
        <p className={styles.storeBuilderItemTitle}>
          {audioListKeys[audioListKeys.length - 1] + 1}/{audioCategoryParent.audio.length} - {audioData.title}
        </p>
      </div>
      <div className={styles.storeBuilderActions}
           onDragStart={onPreventChildDraggable}
           onDragEnter={onPreventChildDraggable}
           onDragLeave={onPreventChildDraggable}
           onDrop={onPreventChildDraggable}>
        <ButtonIconTrash onClick={onDelete} title={getLocale('delete-category')}/>
      </div>
    </div>
  </li>
}


export default StoreAudioBuilderItem