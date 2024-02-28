import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalMusicTransfer ({musics, telmiOS, onClose}) {
  return <ModalElectronTaskVisualizer taskName="musics-transfer"
                                      dataSent={[telmiOS, musics]}
                                      onClose={onClose}/>
}

export default ModalMusicTransfer
