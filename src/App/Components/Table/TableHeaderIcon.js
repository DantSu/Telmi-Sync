import { useLocale } from '../Locale/LocaleHooks.js'

import styles from './Table.module.scss'

function TableHeaderIcon ({componentIcon, onClick, title}) {

  const
    {getLocale} = useLocale(),
    ButtonIcon = componentIcon

  return <li>
    <ButtonIcon className={styles.headerIcon}
                title={getLocale(title)}
                onClick={onClick}/>
  </li>
}

export default TableHeaderIcon
