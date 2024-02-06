import TopBar from '../../Layout/TopBar/TopBar.js'
import AppContainer from '../../Layout/Container/AppContainer.js'
import Tabs from '../../Components/Tabs/Tabs.js'

import StoriesTab from './Stories/StoriesTab.js'
import StoriesContent from './Stories/StoriesContent.js'
import MusicTab from './Music/MusicTab.js'
import MusicContent from './Music/MusicContent.js'

import styles from './Synchronize.module.scss'
import Import from '../Import/Import.js'

const tabs = [
  {tab: StoriesTab, content: StoriesContent},
  {tab: MusicTab, content: MusicContent},
]

function SynchronizeHome () {
  return <Import>
    <TopBar currentModule="Synchronize"/>
    <AppContainer>
      <p className={styles.tooltip}>Pour importer vos histoires ou mp3, déposez les ici.</p>
      <Tabs className={styles.tabs} tabs={tabs}/>
    </AppContainer>
  </Import>
}

export default SynchronizeHome
