import {useMemo, useState} from 'react'
import { useElectronEmitter, useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import TelmiSyncParamsContext from './TelmiSyncParamsContext.js'

const {ipcRenderer} = window.require('electron')

const saveParams = (params) => ipcRenderer.send('telmi-sync-params-save', params)

function TelmiSyncParamsProvider ({children}) {
  const
    [params, setParams] = useState(null),
    value = useMemo(() => ({params, saveParams}), [params])

  useElectronListener('telmi-sync-params', (p) => setParams(p), [])
  useElectronEmitter('telmi-sync-params-get', [])

  return <TelmiSyncParamsContext.Provider value={value}>{children}</TelmiSyncParamsContext.Provider>
}

export default TelmiSyncParamsProvider
