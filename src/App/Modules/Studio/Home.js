import TopBar from '../../Layout/TopBar/TopBar.js'
import StudioStoryEditor from './Editor/StudioStoryEditor.js'
import {useEffect} from 'react'

const {ipcRenderer} = window.require('electron')

function Studio({story}) {
  useEffect(() => () => {
    ipcRenderer.send('local-stories-get')
  }, [])

  return <>
    <TopBar currentModule="Studio"/>
    <StudioStoryEditor story={story}/>
  </>
}

export default Studio