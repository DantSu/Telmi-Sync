import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ButtonIconTextMusic from '../../../Components/Buttons/IconsTexts/ButtonIconTextMusic.js'

function MusicTab(props) {
  const {getLocale} = useLocale()
  return <ButtonIconTextMusic {...props} text={getLocale('musics')} />
}

export default MusicTab
