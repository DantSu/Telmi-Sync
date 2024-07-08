import {forwardRef, useCallback, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'
import AudioPlayer from '../../Audio/AudioPlayer.js'
import AudioRecord from '../../Audio/AudioRecord.js'
import AudioTTS from '../../Audio/AudioTTS.js'

import styles from './Input.module.scss'


function InputAudio({label, id, textTTS, required, className, onChange, audio, ...props}, ref) {
  const
    {getLocale} = useLocale(),
    [audioPath, setAudioPath] = useState(audio),
    onRecordEnded = useCallback(
      (path) => {
        setAudioPath(path)
        typeof onChange === 'function' && onChange(path)
      },
      [onChange]
    ),
    onChangeCallback = useCallback(
      (e) => {
        if (!e.target.files.length || e.target.files[0].type.indexOf('audio/') !== 0) {
          e.target.value = null
        } else {
          setAudioPath(e.target.files[0].path)
          typeof onChange === 'function' && onChange(e.target.files[0].path)
        }
      },
      [onChange]
    ),
    refCallback = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            if (r.required && !audioPath) {
              return getLocale('input-required', label)
            }
            return null
          }
          r.getValue = () => {
            if (audioPath) {
              return audioPath
            }
            return null
          }
          ref.current = r
        }
      },
      [ref, label, getLocale, audioPath]
    )

  return <InputLayout label={label}
                      id={id}
                      required={required}
                      className={styles.containerVertical}>
    <div className={styles.inputAudioContainer}>
      {
        audioPath && <AudioPlayer audioPath={audioPath}
                                  className={styles.inputAudioButton}
                                  title={getLocale('listen')}/>
      }
      <AudioRecord className={styles.inputAudioButton}
                   title={getLocale('record')}
                   onRecordEnded={onRecordEnded}/>
      <AudioTTS className={styles.inputAudioButton}
                text={textTTS}
                title={getLocale('text-to-speech')}
                onTTSEnded={onRecordEnded}/>
      <div className={styles.inputAudioFile}>
        <input {...props}
               type="file"
               accept=".mp3, .ogg, .flac, .wav, .wma, .mp4a"
               onChange={onChangeCallback}
               className={[styles.inputAudio, className].join(' ')}
               required={required}
               id={id}
               ref={refCallback}/>
      </div>
    </div>
  </InputLayout>
}

export default forwardRef(InputAudio)
