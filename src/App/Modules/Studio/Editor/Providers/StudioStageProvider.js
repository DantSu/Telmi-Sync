import {useMemo, useState} from 'react'
import StudioStageContext from './StudioStageContext.js'

function StudioStageProvider ({children}) {
  const 
    [form, setForm] = useState(null),
    [find, setFind] = useState(null),
    value = useMemo(() => ({form, setForm, find, setFind}), [find, form])

  return <StudioStageContext.Provider value={value}>{children}</StudioStageContext.Provider>
}

export default StudioStageProvider
