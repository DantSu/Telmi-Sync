import { useCallback, useEffect } from 'react'

const {ipcRenderer} = window.require('electron')

const
  useElectronEmitter = (channel, refreshList) => {
    useEffect(
      () => {
        ipcRenderer.send(channel, ...refreshList)
      },
      [channel, ...refreshList] // eslint-disable-line
    )
  },
  useElectronListener = (channel, effectCallable, dependencyList) => {
    const callback = useCallback(effectCallable, dependencyList) // eslint-disable-line

    useEffect(
      () => {
        const listener = (e, ...args) => {
          callback(...args)
        }

        ipcRenderer.on(channel, listener)
        return () => {
          ipcRenderer.off(channel, listener)
        }
      },
      [channel, callback]
    )
  }

export { useElectronListener, useElectronEmitter }
