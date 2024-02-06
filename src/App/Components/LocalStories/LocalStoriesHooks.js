import { useContext } from 'react'
import LocalStoriesContext from './LocalStoriesContext.js'

const useLocalStories = () => useContext(LocalStoriesContext).stories

export { useLocalStories }
