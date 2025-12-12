import {routeDownloadFFmpeg} from './Modules/DownloadFFmpeg/Routes.js'
import ModalProvider from './Components/Modal/ModalProvider.js'
import RouterProvider from './Router/RouterProvider.js'
import LocalStoriesProvider from './Components/LocalStories/LocalStoriesProvider.js'
import LocalMusicProvider from './Components/LocalMusic/LocalMusicProvider.js'
import LocaleProvider from './Components/Locale/LocaleProvider.js'
import TelmiOSProvider from './Components/TelmiOS/TelmiOSProvider.js'
import TelmiSyncParamsProvider from './Components/TelmiSyncParams/TelmiSyncParamsProvider.js'
import ErrorListener from './Components/ErrorListener/ErrorListener.js'

import './App.scss'

function App() {
  return <LocaleProvider>
    <TelmiSyncParamsProvider>
      <ModalProvider>
        <TelmiOSProvider>
          <LocalStoriesProvider>
            <LocalMusicProvider>
              <RouterProvider defaultRoute={routeDownloadFFmpeg}/>
            </LocalMusicProvider>
          </LocalStoriesProvider>
        </TelmiOSProvider>
        <ErrorListener/>
      </ModalProvider>
    </TelmiSyncParamsProvider>
  </LocaleProvider>
}

export default App
