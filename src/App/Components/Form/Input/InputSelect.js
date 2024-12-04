import {forwardRef, useCallback} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputSelect({label, id, required, className, classNameInput, options, vertical, onChange, ...props}, ref) {
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
          r.getOption = () => {
            return options[r.selectedIndex]
          }
          r.getValue = () => {
            return options[r.selectedIndex].value
          }
          ref.current = r
        }
      },
      [ref, getLocale, label, options]
    ),
    onChangeCallback = useCallback(
      (e) => typeof onChange === 'function' && onChange(e.target.getValue()),
      [onChange]
    )

  if (!options || !options.length) {
    return null
  }

  return <InputLayout label={label} id={id} required={required} vertical={vertical} className={className}>
    <select {...props}
            className={[styles.select, classNameInput].join(' ')}
            required={required}
            id={id}
            onChange={onChangeCallback}
            ref={refCallback}>
      {options.map(({value, text}) => {
        const v = value === undefined ? text : value
        return <option key={id + '-option-' + v} value={v} className={styles.option}>{text}</option>
      })}
    </select>
  </InputLayout>
}

export default forwardRef(InputSelect)
