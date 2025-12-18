import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'

import ModalLayoutPadded from '../../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../../Components/Modal/ModalContent.js'
import ButtonsContainer from '../../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextSDCard from '../../../../Components/Buttons/IconsTexts/ButtonIconTextSDCard.js'
import ModalTelmiOSCardMakerTask from './ModalTelmiOSCardMakerTask.js'

const {ipcRenderer} = window.require('electron')

function ModalTelmiOSCardMakerRufus({onClose, drive}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('rufus-format')} :</ModalTitle>
    <ModalContent>
      <p dangerouslySetInnerHTML={{__html: getLocale('rufus-format-tutorial')}}/>
    </ModalContent>
    <ButtonsContainer>
      <ButtonIconTextSDCard text={getLocale('rufus-format')}
                            rounded={true}
                            onClick={() => ipcRenderer.send('rufus')}/>
      <ButtonIconTextSDCard text={getLocale('make')}
                            rounded={true}
                            onClick={() => {
                              addModal((key) => {
                                onClose()
                                const modal = <ModalTelmiOSCardMakerTask key={key}
                                                                         drive={drive}
                                                                         onClose={() => rmModal(modal)}/>
                                return modal
                              })
                            }}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalTelmiOSCardMakerRufus