import {forwardRef, useCallback} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputTextarea({label, id, required, className, classNameInput, vertical, ...props}, ref) {
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

  return <InputLayout label={label} id={id} required={required} vertical={vertical} className={className}>
    <textarea {...props}
              className={[styles.textarea, classNameInput].join(' ')}
              required={required}
              id={id}
              ref={refCallback}/>
  </InputLayout>
}

export default forwardRef(InputTextarea)
