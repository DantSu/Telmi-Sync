const
  routeStudio = {module: 'Studio', params: {}},
  getRouteStudio = (story) => ({...routeStudio, params: {story}})

export {routeStudio, getRouteStudio}
