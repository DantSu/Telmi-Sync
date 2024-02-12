import TelmiOSNotDetected from './TelmiOSNotDetected.js'
import TelmiOSDetected from './TelmiOSDetected.js'

function TelmiOSLayout ({usb, onTransfer, children}) {
  if (usb === null) {
    return <TelmiOSNotDetected />
  } else {
    return <TelmiOSDetected usb={usb} onTransfer={onTransfer}>{children}</TelmiOSDetected>
  }
}

export default TelmiOSLayout
