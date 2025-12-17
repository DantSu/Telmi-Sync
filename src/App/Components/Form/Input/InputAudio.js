import {forwardRef, useCallback, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'
import AudioPlayer from '../../Audio/AudioPlayer.js'
import AudioRecord from '../../Audio/AudioRecord.js'
import AudioTTS from '../../Audio/AudioTTS.js'
import AudioEdit from '../../Audio/AudioEdit/AudioEdit.js'
import ButtonIconXMark from '../../Buttons/Icons/ButtonIconXMark.js'
import InputDropFile from './InputDropFile.js'

import styles from './Input.module.scss'
import ButtonIconPen from '../../Buttons/Icons/ButtonIconPen.js'


function InputAudio(
  {label, id, textTTS, required, className, classNameInput, onChange, onDragOver, onDrop, audio, onDelete, ...props},
  ref
) {
  const
    {getLocale} = useLocale(),
    [audioPath, setAudioPath] = useState(audio),
    [editMode, setEditMode] = useState(false),
    onChangeCallback = useCallback(
      (path) => {
        setAudioPath(path)
        typeof onChange === 'function' && onChange(path)
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

  return <>
    <InputLayout label={label}
                 id={id}
                 required={required}
                 className={[styles.containerVertical, className].join(' ')}>
      <div className={styles.inputAudioContainer}>
        {
          audioPath && <div className={styles.playerAudioButtonContainer}>
            <AudioPlayer audioPath={audioPath}
                         className={styles.playerAudioButton}
                         title={getLocale('listen')}/>
            {onDelete && <ButtonIconXMark className={styles.deleteButton}
                                          rounded={true}
                                          title={getLocale('delete-audio')}
                                          onClick={() => {
                                            setAudioPath(null)
                                            typeof onDelete === 'function' && onDelete()
                                          }}/>}
          </div>
        }
        <AudioRecord className={styles.inputAudioButton}
                     title={getLocale('record')}
                     onRecordEnded={onChangeCallback}/>
        <AudioTTS className={styles.inputAudioButton}
                  text={textTTS}
                  title={getLocale('text-to-speech')}
                  onTTSEnded={onChangeCallback}/>
        <ButtonIconPen className={styles.inputAudioButton}
                       title={getLocale('edit')}
                       onClick={() => setEditMode((em) => !em)}/>
        <div className={styles.inputAudioFile}>
          <InputDropFile {...props}
                         mimeStart="audio/"
                         accept=".mp3, .ogg, .flac, .wav, .wma, .mp4a, .webm"
                         onChange={onChangeCallback}
                         onDragOver={onDragOver}
                         onDrop={onDrop}
                         className={classNameInput}
                         required={required}
                         id={id}
                         ref={refCallback}/>
        </div>
      </div>
    </InputLayout>
    {
      editMode && <div className={styles.editModeContainer}>
        <AudioEdit mp3Path={audioPath} setNewMp3Path={onChangeCallback}/>
      </div>
    }
  </>
}

export default forwardRef(InputAudio)
