import ModalElectronTaskVisualizer from '../../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoreAudioBuilder ({audioList, onClose}) {
  return <ModalElectronTaskVisualizer taskName="store-build"
                                      taskCancellable={true}
                                      dataSent={[audioList]}
                                      onClose={onClose}/>
}

export default ModalStoreAudioBuilder
