import { useState } from 'react'
import Table from '../../../Components/Table/Table.js'
import StoriesLocalContent from './StoriesLocalContent.js'

import styles from '../Synchronize.module.scss'
function StoriesContent () {
  const
    [selectedLocalStories, setSelectedLocalStories] = useState([])

  return <>
    <Table className={styles.leftCol} titleLeft="Telmi OS non détecté" data={[]}/>
    <StoriesLocalContent setSelectedLocalStories={setSelectedLocalStories}
                         selectedLocalStories={selectedLocalStories}/>
  </>
}

export default StoriesContent
