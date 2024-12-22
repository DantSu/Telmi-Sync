import { forwardRef, useCallback, useState } from 'react'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputRange ({label, type, id, unit, defaultValue, className, classNameInput, vertical, ...props}, ref) {

  const
    [value, setValue] = useState(defaultValue),
    callBackRef = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            return null
          }
          r.getValue = () => {
            return parseFloat(r.value)
          }
          ref.current = r
        }
      },
      [ref]
    ),
    onChange = useCallback(
      (e) => setValue(e.target.value),
      [setValue]
    )

  return <InputLayout label={label} id={id} vertical={vertical} className={className}>
    <input {...props}
           type="range"
           className={[styles.inputRange, classNameInput].join(' ')}
           defaultValue={defaultValue}
           onChange={onChange}
           id={id}
           ref={callBackRef}/>
    {unit !== undefined ? <span className={styles.inputRangeValue}>{value} {unit}</span> : <span className={styles.inputRangeValue}>{value} / {props.max}</span>}
  </InputLayout>
}

export default forwardRef(InputRange)
