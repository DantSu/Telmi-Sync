import { useContext } from 'react'
import StudioFormContext from './StudioStageContext.js'

const useStudioForm = () => useContext(StudioFormContext)

export { useStudioForm }
