import { useMemo, useState } from 'react'
import RouterContext from './RouterContext.js'
import * as Routes from './Routes.js'

function RouterProvider ({defaultRoute}) {
  const
    [route, setRoute] = useState(defaultRoute),
    value = useMemo(
      () => ({
        setRoute: (route) => {
          if (typeof route === 'string' && Routes[route] !== undefined) {
            setRoute({module: route, params: {}})
          } else if (typeof route === 'object' && route !== null && typeof route.module === 'string' && Routes[route.module] !== undefined) {
            setRoute(typeof route.params === 'object' && route.params !== null ? route : {...route, params: {}})
          }
        }
      }),
      [setRoute]
    ),
    ComponentToRender = Routes[route.module]

  return <RouterContext.Provider value={value}>
    <ComponentToRender {...route.params}/>
  </RouterContext.Provider>
}

export default RouterProvider
