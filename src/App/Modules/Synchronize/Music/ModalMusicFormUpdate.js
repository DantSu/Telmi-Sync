import { useRef } from 'react'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import ButtonIconTextImage from '../../../Components/Buttons/IconsTexts/ButtonIconTextImage.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalMusicFormUpdate ({music, onValidate, onClose}) {
  const
    trackRef = useRef(),
    titleRef = useRef(),
    albumRef = useRef(),
    artistRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>Editer la musique :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label="Track"
                       type="number"
                       defaultValue={music.track}
                       required={true}
                       ref={trackRef}
                       min={0}
                       max={99}
                       step={1}/>
            <InputText label="Titre"
                       defaultValue={music.title}
                       required={true}
                       ref={titleRef}/>
            <InputText label="Album"
                       defaultValue={music.album}
                       required={true}
                       ref={albumRef}/>
            <InputText label="Artist"
                       defaultValue={music.artist}
                       required={true}
                       ref={artistRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextImage text={<>Enregistrer et <br/>actualiser l'image</>}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [trackRef, titleRef, albumRef, artistRef],
                                     (values) => {
                                       onValidate({
                                         ...music,
                                         track: parseInt(values[0], 10),
                                         title: values[1],
                                         album: values[2],
                                         artist: values[3],
                                         askNewImage: true
                                       })
                                       onClose()
                                     }
                                   )
                                 }}/>
            <ButtonIconTextCheck text="Enregistrer"
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [trackRef, titleRef, albumRef, artistRef],
                                     (values) => {
                                       onValidate({
                                         ...music,
                                         track: parseInt(values[0], 10),
                                         title: values[1],
                                         album: values[2],
                                         artist: values[3],
                                         askNewImage: false
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
