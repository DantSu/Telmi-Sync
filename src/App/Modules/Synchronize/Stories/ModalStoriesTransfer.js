import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoriesTransfer ({stories, telmiOS, onClose}) {
  return <ModalElectronTaskVisualizer taskName="stories-transfer"
                                      dataSent={[telmiOS, stories]}
                                      onClose={onClose}/>
}

export default ModalStoriesTransfer
