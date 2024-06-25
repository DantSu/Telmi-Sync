import { forwardRef, useCallback, useMemo, useState } from 'react'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputRange ({label, type, id, unit, defaultValue, className, vertical, ...props}, ref) {

  const
    [value, setValue] = useState(defaultValue),
    classNames = useMemo(() => [styles.inputRange, className].join(' '), [className]),
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

  return <InputLayout label={label} id={id} vertical={vertical}>
    <input {...props}
           type="range"
           className={classNames}
           defaultValue={defaultValue}
           onChange={onChange}
           id={id}
           ref={callBackRef}/>
    {unit !== undefined ? <span className={styles.inputRangeValue}>{value} {unit}</span> : <span className={styles.inputRangeValue}>{value} / {props.max}</span>}
  </InputLayout>
}

export default forwardRef(InputRange)
