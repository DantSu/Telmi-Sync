import {useRef, useState} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'
import {useElectronEmitter, useElectronListener} from '../../../../Components/Electron/Hooks/UseElectronEvent.js'

import ModalLayoutPadded from '../../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../../Components/Modal/ModalTitle.js'
import Form from '../../../../Components/Form/Form.js'
import ModalContent from '../../../../Components/Modal/ModalContent.js'
import InputSelect from '../../../../Components/Form/Input/InputSelect.js'
import ButtonsContainer from '../../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextSDCard from '../../../../Components/Buttons/IconsTexts/ButtonIconTextSDCard.js'
import ModalTelmiOSCardMakerConfirm from './ModalTelmiOSCardMakerConfirm.js'
import ModalTelmiOSCardMakerRufus from './ModalTelmiOSCardMakerRufus.js'


const
  toGigabytes = (bytes) => (bytes / 1073741824).toFixed(2)


function ModalTelmiOSCardMakerForm({onClose}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [drives, setDrives] = useState([]),
    inputRefDrive = useRef()

  useElectronEmitter('telmios-disklist', [])
  useElectronListener(
    'telmios-disklist-data',
    (data) => {
      setDrives(data)
    },
    []
  )

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('telmios-cardmaker-create')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputSelect label={getLocale('telmios-cardmaker-select')}
                         key="telmios-cardmaker-drive"
                         id="telmios-cardmaker-drive"
                         required={true}
                         options={[
                           {value: '', text: ''},
                           ...drives.map((drive, keyDrive) => ({
                             value: keyDrive,
                             text: drive.drive + ' ' + drive.name + ' (' + toGigabytes(drive.size) + getLocale('gb') + ')'
                           }))
                         ]}
                         ref={inputRefDrive}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextSDCard text={getLocale('make')}
                                  rounded={true}
                                  onClick={() => {
                                    validation(
                                      [
                                        inputRefDrive
                                      ],
                                      (values) => {
                                        const selectedDrive = drives[values[0]]
                                        if (process.platform === 'win32' && toGigabytes(selectedDrive.size) > 32) {
                                          addModal((key) => {
                                            const modal = <ModalTelmiOSCardMakerRufus key={key}
                                                                                      drive={selectedDrive}
                                                                                      onClose={() => rmModal(modal)}/>
                                            return modal
                                          })
                                        } else {
                                          addModal((key) => {
                                            const modal = <ModalTelmiOSCardMakerConfirm key={key}
                                                                                        drive={selectedDrive}
                                                                                        onClose={() => rmModal(modal)}/>
                                            return modal
                                          })
                                        }
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

export default ModalTelmiOSCardMakerForm