import { createContext } from 'react'

const StudioStageContext = createContext({
  form: null,
  setForm: (formName) => {},
  find: null,
  setFind: (stageKey) => {}
})


export default StudioStageContext
