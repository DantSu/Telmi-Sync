import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoriesTransfer ({stories, usb, onClose}) {
  return <ModalElectronTaskVisualizer taskName="stories-transfer"
                                      dataSent={[usb, stories]}
                                      onClose={onClose}/>
}

export default ModalStoriesTransfer
