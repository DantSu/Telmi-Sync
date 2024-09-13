import {useRef} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'

import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'

import Form from '../../../Components/Form/Form.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import MusicFormImageCover from './MusicFormImageCover.js'

function ModalMusicsFormUpdate({musics, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    albumRef = useRef(),
    artistRef = useRef(),
    coverRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('musics-edit')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('album')}
                       key="music-album"
                       id="music-album"
                       defaultValue={musics[0].album}
                       required={true}
                       ref={albumRef}/>
            <InputText label={getLocale('artist')}
                       key="music-artist"
                       id="music-artist"
                       defaultValue={musics[0].artist}
                       required={true}
                       ref={artistRef}/>
            <MusicFormImageCover artistInput={artistRef}
                                 albumInput={albumRef}
                                 defaultImage={musics[0].image}
                                 ref={coverRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [albumRef, artistRef, coverRef],
                                     (values) => {
                                       onValidate(
                                         musics.map((music) => ({
                                           ...music,
                                           album: values[0],
                                           artist: values[1],
                                           newImage: values[2]
                                         }))
                                       )
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

export default ModalMusicsFormUpdate
