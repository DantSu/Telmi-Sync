import {useCallback, useEffect, useState} from 'react'
import {useTelmiSyncParams} from '../TelmiSyncParams/TelmiSyncParamsHooks.js'
import ButtonIconMicrophone from '../Buttons/Icons/ButtonIconMicrophone.js'
import ButtonIconCircle from '../Buttons/Icons/ButtonIconCircle.js'

import styles from './Audio.module.scss'

function AudioRecord({title, onRecordEnded, className}) {
  const
    [isRecording, setIsRecording] = useState(false),
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
                  let chunks = [];
                  mr.ondataavailable = (e) => {
                    chunks.push(e.data)
                  }
                  mr.onstop = (e) => {
                    onRecordEnded(window.URL.createObjectURL(new Blob(chunks, {type: "audio/mp3"})))
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
      [isRecording, mediaRecorder, onRecordEnded, params.microphone]
    )


  useEffect(
    () => () => {
      if (mediaRecorder !== null) {
        mediaRecorder.stop();
        setMediaRecorder(null)
      }
    },
    [mediaRecorder]
  )

  return isRecording ?
    <ButtonIconCircle className={[styles.active, className].join(' ')} title={title} onClick={onRecord}/> :
    <ButtonIconMicrophone className={className} title={title} onClick={onRecord}/>
}

export default AudioRecord