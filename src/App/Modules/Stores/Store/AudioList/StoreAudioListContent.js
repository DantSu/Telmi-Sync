import {useCallback} from 'react'
import {useStoreContent} from '../StoreHooks.js'
import {useStoreAudioBuilder} from './Provider/StoreAudioBuilderProviderHooks.js'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'
import {stringSlugify} from '../../../../Helpers/String.js'
import {doAudioListValidation} from './Provider/StoreBuilderHelpers.js'
import Table from '../../../../Components/Table/Table.js'
import ButtonExternalLink from '../../../../Components/Link/ButtonExternalLink.js'
import ButtonIconTextDownload from '../../../../Components/Buttons/IconsTexts/ButtonIconTextDownload.js'
import StoreAudioBuilderCategory from './StoreAudioBuilderCategory.js'
import ModalStoreAudioBuilderForm from './ModalStoreAudioBuilderForm.js'
import ModalDialogAlert from '../../../../Components/Modal/Templates/ModalDialogs/ModalDialogAlert.js'

import styles from './StoreAudioList.module.scss'

function StoreAudioListContent({store, storeData}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    {audioList} = useStoreAudioBuilder(),

    {
      stories,
      storiesSelected,
      setStoriesSelected,
      isSortedByName,
      isSortedAsc,
      onInfo,
      onSelect,
      additionalHeaderButtons
    } = useStoreContent(store, storeData),

    getStoriesSelected = useCallback(
      () => {
        setStoriesSelected([])
        return storiesSelected.map((v) => ({...v}))
      },
      [setStoriesSelected, storiesSelected]
    ),

    onBuildPack = useCallback(
      () => {
        addModal((key) => {
          const audioListValidated = doAudioListValidation(audioList)
          if (audioListValidated === null) {
            const modal = <ModalDialogAlert key={key}
                                            title={getLocale('store-no-audio')}
                                            message={getLocale('store-no-audio-message')}
                                            onClose={() => rmModal(modal)}/>
            return modal
          } else {
            const modal = <ModalStoreAudioBuilderForm key={key}
                                                      store={storeData.store}
                                                      audioList={audioListValidated}
                                                      onClose={() => rmModal(modal)}/>
            return modal
          }
        })
      },
      [addModal, audioList, getLocale, rmModal, storeData]
    )

  return <>
    <Table
      id={stringSlugify(store.url)}
      titleLeft={getLocale('stories-on-store', stories.length) + ' (' + (isSortedByName ? getLocale('sorted-by-name') : getLocale('sorted-by-date')) + ' ' + (isSortedAsc ? getLocale('sorted-asc') : getLocale('sorted-desc')) + ')'}
      titleRight={storiesSelected.length ? getLocale('stories-selected', storiesSelected.length) : undefined}
      data={stories}
      onInfo={onInfo}
      selectedData={storiesSelected}
      onSelect={onSelect}
      additionalHeaderButtons={additionalHeaderButtons}
      isLoading={!stories.length}/>
    {
      storeData !== null &&
      <div className={styles.audioListContainer}>
        <div className={styles.audioListContainerAbsolute}>
          <ButtonExternalLink href={storeData.banner.link}>
            <div className={styles.infoAudioList}>
              <div className={styles.infoAudioListRssFeedContainer}>
                <h2 className={styles.infoAudioListRssFeed}>
                  <i className={[styles.infoAudioListIcon, styles.infoIconRssFeed].join(' ')}></i>
                  {getLocale('rss-feed')}
                </h2>
                <img className={styles.infoAudioListBanner} src={storeData.banner.image} alt=""/>
              </div>
              <div className={styles.infoAudioListTitleContainer}>
                <div className={styles.infoAudioListTitleContainerAbsolute}>
                  <h3 className={styles.infoAudioListTitle}>
                    {storeData.store.title}
                  </h3>
                  <p className={styles.infoAudioListDescription}>
                    {storeData.store.description}
                  </p>
                </div>
              </div>
            </div>
          </ButtonExternalLink>
          <div className={styles.storeBuilderContainer}>
            <ul>
              <StoreAudioBuilderCategory audioListKeys={[]}
                                         getStoriesSelected={getStoriesSelected}/>
            </ul>
            <ButtonIconTextDownload text={getLocale('stories-create-pack')}
                                    onClick={onBuildPack}
                                    rounded={true}/>
          </div>
        </div>
      </div>
    }
  </>
}

export default StoreAudioListContent
