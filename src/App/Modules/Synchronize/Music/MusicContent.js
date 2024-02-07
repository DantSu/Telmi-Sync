import { useState } from 'react'
import Table from '../../../Components/Table/Table.js'
import MusicLocalContent from './MusicLocalContent.js'

import styles from '../Synchronize.module.scss'

function MusicContent () {
  const
    [selectedLocalMusics, setSelectedLocalMusics] = useState([])

  return <>
    <Table className={styles.leftCol} titleLeft="Telmi OS non détecté" data={[]}/>
    <MusicLocalContent setSelectedLocalMusics={setSelectedLocalMusics}
                       selectedLocalMusics={selectedLocalMusics}/>
  </>
}

export default MusicContent
