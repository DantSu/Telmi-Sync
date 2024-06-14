import {useCallback, useState} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'

import ButtonIconXMark from '../../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconFloppyDisk from '../../../Components/Buttons/Icons/ButtonIconFloppyDisk.js'
import ModalStudioStoryCancelConfirm from './ModalStudioStoryCancelConfirm.js'

import styles from './StoryEditor.module.scss'
import SVGLayout from '../../../Components/SVG/SVGLayout.js'
import SVGLine from '../../../Components/SVG/SVGLine.js'


function StudioStoryEditor({story, setStory}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    storyData = useState(null),
    onSave = useCallback(
      () => {
        setStory(null)
      },
      [story, setStory]
    ),
    onClose = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStudioStoryCancelConfirm key={key}
                                                       story={story}
                                                       onConfirm={() => setStory(null)}
                                                       onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [story, setStory, addModal, rmModal]
    )

  return <div className={styles.container}>
    <div className={styles.topBar}>
      <input type="text" defaultValue={story.title} className={styles.titleInput}/>
      <ul className={styles.topBarButtons}>
        <li><ButtonIconFloppyDisk className={styles.topBarButton} title={getLocale('story-save')} onClick={onSave}/>
        </li>
        <li><ButtonIconXMark className={styles.topBarButton} title={getLocale('story-close')} onClick={onClose}/></li>
      </ul>
    </div>
    <div className={styles.content}>
      <div className={styles.contentContainer}>
        <SVGLayout>
          <SVGLine fromX={300} fromY={300} toX={500} toY={500}/>
          <SVGLine fromX={300} fromY={300} toX={100} toY={100}/>
        </SVGLayout>
      </div>
    </div>
  </div>
}

export default StudioStoryEditor