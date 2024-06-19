import { forwardRef, useCallback, useMemo } from 'react'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputSwitch ({label, type, id, defaultValue, className, ...props}, ref) {

  const
    classNames = useMemo(() => [styles.inputSwitch, className].join(' '), [className]),
    callBackRef = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            return null
          }
          r.getValue = () => {
            return r.checked
          }
          ref.current = r
        }
      },
      [ref]
    )

  return <InputLayout label={label} id={id}>
    <div className={classNames}>
    <input {...props}
           type="checkbox"
           className={styles.inputSwitchI}
           defaultChecked={defaultValue}
           id={id}
           ref={callBackRef}/>
      <span className={styles.inputSwitchS}></span>
    </div>
  </InputLayout>
}

export default forwardRef(InputSwitch)
