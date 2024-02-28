import { getProcessParams } from '../Helpers/ProcessParams.js'
import { ejectDrive } from '../BinFiles/EjectCommand.js'

async function main (drive) {
  process.stdout.write('*ejecting*0*1*')
  await ejectDrive(drive)
  process.stdout.write('*ejecting*1*1*')
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('telmios-not-found')
} else {
  main(_params_[0]).catch((e) => process.stderr.write('failure'))
}
