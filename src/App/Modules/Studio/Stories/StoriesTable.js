import {useCallback, useMemo} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import AppContainer from '../../../Layout/Container/AppContainer.js'

function StudioStoriesTable({setStory}) {
  const
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
    onEdit = useCallback((story) => setStory(story), [setStory])

  return <AppContainer>
    <Table titleLeft={getLocale('stories-local', tableStories.length)}
           data={tableStories}
           onEdit={onEdit}
           isLoading={!tableStories.length}/>
  </AppContainer>
}

export default StudioStoriesTable
