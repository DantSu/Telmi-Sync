import {useRef} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import ModalStoreBuild from './ModalStoreBuild.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../Components/Form/Input/InputTextarea.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

import styles from './Store.module.scss'

function ModalStoreBuildForm({store, stories, onClose}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    titleRef = useRef(),
    categoryRef = useRef(),
    descriptionRef = useRef()

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
                       classNameInput={styles.inputWide}
                       required={true}
                       defaultValue={store.title}
                       ref={titleRef}/>
            <InputText label={getLocale('category')}
                       key="store-category"
                       id="store-category"
                       classNameInput={styles.inputWide}
                       required={false}
                       defaultValue={store.copyright}
                       ref={categoryRef}/>
            <InputTextarea label={getLocale('description')}
                           key="store-description"
                           id="store-description"
                           classNameInput={styles.inputWide}
                           type="url"
                           required={false}
                           defaultValue={store.description + '\n\n' + stories.map((s) => '- ' + s.title).join('\n')}
                           ref={descriptionRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [titleRef, categoryRef, descriptionRef],
                                     (values) => {
                                       onClose()
                                       addModal((key) => {
                                         const modal = <ModalStoreBuild key={key}
                                                                        question={getLocale('which-story')}
                                                                        store={{
                                                                          title: values[0],
                                                                          category: values[1],
                                                                          description: values[2],
                                                                          cover: stories[0].image
                                                                        }}
                                                                        stories={stories}
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

export default ModalStoreBuildForm
