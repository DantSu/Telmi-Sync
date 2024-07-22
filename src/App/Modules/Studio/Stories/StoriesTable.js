import {useCallback, useMemo} from 'react'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import AppContainer from '../../../Layout/Container/AppContainer.js'
import ModalPlayerLauncher from '../Player/ModalPlayerLauncher.js'

function StudioStoriesTable({setStory}) {
  const
    {addModal, rmModal} = useModal(),
    {getLocale} = useLocale(),
    localStories = useLocalStories(),
    tableStories = useMemo(
      () => {
        return localStories.map((s) => ({
          ...s,
          cellId: s.uuid || s.title,
          cellTitle: (s.age !== undefined ? s.age + '+] ' : '') + s.title,
        }))
      },
      [localStories]
    ),
    onPlay = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalPlayerLauncher key={'modal-launcher-' + key}
                                             storyMetadata={story}
                                             onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),
    onEdit = useCallback((story) => setStory(story), [setStory]),
    onAdd = useCallback(() => setStory({}), [setStory])

  return <AppContainer>
    <Table titleLeft={getLocale('stories-local', tableStories.length)}
           data={tableStories}
           onEdit={onEdit}
           onAdd={onAdd}
           onPlay={onPlay}
           isLoading={false}/>
  </AppContainer>
}

export default StudioStoriesTable
