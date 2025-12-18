import {useCallback, useState} from 'react'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {getStageAudioPath} from '../../../Helpers/FileHelpers.js'
import AudioEdit from '../../../../../Components/Audio/AudioEdit/AudioEdit.js'
import ButtonIconChevronUp from '../../../../../Components/Buttons/Icons/ButtonIconChevronUp.js'
import ButtonIconChevronDown from '../../../../../Components/Buttons/Icons/ButtonIconChevronDown.js'

import styles from './Audio.module.scss'

function StudioAudioItem({stageKeys}) {
  const
    {story: {metadata, nodes, notes}} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    title = stageKeys.map((v) => notes[v].title).join(', '),
    [opened, setOpened] = useState(false),
    audioPath = getStageAudioPath(nodes.stages[stageKeys[0]], metadata),
    setNewMp3Path = useCallback(
      (newMp3Path) => {
        updateStory((s) => ({
            ...s,
            nodes: {
              ...s.nodes,
              stages: {
                ...s.nodes.stages,
                ...stageKeys.reduce(
                  (acc, sk) => ({...acc, [sk]: {...s.nodes.stages[sk], newAudio: newMp3Path}}),
                  {}
                )
              }
            }
          })
        )
      },
      [stageKeys, updateStory]
    )

  return <div className={styles.itemContainer}>
    <div className={styles.audioTitleContainer}>
      <h3 className={styles.audioTitle}
          onClick={() => setOpened((o) => !o)}
          title={title}>{title}</h3>
      {opened ?
        <ButtonIconChevronUp className={styles.audioTitleButton} onClick={() => setOpened(false)}/> :
        <ButtonIconChevronDown className={styles.audioTitleButton} onClick={() => setOpened(true)}/>}
    </div>
    {
      opened && <div className={styles.audioContainer}>
        <AudioEdit mp3Path={audioPath} setNewMp3Path={setNewMp3Path}/>
      </div>
    }
  </div>
}

export default StudioAudioItem