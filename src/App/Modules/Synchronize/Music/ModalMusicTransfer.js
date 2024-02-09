import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalMusicTransfer ({musics, usb, onClose}) {
  return <ModalElectronTaskVisualizer taskName="musics-transfer"
                                      dataSent={[usb, musics]}
                                      onClose={onClose}/>
}

export default ModalMusicTransfer
