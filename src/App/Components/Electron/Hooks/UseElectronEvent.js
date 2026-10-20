import {useCallback, useEffect} from 'react'

const {ipcRenderer} = window.require('electron')

const
  useElectronEmitter = (channel, dataToSend, refreshList) => {
    const rf = refreshList || dataToSend
    useEffect(
      () => {
        ipcRenderer.send(channel, ...dataToSend)
      },
      [channel, ...rf] // eslint-disable-line
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

export {useElectronListener, useElectronEmitter}
