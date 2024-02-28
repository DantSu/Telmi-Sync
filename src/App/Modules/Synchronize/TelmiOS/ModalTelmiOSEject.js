import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalTelmiOSEject ({telmiOS, onClose}) {
  return <ModalElectronTaskVisualizer taskName="telmios-eject"
                                      dataSent={[telmiOS]}
                                      onClose={onClose}/>
}

export default ModalTelmiOSEject
