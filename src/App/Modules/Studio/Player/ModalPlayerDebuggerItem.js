import InputText from '../../../Components/Form/Input/InputText.js'

import styles from './ModalPlayer.module.scss'

function ModalPlayerDebuggerItem({item, setItems}) {
  return <li className={styles.inventoryDebugItem}>
    <InputText vertical={false}
               className={styles.inventoryDebugItemInputLayout}
               classNameInput={styles.inventoryDebugItemInput}
               label={item.name}
               type="number"
               min={0}
               max={item.maxNumber}
               step={1}
               value={item.count}
               onChange={(e) => {
                 setItems((items) => {
                   item.count = parseInt(e.target.value, 10)
                   return [...items]
                 })
               }}/>
    <span className={styles.inventoryDebugItemMax}>/{item.maxNumber}</span>
  </li>
}

export default ModalPlayerDebuggerItem