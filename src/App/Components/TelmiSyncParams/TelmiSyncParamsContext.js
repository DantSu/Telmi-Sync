import {createContext} from 'react'

const
  TelmiSyncParamsContext = createContext({
    params: null,
    setParams: (params) => {}
  })

export default TelmiSyncParamsContext
