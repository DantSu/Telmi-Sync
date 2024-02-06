import { forwardRef } from 'react'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputText ({label, type, id, required, className, ...props}, ref) {

  return <InputLayout label={label} id={id} required={required}>
    <input {...props}
           type={type || 'text'}
           className={[styles.input, className].join(' ')}
           required={required}
           id={id}

           ref={(r) => {
             if (r !== null) {
               r.checkValue = () => {
                 if (r.required && r.value === '') {
                   return <>Le champ <strong>"{label}"</strong> est obligatoire.</>
                 }
                 if(r.type === 'url' && !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&\/=]*)$/i.test(r.value)) {
                   return <>Le champ <strong>"{label}"</strong> doit être une URL valide.</>
                 }
                 return null
               }
               r.getValue = () => {
                 return r.value
               }
               ref.current = r
             }
           }}/>
  </InputLayout>
}

export default forwardRef(InputText)
