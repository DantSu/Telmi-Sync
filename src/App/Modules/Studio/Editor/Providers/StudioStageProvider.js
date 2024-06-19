import { useState } from 'react'
import StudioStageContext from './StudioStageContext.js'

function StudioStageProvider ({children}) {
  const [stage, setStage] = useState(null)
  return <StudioStageContext.Provider value={{stage, setStage}}>{children}</StudioStageContext.Provider>
}

export default StudioStageProvider
