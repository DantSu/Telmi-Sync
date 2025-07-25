import {useMemo, useRef} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'
import ModalStoreAudioBuilder from './ModalStoreAudioBuilder.js'
import ModalLayoutPadded from '../../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../Components/Form/Input/InputTextarea.js'
import InputSwitch from '../../../../Components/Form/Input/InputSwitch.js'
import ModalTitle from '../../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../../Components/Modal/ModalContent.js'
import Form from '../../../../Components/Form/Form.js'
import InputImage from '../../../../Components/Form/Input/InputImage.js'

const
  audioListToString = (audioList) => audioList.audio.reduce(
    (acc, a) => Array.isArray(a.audio) ? [...acc, ...audioListToString(a)] : [...acc, '- ' + a.title + ' (' + a.store + ')'],
    []
  ),
  getFirstAudioOfAudioList = (audioList) => audioList.audio.reduce(
    (acc, a) => acc !== null ? acc : (Array.isArray(a.audio) ? getFirstAudioOfAudioList(a) : a),
    null
  )


function ModalStoreAudioBuilderForm({store, audioList, onClose}) {
  console.log(audioList)
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    defaultDescription = useMemo(() => audioListToString(audioList).join('\n'), [audioList]),
    firstAudio = useMemo(() => getFirstAudioOfAudioList(audioList), [audioList]),
    titleRef = useRef(),
    categoryRef = useRef(),
    ageRef = useRef(),
    descriptionRef = useRef(),
    titleImagesRef = useRef(),
    imageRef = useRef(),
    coverRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('edit-metadata')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('title')}
                       key="store-title"
                       id="store-title"
                       required={true}
                       defaultValue={store.title}
                       ref={titleRef}/>
            <InputText label={getLocale('category')}
                       key="store-category"
                       id="store-category"
                       required={false}
                       defaultValue={store.copyright}
                       ref={categoryRef}/>
            <InputText label={getLocale('age')}
                       type="number"
                       min={0}
                       max={99}
                       step={1}
                       key="store-age"
                       id="store-age"
                       required={false}
                       defaultValue={0}
                       ref={ageRef}/>
            <InputTextarea label={getLocale('description')}
                           key="store-description"
                           id="store-description"
                           vertical={true}
                           type="url"
                           required={false}
                           defaultValue={defaultDescription}
                           ref={descriptionRef}/>
            <InputSwitch label={getLocale('story-add-title-images')}
                         key="store-confirm"
                         id="store-confirm"
                         ref={titleImagesRef}/>
            <InputImage label={getLocale('picture-title')}
                        key={'story-image'}
                        id="story-image"
                        defaultValue={firstAudio.image}
                        width={640}
                        height={480}
                        displayScale={0.3}
                        ref={imageRef}/>
            <InputImage label={getLocale('picture-cover')}
                        key={'story-cover'}
                        id="story-cover"
                        defaultValue={firstAudio.image}
                        width={512}
                        height={512}
                        displayScale={0.3}
                        ref={coverRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('stories-create-pack')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       titleRef,
                                       categoryRef,
                                       ageRef,
                                       descriptionRef,
                                       titleImagesRef,
                                       imageRef,
                                       coverRef
                                     ],
                                     (values) => {
                                       onClose()
                                       addModal((key) => {
                                         const modal = <ModalStoreAudioBuilder key={key}
                                                                               audioList={{
                                                                                 ...audioList,
                                                                                 title: values[0],
                                                                                 category: values[1],
                                                                                 age: values[2],
                                                                                 description: values[3],
                                                                                 titleImages: values[4],
                                                                                 image: values[5],
                                                                                 cover: values[6],
                                                                               }}
                                                                               onClose={() => rmModal(modal)}/>
                                         return modal
                                       })
                                     }
                                   )
                                 }}/>
          </ButtonsContainer>
        </>
      }
    }</Form>
  </ModalLayoutPadded>
}

export default ModalStoreAudioBuilderForm
