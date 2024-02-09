import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoreDownload ({stories, onClose}) {
  return <ModalElectronTaskVisualizer taskName="store-download"
                                      dataSent={[stories]}
                                      onClose={onClose}/>
}

export default ModalStoreDownload
