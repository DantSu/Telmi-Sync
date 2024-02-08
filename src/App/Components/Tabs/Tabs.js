import { useEffect, useState } from 'react'
import Tab from './Tab.js'

import styles from './Tabs.module.scss'

function Tabs ({className, tabs}) {
  const
    [currentTab, setTab] = useState(tabs[0] || {}),
    DisplayedComponent = currentTab.content

  useEffect(
    () => {
      if (tabs.length && tabs.find((t) => t === currentTab) === undefined) {
        setTab(tabs[0])
      }
    },
    [tabs, currentTab, setTab]
  )

  return <div className={[className, styles.container].join(' ')}>
    <ul className={styles.tabs}>{
      tabs.map((tab, i) => (<Tab key={'tab-' + i}
                                 button={tab.tab}
                                 selected={currentTab === tab}
                                 onClick={() => setTab(tab)}/>))
    }</ul>
    <div className={styles.content}>
      {DisplayedComponent && <DisplayedComponent/>}
    </div>
  </div>
}

export default Tabs
