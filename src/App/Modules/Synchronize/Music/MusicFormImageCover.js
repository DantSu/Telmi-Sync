import {forwardRef, useCallback, useEffect, useState} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useElectronListener} from '../../../Components/Electron/Hooks/UseElectronEvent.js'

import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'
import InputImage from '../../../Components/Form/Input/InputImage.js'
import ButtonIconTextDownload from '../../../Components/Buttons/IconsTexts/ButtonIconTextDownload.js'

import styles from './Music.module.scss'

function MusicFormImageCover({music}, ref) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [newImage, setNewImage] = useState(),

    onImageChange = useCallback((path) => { setNewImage(path) }, []),
    onImageDownload = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="local-musics-cover"
                                                     dataSent={[{artist: music.artist, album: music.album}]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal, music.artist, music.album]
    )

  useEffect(
    () => {
      ref.current = {
        checkValue: () => null,
        getValue: () => newImage
      }
    },
    [ref, newImage]
  )

  useElectronListener('local-musics-cover-path', (imagePath) => { setNewImage(imagePath) }, [])

  return <>
    <InputImage label={<>
      {getLocale('picture-cover')}
      <ButtonIconTextDownload text={getLocale('music-search-cover')}
                              className={styles.inputCover}
                              rounded={true}
                              onClick={onImageDownload}/>
    </>}
                key={'music-cover' + newImage}
                id="music-cover"
                defaultValue={newImage || music.image.substring(0, music.image.indexOf('?'))}
                onChange={onImageChange}
                width={256}
                height={256}
                displayScale={0.5}/>
  </>
}

export default forwardRef(MusicFormImageCover)