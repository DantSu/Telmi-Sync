import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoreBuild ({store, question, stories, onClose}) {
  return <ModalElectronTaskVisualizer taskName="store-build"
                                      taskCancellable={true}
                                      dataSent={[store, question, stories]}
                                      onClose={onClose}/>
}

export default ModalStoreBuild
