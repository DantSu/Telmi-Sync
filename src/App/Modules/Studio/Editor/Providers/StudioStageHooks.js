import { useContext } from 'react'
import StudioStageContext from './StudioStageContext.js'

const useStudioStage = () => useContext(StudioStageContext)

export { useStudioStage }
