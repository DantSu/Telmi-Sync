import {useMemo, useState} from 'react'
import StudioFormContext from './StudioStageContext.js'

function StudioStageProvider ({children}) {
  const 
    [form, setForm] = useState(null),
    value = useMemo(() => ({form, setForm}), [form])

  return <StudioFormContext.Provider value={value}>{children}</StudioFormContext.Provider>
}

export default StudioStageProvider
