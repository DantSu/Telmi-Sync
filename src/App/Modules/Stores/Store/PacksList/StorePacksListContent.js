import {useCallback} from 'react'
import {useStoreContent} from '../StoreHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {stringSlugify} from '../../../../Helpers/String.js'
import Table from '../../../../Components/Table/Table.js'
import ButtonExternalLink from '../../../../Components/Link/ButtonExternalLink.js'
import ModalStoreDownload from './ModalStoreDownload.js'

import styles from './StorePacksList.module.scss'

function StorePacksListContent({store, storeData}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
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

    onDownloadSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoreDownload key={key}
                                            stories={storiesSelected}
                                            onClose={() => {
                                              rmModal(modal)
                                              setStoriesSelected([])
                                            }}/>
          return modal
        })
      },
      [addModal, storiesSelected, rmModal, setStoriesSelected]
    ),
    onDownload = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoreDownload key={key}
                                            stories={[story]}
                                            onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
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
      onDownload={onDownload}
      onDownloadSelected={onDownloadSelected}
      additionalHeaderButtons={additionalHeaderButtons}
      isLoading={!stories.length}/>
    {
      storeData !== null &&
      <ButtonExternalLink href={storeData.banner.link}>
        <div className={styles.bannerContainer} style={{background: storeData.banner.background}}>
          <div className={styles.bannerInnerContainer}>
            <img className={styles.banner} src={storeData.banner.image} alt=""/>
          </div>
        </div>
      </ButtonExternalLink>
    }
  </>
}

export default StorePacksListContent
