import TopBar from '../../Layout/TopBar/TopBar.js'
import AppContainer from '../../Layout/Container/AppContainer.js'
import Tabs from '../../Components/Tabs/Tabs.js'
import TabPlus from './Add/TabPlus.js'
import { useElectronEmitter, useElectronListener } from '../../Components/Electron/Hooks/UseElectronEvent.js'
import { useState } from 'react'
import TabStore from './Store/TabStore.js'
import StoreContent from './Store/StoreContent.js'

import styles from './Stores.module.scss'

const plusTab = {tab: TabPlus, content: null}

function StoresHome () {
  const [tabs, setTabs] = useState([])

  useElectronEmitter('stores-get', [])

  useElectronListener(
    'stores-data',
    (stores) => setTabs([
      ...stores.map(
        (store) => ({
          tab: (props) => <TabStore {...props} store={store}/>,
          content: () => <StoreContent store={store}/>
        })
      ),
      plusTab
    ]),
    [setTabs]
  )

  return <>
    <TopBar currentModule="Stores"/>
    <AppContainer>
      <Tabs className={styles.tabs} tabs={tabs}/>
    </AppContainer>
  </>
}

export default StoresHome
