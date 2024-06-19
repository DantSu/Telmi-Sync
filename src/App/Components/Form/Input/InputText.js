import {forwardRef, useCallback} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputText({label, type, id, required, className, ...props}, ref) {
  const
    {getLocale} = useLocale(),
    refCallback = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            if (r.required && r.value === '') {
              return getLocale('input-required', label)
            }
            if (r.type === 'url' && !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i.test(r.value)) {
              return getLocale('input-url-invalid', label)
            }
            return null
          }
          r.getValue = () => {
            return (r.type === 'number') ? parseFloat(r.value) : r.value
          }
          ref.current = r
        }
      },
      [ref, label, getLocale]
    )

  return <InputLayout label={label} id={id} required={required}>
    <input {...props}
           type={type || 'text'}
           className={[styles.input, className].join(' ')}
           required={required}
           id={id}
           ref={refCallback}/>
  </InputLayout>
}

export default forwardRef(InputText)
