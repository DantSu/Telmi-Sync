import { useState } from 'react'
import Table from '../../../Components/Table/Table.js'
import MusicLocalContent from './MusicLocalContent.js'

import styles from '../Synchronize.module.scss'

function MusicContent () {
  const
    [selectedLocalMusic, setSelectedLocalMusic] = useState([])

  return <>
    <Table className={styles.leftCol} titleLeft="Telmi OS non détecté" data={[]}/>
    <MusicLocalContent setSelectedLocalMusic={setSelectedLocalMusic}
                       selectedLocalMusic={selectedLocalMusic}/>
  </>
}

export default MusicContent
