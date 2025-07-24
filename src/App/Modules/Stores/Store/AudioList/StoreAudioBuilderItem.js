import {useCallback, useMemo} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStoreAudioBuilder} from './Provider/StoreAudioBuilderProviderHooks.js'
import {findCategory, removeAudioItem} from './Provider/StoreBuilderHelpers.js'

import styles from './StoreAudioList.module.scss'
import ButtonIconTrash from '../../../../Components/Buttons/Icons/ButtonIconTrash.js'

function StoreAudioBuilderItem({audioListKeys}) {
  const
    {getLocale} = useLocale(),
    {audioList, setAudioList} = useStoreAudioBuilder(),
    audioData = useMemo(() => findCategory(audioList, [...audioListKeys]), [audioList, audioListKeys]),

    onDelete = useCallback(
      () => setAudioList(
        (audioList) => removeAudioItem(audioList, [...audioListKeys], audioData)
      ),
      [setAudioList, audioListKeys, audioData]
    )

  return <li className={[
    styles.storeBuilderItemContainer,
    audioListKeys.length % 2 ? styles.storeBuilderListContainerBlue2 : styles.storeBuilderListContainerBlue
  ].join(' ')}>
    <div className={styles.storeBuilderItemTitleContainer}>
      <p className={styles.storeBuilderItemTitle}>{audioData.title}</p>
    </div>
    <div className={styles.storeBuilderItemActions}>
      <ButtonIconTrash onClick={onDelete} title={getLocale('delete-category')}/>
    </div>
  </li>
}


export default StoreAudioBuilderItem