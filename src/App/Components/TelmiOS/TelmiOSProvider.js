import { useEffect, useMemo, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import TelmiOSContext from './TelmiOSContext.js'
import { useModal } from '../Modal/ModalHooks.js'
import ModalElectronTaskVisualizer from '../Electron/Modal/ModalElectronTaskVisualizer.js'

const telmiOSToString = (telmiOS) => {
  return telmiOS === null ?
    '' :
    telmiOS.drive + '_' + telmiOS.telmiOS.label + '-v' + telmiOS.telmiOS.version.major + '.' + telmiOS.telmiOS.version.minor + '.' + telmiOS.telmiOS.version.fix
}

function TelmiOSProvider ({children}) {
  const
    [telmiOS, setTelmiOS] = useState(null),
    [diskusage, setDiskusage] = useState(null),
    [stories, setStories] = useState([]),
    [music, setMusic] = useState([]),
    {addModal, rmModal} = useModal(),
    data = useMemo(() => ({...telmiOS, diskusage, stories, music}), [telmiOS, diskusage, stories, music])

  useElectronListener(
    'telmios-data',
    (t) => {
      if (telmiOSToString(t) !== telmiOSToString(telmiOS)) {
        setTelmiOS(t)
        if(t === null) {
          setDiskusage(null)
          setStories([])
          setMusic([])
        }
      }
    },
    [setTelmiOS, telmiOS]
  )

  useElectronListener('telmios-diskusage-data', (du) => setDiskusage(du), [setDiskusage])
  useElectronEmitter('telmios-diskusage', [telmiOS])

  useEffect(
    () => {
      if (telmiOS !== null) {
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="telmios-update"
                                                     dataSent={[telmiOS]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      }
    },
    [telmiOS, addModal, rmModal]
  )

  useElectronListener('telmios-stories-data', (telmiOSStories) => setStories(telmiOSStories), [setStories])
  useElectronEmitter('telmios-stories-get', [telmiOS])

  useElectronListener('telmios-musics-data', (telmiOSMusics) => setMusic(telmiOSMusics), [setMusic])
  useElectronEmitter('telmios-musics-get', [telmiOS])

  return <TelmiOSContext.Provider value={data}>{children}</TelmiOSContext.Provider>
}

export default TelmiOSProvider
