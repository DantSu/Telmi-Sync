import React, {useMemo} from 'react'

const {ipcRenderer} = window.require('electron')

function ButtonExternalLink({href, children}) {
  return useMemo(
    () => {
      const onClick = (e) => {
        e.preventDefault()
        ipcRenderer.send('new-window', href)
      }
      return React.Children.map(children, (child) => React.cloneElement(child, {onClick}))
    },
    [children, href]
  )
}

export default ButtonExternalLink
