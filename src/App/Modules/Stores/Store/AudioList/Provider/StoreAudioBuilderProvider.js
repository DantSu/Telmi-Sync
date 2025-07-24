import {useMemo, useState} from 'react'
import {getDefaultCategory} from './StoreBuilderHelpers.js'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'

import StoreAudioBuilderProviderContext from './StoreAudioBuilderProviderContext.js'

function StoreAudioBuilderProvider ({children}) {
  const
    {getLocale} = useLocale(),
    [audioList, setAudioList] = useState(() => getDefaultCategory('', getLocale('which-story'))),
    value = useMemo(() => ({audioList, setAudioList}), [audioList])

  return <StoreAudioBuilderProviderContext.Provider value={value}>{children}</StoreAudioBuilderProviderContext.Provider>
}

export default StoreAudioBuilderProvider
