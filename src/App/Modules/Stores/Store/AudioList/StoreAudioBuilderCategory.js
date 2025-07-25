import {useCallback, useMemo} from 'react'
import {useStoreAudioBuilder} from './Provider/StoreAudioBuilderProviderHooks.js'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {
  addAudioItems,
  getElementInAudioList,
  getDefaultCategory,
  removeAudioItem,
  updateAudioItemField
} from './Provider/StoreBuilderHelpers.js'
import {useStoreAudioBuilderDragAndDrop} from './StoreAudioBuilderHooks.js'
import InputText from '../../../../Components/Form/Input/InputText.js'
import ButtonIconTextPlus from '../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'
import StoreAudioBuilderItem from './StoreAudioBuilderItem.js'
import ButtonIconTrash from '../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StoreAudioList.module.scss'

function StoreAudioBuilderCategory({audioListKeys, getStoriesSelected}) {
  const
    {getLocale} = useLocale(),
    {audioList, setAudioList} = useStoreAudioBuilder(),
    audioCategory = useMemo(() => getElementInAudioList(audioList, [...audioListKeys]), [audioList, audioListKeys]),
    audioCategoryParent = useMemo(() => audioListKeys.length ? getElementInAudioList(audioList, audioListKeys.slice(0, audioListKeys.length - 1)) : null, [audioList, audioListKeys]),

    onBlurTitle = useCallback(
      (e) => setAudioList((audioList) => updateAudioItemField(audioList, audioListKeys, 'title', e.target.value)),
      [audioListKeys, setAudioList]
    ),

    onBlurQuestion = useCallback(
      (e) => setAudioList((audioList) => updateAudioItemField(audioList, audioListKeys, 'question', e.target.value)),
      [audioListKeys, setAudioList]
    ),

    onAddCategory = useCallback(
      () => setAudioList(
        (audioList) => addAudioItems(audioList, [...audioListKeys], [getDefaultCategory('', getLocale('which-story'))])
      ),
      [audioListKeys, getLocale, setAudioList]
    ),

    onAddAudioSelected = useCallback(
      () => setAudioList(
        (audioList) => addAudioItems(audioList, [...audioListKeys], getStoriesSelected())
      ),
      [audioListKeys, getStoriesSelected, setAudioList]
    ),

    onDelete = useCallback(
      () => setAudioList(
        (audioList) => audioListKeys.length ? removeAudioItem(audioList, [...audioListKeys]) : getDefaultCategory('', getLocale('which-story'))
      ),
      [setAudioList, audioListKeys, getLocale]
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
    audioListKeys.length ? (audioListKeys.length % 2 ? styles.storeBuilderItemContainerBlue : styles.storeBuilderItemContainerBlue2) : ''
  ].join(' ')}>
    {!!audioListKeys.length ?
      <div className={styles.storeBuilderItemTitleBar}
           draggable={true}
           onDragStart={onDragStart}
           onDragOver={onDragOver}
           onDragEnter={onDragEnter}
           onDragLeave={onDragLeave}
           onDrop={onDrop}>
        <div className={styles.storeBuilderItemTitleContainer}>
          <p className={[styles.storeBuilderItemTitle, styles.storeBuilderItemTitleCategory].join(' ')}>
            {audioListKeys[audioListKeys.length - 1] + 1}/{audioCategoryParent.audio.length} - {getLocale('category')}
          </p>
        </div>
        <div className={styles.storeBuilderActions}
             onDragStart={onPreventChildDraggable}
             onDragEnter={onPreventChildDraggable}
             onDragLeave={onPreventChildDraggable}
             onDrop={onPreventChildDraggable}>
          <ButtonIconTrash onClick={onDelete} title={getLocale('delete-category')}/>
        </div>
      </div> :
      <div className={styles.storeBuilderItemTitleBar}>
        <div className={styles.storeBuilderItemTitleContainer}>
          <p className={[styles.storeBuilderItemTitle, styles.storeBuilderItemTitleCategory].join(' ')}>
            {getLocale('stories-pack-to-create')}
          </p>
        </div>
        <div className={styles.storeBuilderActions}>
          <ButtonIconTrash onClick={onDelete} title={getLocale('reset')}/>
        </div>
      </div>
    }
    {
      !!audioListKeys.length &&
      <InputText label={getLocale('title')}
                 key={'store-builder-title-' + audioCategory.id}
                 className={styles.storeBuilderInputLayout}
                 classNameInput={styles.storeBuilderInput}
                 onBlur={onBlurTitle}
                 defaultValue={audioCategory.title}/>
    }
    <InputText label={getLocale('question')}
               key={'store-builder-question-' + audioCategory.id}
               className={styles.storeBuilderInputLayout}
               classNameInput={styles.storeBuilderInput}
               onBlur={onBlurQuestion}
               defaultValue={audioCategory.question}/>

    <ul className={styles.storeBuilderAudioList}>{
      audioCategory.audio.map(
        (v, k) =>
          (Array.isArray(v.audio)) ?
            <StoreAudioBuilderCategory key={'store-builder-item-' + audioListKeys.join('-') + '-' + k}
                                       audioListKeys={[...audioListKeys, k]}
                                       getStoriesSelected={getStoriesSelected}/> :
            <StoreAudioBuilderItem key={'store-builder-item-' + audioListKeys.join('-') + '-' + k}
                                   audioListKeys={[...audioListKeys, k]}/>
      )
    }</ul>

    <div className={styles.storeBuilderCategoryButtons}>
      <ButtonIconTextPlus text={getLocale('add-selected-stories')}
                          className={styles.storeBuilderCategoryButton}
                          onClick={onAddAudioSelected}/>
      <ButtonIconTextPlus text={getLocale('add-category')}
                          className={styles.storeBuilderCategoryButton}
                          onClick={onAddCategory}/>
    </div>
  </li>
}


export default StoreAudioBuilderCategory