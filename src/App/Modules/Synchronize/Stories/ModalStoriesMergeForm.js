import {useRef} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'

import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import Form from '../../../Components/Form/Form.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import InputImage from '../../../Components/Form/Input/InputImage.js'
import FormMessageWarning from '../../../Components/Form/Message/FormMessageWarning.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'

import ModalStoriesMergeTask from './ModalStoriesMergeTask.js'

function ModalStoriesMergeForm({stories, onClose}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    inputTitleRef = useRef(),
    inputAgeRef = useRef(),
    inputCategoryRef = useRef(),
    inputImageRef = useRef(),
    inputCoverRef = useRef(),
    question = getLocale('what-listen'),
    pathTitleImage = stories[0].image.substring(0, stories[0].image.length - 9) + 'title.png'

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('stories-merge')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('title')}
                       key="story-title"
                       id="story-title"
                       defaultValue={stories[0].title || 0}
                       required={true}
                       ref={inputTitleRef}/>
            <InputText label={getLocale('age')}
                       key="story-age"
                       id="story-age"
                       type="number"
                       step="1"
                       min="0"
                       max="99"
                       defaultValue={stories[0].age || 0}
                       required={false}
                       ref={inputAgeRef}/>
            <InputText label={getLocale('category')}
                       key="story-category"
                       id="story-category"
                       defaultValue={stories[0].category || ''}
                       required={false}
                       ref={inputCategoryRef}/>
            <InputImage label={getLocale('picture-title')}
                        key={'story-image'}
                        id="story-image"
                        defaultValue={pathTitleImage}
                        width={640}
                        height={480}
                        displayScale={0.3}
                        ref={inputImageRef}/>
            <InputImage label={getLocale('picture-cover')}
                        key={'story-cover'}
                        id="story-cover"
                        defaultValue={stories[0].image}
                        width={512}
                        height={512}
                        displayScale={0.3}
                        ref={inputCoverRef}/>
            <FormMessageWarning>{getLocale('stories-merge-warning')}</FormMessageWarning>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('stories-merge')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       inputTitleRef,
                                       inputAgeRef,
                                       inputCategoryRef,
                                       inputImageRef,
                                       inputCoverRef
                                     ],
                                     (values) => {
                                       addModal((key) => {
                                         const modal = <ModalStoriesMergeTask key={key}
                                                                              story={{
                                                                                title: values[0],
                                                                                age: values[1],
                                                                                category: values[2],
                                                                                image: values[3] || pathTitleImage,
                                                                                cover: values[4] || stories[0].image,
                                                                                question,
                                                                                stories
                                                                              }}
                                                                              onClose={() => rmModal(modal)}/>
                                         return modal
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

export default ModalStoriesMergeForm