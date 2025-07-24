import {useCallback, useMemo} from 'react'
import {useStoreAudioBuilder} from './Provider/StoreAudioBuilderProviderHooks.js'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {addAudioItems, findCategory, getDefaultCategory, removeAudioItem} from './Provider/StoreBuilderHelpers.js'
import InputText from '../../../../Components/Form/Input/InputText.js'
import ButtonIconTextPlus from '../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'
import StoreAudioBuilderItem from './StoreAudioBuilderItem.js'
import ButtonIconTrash from '../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StoreAudioList.module.scss'


function StoreAudioBuilderCategory({audioListKeys, getStoriesSelected}) {
  const
    {getLocale} = useLocale(),
    {audioList, setAudioList} = useStoreAudioBuilder(),
    audioCategory = useMemo(() => findCategory(audioList, [...audioListKeys]), [audioList, audioListKeys]),

    onChangeTitle = useCallback(() => {}, []),

    onChangeQuestion = useCallback(() => {}, []),

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
        (audioList) => removeAudioItem(audioList, [...audioListKeys], audioCategory)
      ),
      [setAudioList, audioListKeys, audioCategory]
    )

  return <li className={[
    styles.storeBuilderListContainer,
    audioListKeys.length % 2 ? styles.storeBuilderListContainerBlue2 : styles.storeBuilderListContainerBlue
  ].join(' ')}>
    <div className={styles.storeBuilderCategoryForm}>
      <div className={styles.storeBuilderCategoryFields}>
        {!!audioListKeys.length && <InputText label={getLocale('title')}
                                              key="store-builder-title"
                                              id="store-builder-title"
                                              className={styles.storeBuilderInputLayout}
                                              classNameInput={styles.storeBuilderInput}
                                              onChange={onChangeTitle}
                                              defaultValue={audioCategory.title}/>}
        <InputText label={getLocale('question')}
                   key="store-builder-question"
                   id="store-builder-question"
                   className={styles.storeBuilderInputLayout}
                   classNameInput={styles.storeBuilderInput}
                   onChange={onChangeQuestion}
                   defaultValue={audioCategory.question}/>
      </div>
      {!!audioListKeys.length && <div className={styles.storeBuilderCategoryActions}>
        <ButtonIconTrash onClick={onDelete} title={getLocale('delete-category')}/>
      </div>}
    </div>
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