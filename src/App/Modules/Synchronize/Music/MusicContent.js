import { useState } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import Table from '../../../Components/Table/Table.js'
import MusicLocalContent from './MusicLocalContent.js'

import styles from '../Synchronize.module.scss'

function MusicContent () {
  const
    [selectedLocalMusics, setSelectedLocalMusics] = useState([]),
    {getLocale} = useLocale()

  return <>
    <Table className={styles.leftCol}
           titleLeft={getLocale('telmi-not-detected')}
           data={[]}/>
    <MusicLocalContent setSelectedLocalMusics={setSelectedLocalMusics}
                       selectedLocalMusics={selectedLocalMusics}/>
  </>
}

export default MusicContent
