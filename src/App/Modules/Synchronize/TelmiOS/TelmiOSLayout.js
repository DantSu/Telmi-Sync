import TelmiOSNotDetected from './TelmiOSNotDetected.js'
import TelmiOSDetected from './TelmiOSDetected.js'

function TelmiOSLayout ({telmiOS, onTransfer, children}) {
  if (!telmiOS.drive) {
    return <TelmiOSNotDetected />
  } else {
    return <TelmiOSDetected telmiOS={telmiOS} onTransfer={onTransfer}>{children}</TelmiOSDetected>
  }
}

export default TelmiOSLayout
