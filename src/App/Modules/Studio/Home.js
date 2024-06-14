import TopBar from '../../Layout/TopBar/TopBar.js'
import AppContainer from '../../Layout/Container/AppContainer.js'
import StudioContainer from './StudioContainer.js'


function Studio() {
  return <>
    <TopBar currentModule="Studio"/>
    <StudioContainer/>
  </>
}

export default Studio