import {forwardRef, useCallback} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputSelect({label, id, required, className, options, vertical, ...props}, ref) {
  const
    {getLocale} = useLocale(),
    refCallback = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            if (r.required && r.value === '') {
              return getLocale('input-required', label)
            }
            return null
          }
          r.getValue = () => {
            return r.value
          }
          ref.current = r
        }
      },
      [ref, label, getLocale]
    )

  if(!options || !options.length) {
    return null
  }

  return <InputLayout label={label} id={id} required={required} vertical={vertical}>
    <select {...props}
           className={[styles.select, className].join(' ')}
           required={required}
           id={id}
           ref={refCallback}>
      {options.map(({value, text}) => {
        const v = value === undefined ? text : value
        return <option key={id + '-option-' + v} value={v} className={styles.option}>{text}</option>
      })}
    </select>
  </InputLayout>
}

export default forwardRef(InputSelect)
