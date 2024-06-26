import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import ButtonIconTextImage from '../../../Components/Buttons/IconsTexts/ButtonIconTextImage.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalMusicsFormUpdate ({musics, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    albumRef = useRef(),
    artistRef = useRef()

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
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextImage text={getLocale('music-save-refresh-cover')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [albumRef, artistRef],
                                     (values) => {
                                       onValidate(
                                         musics.map((music) => ({
                                           ...music,
                                           album: values[0],
                                           artist: values[1],
                                           askNewImage: true
                                         }))
                                       )
                                       onClose()
                                     }
                                   )
                                 }}/>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [albumRef, artistRef],
                                     (values) => {
                                       onValidate(
                                         musics.map((music) => ({
                                           ...music,
                                           album: values[0],
                                           artist: values[1],
                                           askNewImage: false
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
