import TopBar from '../../Layout/TopBar/TopBar.js'
import StudioStoryEditor from './Editor/StudioStoryEditor.js'


function Studio({story}) {
  return <>
    <TopBar currentModule="Studio"/>
    <StudioStoryEditor story={story}/>
  </>
}

export default Studio