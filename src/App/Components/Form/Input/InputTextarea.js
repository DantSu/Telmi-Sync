import {forwardRef, useCallback} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputTextarea({label, id, required, className, ...props}, ref) {
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
          ref.current = r
        }
      },
      [ref, label, getLocale]
    )

  return <InputLayout label={label}
                      id={id}
                      required={required}
                      className={styles.containerVertical}>
    <textarea {...props}
              className={[styles.textarea, className].join(' ')}
              required={required}
              id={id}
              ref={refCallback}/>
  </InputLayout>
}

export default forwardRef(InputTextarea)
