import {useCallback, useEffect, useState} from 'react'
import {useElectronListener} from '../Electron/Hooks/UseElectronEvent.js'
import {useTelmiSyncParams} from '../TelmiSyncParams/TelmiSyncParamsHooks.js'
import ButtonIconMicrophone from '../Buttons/Icons/ButtonIconMicrophone.js'
import ButtonIconCircle from '../Buttons/Icons/ButtonIconCircle.js'
import ButtonIconSpinner from '../Buttons/Icons/ButtonIconSpinner.js'

import styles from './Audio.module.scss'

const {ipcRenderer} = window.require('electron')

function AudioRecord({title, onRecordEnded, className}) {
  const
    [isRecording, setIsRecording] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    [mediaRecorder, setMediaRecorder] = useState(null),
    {params} = useTelmiSyncParams(),
    onRecord = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isRecording) {
          if (mediaRecorder !== null) {
            mediaRecorder.stop()
            setMediaRecorder(null)
            setIsRecording(false)
            setIsLoading(true)
          }
        } else {
          setIsRecording(true)
          navigator.mediaDevices.getUserMedia({
            audio: typeof params.microphone === 'string' ? {deviceId: params.microphone} : true,
            video: false
          })
            .then(stream => {
              const
                track = stream.getAudioTracks()[0],
                capabilities = track.getCapabilities()
              track
                .applyConstraints(Object.assign(
                  {},
                  capabilities.autoGainControl.includes(true) ? {autoGainControl: true} : null,
                  capabilities.channelCount.min <= 2 && capabilities.channelCount.max >= 2 ? {channelCount: 2} : null,
                  capabilities.echoCancellation.includes(true) ? {echoCancellation: true} : null,
                  capabilities.noiseSuppression.includes(true) ? {noiseSuppression: true} : null,
                  capabilities.sampleRate.min <= 44100 && capabilities.sampleRate.max >= 44100 ? {sampleRate: 44100} : null,
                  capabilities.sampleSize.min <= 16 && capabilities.sampleSize.max >= 16 ? {sampleSize: 16} : null,
                ))
                .then(() => {
                  const mr = new MediaRecorder(stream)
                  mr.start()
                  let chunks = []
                  mr.ondataavailable = (e) => {
                    chunks.push(e.data)
                  }
                  mr.onstop = () => {
                    (new Blob(chunks, {type: 'audio/webm'}))
                      .arrayBuffer()
                      .then((arr) => ipcRenderer.send('audio-record-buffer-to-file', arr))
                  }
                  setMediaRecorder(mr)
                })
                .catch(error => {
                  console.log('Error :', error)
                  setIsRecording(false)
                })
            })
            .catch(error => {
              console.log('Error :', error)
              setIsRecording(false)
            })
        }
      },
      [isRecording, mediaRecorder, params.microphone]
    )


  useEffect(
    () => () => {
      if (mediaRecorder !== null) {
        mediaRecorder.stop()
        setMediaRecorder(null)
      }
    },
    [mediaRecorder]
  )

  useElectronListener(
    'audio-record-file',
    (path) => {
      setIsLoading(false)
      typeof onRecordEnded === 'function' && onRecordEnded(path)
    },
    [onRecordEnded]
  )

  return isRecording ?
    <ButtonIconCircle className={[styles.active, className].join(' ')} title={title} onClick={onRecord}/> :
    (
      isLoading ?
        <ButtonIconSpinner className={className} title={title}/> :
        <ButtonIconMicrophone className={className} title={title} onClick={onRecord}/>
    )
}

export default AudioRecord