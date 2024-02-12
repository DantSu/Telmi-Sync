import React, { useCallback, useMemo } from 'react'

const {ipcRenderer} = window.require('electron')

function ButtonExternalLink ({href, children}) {
  const
    onClick = useCallback(
      (e) => {
        e.preventDefault()
        ipcRenderer.send('new-window', href)
      },
      [href]
    ),
    childHref = useMemo(
      () => React.Children.map(
        children,
        (child) => React.cloneElement(child, {onClick})
      ),
      [children, onClick]
    )

  return <>{childHref}</>

}

export default ButtonExternalLink
