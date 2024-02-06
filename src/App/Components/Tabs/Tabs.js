import { useEffect, useState } from 'react'
import Tab from './Tab.js'

import styles from './Tabs.module.scss'

function Tabs ({className, tabs}) {
  const
    [currentTab, setTab] = useState(tabs[0] || {}),
    DisplayedComponent = currentTab.content

  useEffect(
    () => {
      if (!tabs.find((t) => t === currentTab)) {
        console.log('reset')
        setTab(tabs[0] || {})
      }
    },
    [tabs, currentTab]
  )

  return <div className={[className, styles.container].join(' ')}>
    <ul className={styles.tabs}>{
      tabs.map((tab, i) => (<Tab key={'tab-' + i}
                                 button={tab.tab}
                                 selected={currentTab === tab}
                                 onClick={() => {
                                   setTab(tab)
                                   console.log('click')
                                 }}/>))
    }</ul>
    <div className={styles.content}>
      {DisplayedComponent && <DisplayedComponent/>}
    </div>
  </div>
}

export default Tabs
