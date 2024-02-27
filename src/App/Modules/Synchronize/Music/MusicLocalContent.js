import { useCallback, useMemo } from 'react'
import { useLocalMusic } from '../../../Components/LocalMusic/LocalMusicHooks.js'
import MusicTable from './MusicTable.js'
import { useTelmiOS } from '../../../Components/TelmiOS/TelmiOSHooks.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedMusics, selectedMusics}) {
  const
    localMusics = useLocalMusic(),
    {music: telmiOSmusics} = useTelmiOS(),

    musics = useMemo(
      () => {
        const tMusics = telmiOSmusics.map((m) => m.id)
        return localMusics.map((m) => ({...m, cellDisabled: tMusics.includes(m.id)}))
      },
      [localMusics, telmiOSmusics]
    ),

    onEdit = useCallback((music) => ipcRenderer.send('local-musics-update', [music]), []),
    onEditSelected = useCallback((musics) => ipcRenderer.send('local-musics-update', musics), []),
    onDelete = useCallback((musicsIds) => ipcRenderer.send('local-musics-delete', musicsIds), [])

  return <MusicTable musics={musics}
                     onEdit={onEdit}
                     onEditSelected={onEditSelected}
                     onDelete={onDelete}
                     setSelectedMusics={setSelectedMusics}
                     selectedMusics={selectedMusics}/>
}

export default StoriesLocalContent
