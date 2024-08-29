import {useRef} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'

import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'

import Form from '../../../Components/Form/Form.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import MusicFormImageCover from './MusicFormImageCover.js'

function ModalMusicFormUpdate({music, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    trackRef = useRef(),
    titleRef = useRef(),
    albumRef = useRef(),
    artistRef = useRef(),
    coverRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('music-edit')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('track')}
                       key="music-track"
                       id="music-track"
                       type="number"
                       defaultValue={music.track}
                       required={true}
                       ref={trackRef}
                       min={0}
                       max={99}
                       step={1}/>
            <InputText label={getLocale('title')}
                       id="music-title"
                       key="music-title"
                       defaultValue={music.title}
                       required={true}
                       ref={titleRef}/>
            <InputText label={getLocale('album')}
                       id="music-album"
                       key="music-album"
                       defaultValue={music.album}
                       required={true}
                       ref={albumRef}/>
            <InputText label={getLocale('artist')}
                       id="music-artist"
                       key="music-artist"
                       defaultValue={music.artist}
                       required={true}
                       ref={artistRef}/>
            <MusicFormImageCover music={music}
                                 ref={coverRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [trackRef, titleRef, albumRef, artistRef, coverRef],
                                     (values) => {
                                       onValidate({
                                         ...music,
                                         track: parseInt(values[0], 10),
                                         title: values[1],
                                         album: values[2],
                                         artist: values[3],
                                         newImage: values[4]
                                       })
                                       onClose()
                                     }
                                   )
                                 }}/>
          </ButtonsContainer>
        </>
      }
    }</Form>
  </ModalLayoutPadded>
}

export default ModalMusicFormUpdate
