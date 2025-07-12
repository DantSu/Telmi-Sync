import ModalElectronTaskVisualizer from '../../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalTelmiOSEject ({drive, onClose}) {
  return <ModalElectronTaskVisualizer taskName="telmios-cardmaker"
                                      dataSent={[drive]}
                                      onClose={onClose}/>
}

export default ModalTelmiOSEject
