import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoriesMergeTask ({story, onClose}) {
  return <ModalElectronTaskVisualizer taskName="local-stories-merge"
                                      dataSent={[story]}
                                      onClose={onClose}/>
}

export default ModalStoriesMergeTask
