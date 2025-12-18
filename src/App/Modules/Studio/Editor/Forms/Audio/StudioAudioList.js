import {useMemo} from 'react'
import {useStudioStory} from '../../Providers/StudioStoryHooks.js'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import StudioAudioItem from './StudioAudioItem.js'

import styles from './Audio.module.scss'

const
  getAudios = (nodes) => {
    const
      processedAudios = {},
      audioList = {}
    getAudiosAction(nodes.startAction.action, nodes, false, {}, {}, processedAudios, audioList)
    getAudiosAction(nodes.startAction.action, nodes, true, {}, {}, processedAudios, audioList)
    return audioList
  },

  getAudiosAction = (aKey, nodes, includeHome, processedActionKeys, processedStageKeys, processedAudios, audioList) => {
    if (processedActionKeys[aKey] !== undefined) {
      return
    }
    processedActionKeys[aKey] = true
    nodes.actions[aKey].forEach(
      (v) => getAudiosStage(v.stage, nodes, includeHome, processedActionKeys, processedStageKeys, processedAudios, audioList)
    )
  },

  getAudiosStage = (sKey, nodes, includeHome, processedActionKeys, processedStageKeys, processedAudios, audioList) => {
    if (processedStageKeys[sKey] !== undefined) {
      return
    }

    processedStageKeys[sKey] = true

    const
      stage = nodes.stages[sKey],
      audio = stage.newAudio || stage.audio

    if (audio && processedAudios[audio] === undefined) {
      processedAudios[audio] = true
      if(audioList[audio] === undefined) {
        audioList[audio] = [sKey]
      } else {
        if(!audioList[audio].includes(sKey)) {
          audioList[audio] = [...audioList[audio], sKey]
        }
      }
    }

    stage.ok !== null && getAudiosAction(stage.ok.action, nodes, includeHome, processedActionKeys, processedStageKeys, processedAudios, audioList)
    includeHome && stage.home !== null && getAudiosAction(stage.home.action, nodes, includeHome, processedActionKeys, processedStageKeys, processedAudios, audioList)
  }

function StudioAudioList() {
  const
    {getLocale} = useLocale(),
    {story: {nodes}} = useStudioStory(),
    audios = useMemo(() => getAudios(nodes), [nodes])

  return <>
    <h2 className={styles.title}>{getLocale('audio-list')}</h2>
    {Object.keys(audios).map((v) => <StudioAudioItem key={audios[v][0]} stageKeys={audios[v]}/>)}
  </>
}

export default StudioAudioList