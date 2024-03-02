import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalStoriesOptimizeAudio ({stories, onClose}) {
  return <ModalElectronTaskVisualizer taskName="stories-optimize-audio"
                                      dataSent={[stories]}
                                      onClose={onClose}/>
}

export default ModalStoriesOptimizeAudio
