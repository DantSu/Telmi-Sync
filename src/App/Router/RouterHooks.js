import { useContext } from 'react'
import RouterContext from './RouterContext.js'

const useRouter = () => useContext(RouterContext).setRoute

export { useRouter }
