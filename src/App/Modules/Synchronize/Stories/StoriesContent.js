import { useState } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import Table from '../../../Components/Table/Table.js'
import StoriesLocalContent from './StoriesLocalContent.js'

import styles from '../Synchronize.module.scss'
function StoriesContent () {
  const
    {getLocale} = useLocale(),
    [selectedLocalStories, setSelectedLocalStories] = useState([])

  return <>
    <Table className={styles.leftCol} titleLeft={getLocale('telmi-not-detected')} data={[]}/>
    <StoriesLocalContent setSelectedLocalStories={setSelectedLocalStories}
                         selectedLocalStories={selectedLocalStories}/>
  </>
}

export default StoriesContent
