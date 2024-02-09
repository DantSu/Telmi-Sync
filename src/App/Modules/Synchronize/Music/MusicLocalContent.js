import { useCallback } from 'react'
import { useLocalMusic } from '../../../Components/LocalMusic/LocalMusicHooks.js'
import MusicTable from './MusicTable.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedMusics, selectedMusics}) {
  const
    localMusics = useLocalMusic(),
    onEdit = useCallback((music) => ipcRenderer.send('local-musics-update', [music]), []),
    onEditSelected = useCallback((musics) => ipcRenderer.send('local-musics-update', musics), []),
    onDelete = useCallback((musicsIds) => ipcRenderer.send('local-musics-delete', musicsIds), [])

  return <MusicTable musics={localMusics}
                     onEdit={onEdit}
                     onEditSelected={onEditSelected}
                     onDelete={onDelete}
                     setSelectedMusics={setSelectedMusics}
                     selectedMusics={selectedMusics}/>
}

export default StoriesLocalContent
