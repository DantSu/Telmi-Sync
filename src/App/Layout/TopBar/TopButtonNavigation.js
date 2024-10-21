import {useRouter} from '../../Router/RouterHooks.js'

import styles from './TopBar.module.scss'

function TopButtonNavigation({buttonComponent, text, title, route, currentModule, className, clickable=true}) {
  const
    setRoute = useRouter(),
    isSelected = route.module === currentModule,
    Button = buttonComponent

  return <li className={[styles.buttonContainer, isSelected ? styles.buttonContainerSelected : ''].join(' ')}>
    <Button text={text}
            title={title}
            className={[className, styles.button, isSelected ? styles.buttonSelected : ''].join(' ')}
            onClick={() => clickable && setRoute(route)}/>
  </li>
}

export default TopButtonNavigation
