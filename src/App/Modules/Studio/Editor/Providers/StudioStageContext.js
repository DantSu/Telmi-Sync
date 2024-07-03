import { createContext } from 'react'

const StudioFormContext = createContext({
  form: null,
  setForm: (formName) => {}
})


export default StudioFormContext
