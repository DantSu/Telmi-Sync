import {forwardRef, useCallback, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputText({
                     label,
                     type,
                     id,
                     required,
                     className,
                     classNameInput,
                     classNameLayout,
                     vertical,
                     onKeyUp,
                     options,
                     ...props
                   }, ref) {
  const
    {getLocale} = useLocale(),
    [optionsFiltered, setOptionsFiltered] = useState([]),
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
    ),
    onKeyUpInput = useCallback(
      (e) => {
        if (Array.isArray(options)) {
          const value = e.target.value.toLowerCase()
          setOptionsFiltered(options.filter((v) => v.toLowerCase().startsWith(value)).slice(0, 10))
        }
        typeof onKeyUp === 'function' && onKeyUp(e)
      },
      [onKeyUp, options]
    )

  return <InputLayout className={className} label={label} id={id} required={required} vertical={vertical}>
    <div className={styles.inputContainer}>
      <input {...props}
             type={type || 'text'}
             className={[styles.input, classNameInput].join(' ')}
             required={required}
             onKeyUp={onKeyUpInput}
             id={id}
             ref={refCallback}/>
      {
        optionsFiltered.length > 0 &&
        <ul className={styles.inputOptions}>{
          optionsFiltered.map((o) => <li key={o}
                                         className={styles.inputOption}
                                         onClick={() => {
                                           ref.current.value = o
                                           ref.current.dispatchEvent(new Event('change'))
                                           setOptionsFiltered([])
                                         }}>{o}</li>)
        }</ul>
      }
    </div>
  </InputLayout>
}

export default forwardRef(InputText)
