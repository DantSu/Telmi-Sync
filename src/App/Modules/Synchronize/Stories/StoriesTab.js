import ButtonIconTextBook from '../../../Components/Buttons/IconsTexts/ButtonIconTextBook.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'

function StoriesTab(props) {
  const {getLocale} = useLocale()
  return <ButtonIconTextBook {...props} text={getLocale('stories')} />
}

export default StoriesTab
