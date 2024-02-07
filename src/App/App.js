import { routeDownloadFFmpeg } from './Modules/DownloadFFmpeg/Routes.js'
import ModalProvider from './Components/Modal/ModalProvider.js'
import RouterProvider from './Router/RouterProvider.js'
import LocalStoriesProvider from './Components/LocalStories/LocalStoriesProvider.js'
import LocalMusicProvider from './Components/LocalMusic/LocalMusicProvider.js'
import LocaleProvider from './Components/Locale/LocaleProvider.js'

import './App.scss'

function App () {
  return <LocaleProvider>
    <ModalProvider>
      <LocalStoriesProvider>
        <LocalMusicProvider>
          <RouterProvider defaultRoute={routeDownloadFFmpeg}/>
        </LocalMusicProvider>
      </LocalStoriesProvider>
    </ModalProvider>
  </LocaleProvider>
}

export default App
