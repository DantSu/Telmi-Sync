import {useCallback, useEffect, useMemo, useState} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useStudioStory, useStudioStoryUpdater, useStudioStoryVersions} from './Providers/StudioStoryHooks.js'
import {useStudioStage} from './Providers/StudioStageHooks.js'

import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'
import StudioStoryEditorGraphContainer from './Graph/StudioStoryEditorGraphContainer.js'
import ButtonIconXMark from '../../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconFloppyDisk from '../../../Components/Buttons/Icons/ButtonIconFloppyDisk.js'
import ButtonIconRedo from '../../../Components/Buttons/Icons/ButtonIconRedo.js'
import ButtonIconUndo from '../../../Components/Buttons/Icons/ButtonIconUndo.js'
import ButtonIconToolbox from '../../../Components/Buttons/Icons/ButtonIconToolbox.js'
import ButtonIconPlay from '../../../Components/Buttons/Icons/ButtonIconPlay.js'
import ButtonIconZip from '../../../Components/Buttons/Icons/ButtonIconZip.js'
import ButtonIconMusic from '../../../Components/Buttons/Icons/ButtonIconMusic.js'
import ButtonIconMagnifyingGlass from '../../../Components/Buttons/Icons/ButtonIconMagnifyingGlass.js'
import ModalStudioStorySaveConfirm from './ModalStudioStorySaveConfirm.js'
import StudioForms from './Forms/StudioForms.js'
import Loader from '../../../Components/Loader/Loader.js'
import ModalPlayer from '../Player/ModalPlayer.js'
import ModalSearchStage from './ModalSearchStage.js'

import styles from './StudioStoryEditor.module.scss'

const blurFocus = (event, fn) => {
  event.preventDefault()
  const el = document.activeElement
  if (el instanceof HTMLElement) {
    document.activeElement.blur()
  }
  setTimeout(fn, 100)
}

function StudioStoryEditorLayout({closeEditor}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    {setForm, setFind} = useStudioStage(),
    {story, storyVersion} = useStudioStory(),
    {updateStory, isStoryUpdated} = useStudioStoryUpdater(),
    {onUndo, onRedo, hasUndo, hasRedo} = useStudioStoryVersions(),
    [nextAction, setNextAction] = useState(null),
    loading = story === null,

    onPlay = useCallback(
      () => {
        if (document.getElementById('modal-player') !== null) {
          return
        }
        addModal((key) => {
          const modal = <ModalPlayer key={key}
                                     debugMode={true}
                                     story={story}
                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal, story]
    ),

    onSearchStage = useCallback(
      () => {
        if (document.getElementById('stage-search') !== null) {
          return
        }
        addModal((key) => {
          const modal = <ModalSearchStage key={key}
                                          story={story}
                                          onValidate={(stageKey) => setFind(stageKey)}
                                          onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal, setFind, story]
    ),

    onEditAudios = useCallback(() => setForm((f) => f === 'form-audio' ? null : 'form-audio'), [setForm]),

    onEditItems = useCallback(() => setForm((f) => f === 'form-inventory' ? null : 'form-inventory'), [setForm]),

    onSave = useCallback(
      () => {
        if (!isStoryUpdated) {
          return
        }
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="studio-story-save"
                                                     dataSent={[story]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, isStoryUpdated, rmModal, story]
    ),

    onZip = useCallback(
      () => {
        if (isStoryUpdated) {
          return
        }
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="studio-story-zip"
                                                     dataSent={[story]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, isStoryUpdated, rmModal, story]
    ),
    nextActions = useMemo(() => ({onPlay, onZip, onSave}), [onPlay, onSave, onZip]),

    onClose = useCallback(
      () => {
        if (!isStoryUpdated) {
          return closeEditor()
        }

        addModal((key) => {
          const modal = <ModalStudioStorySaveConfirm key={key}
                                                     onConfirm={() => closeEditor()}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [isStoryUpdated, addModal, closeEditor, rmModal]
    ),

    onTitleBlur = useCallback(
      (e) => {
        if (loading) {
          return
        }
        updateStory((sd) => sd.metadata.title === e.target.value ? sd : {
          ...sd,
          metadata: {...sd.metadata, title: e.target.value},
        })
      },
      [loading, updateStory]
    ),

    storyTitle = !loading ? story.metadata.title : ''

  useEffect(
    () => {
      const keyDownListener = (event) => {
        const key = event.key.toLowerCase()
        if (event.ctrlKey && key === 's') {
          blurFocus(event, () => setNextAction('onSave'))
        }
        if (event.ctrlKey && key === 'e') {
          blurFocus(event, () => setNextAction('onZip'))
        }
        if (event.ctrlKey && key === 'p') {
          blurFocus(event, () => setNextAction('onPlay'))
        }
        if (event.ctrlKey && key === 'z') {
          blurFocus(event, onUndo)
        }
        if (event.ctrlKey && key === 'y') {
          blurFocus(event, onRedo)
        }
        if (event.ctrlKey && key === 'f') {
          blurFocus(event, onSearchStage)
        }
        if (event.ctrlKey && key === 'i') {
          blurFocus(event, onEditItems)
        }
        if (event.ctrlKey && key === 'a') {
          blurFocus(event, onEditAudios)
        }
      }
      document.addEventListener('keydown', keyDownListener)
      return () => document.removeEventListener('keydown', keyDownListener)
    },
    [onEditAudios, onEditItems, onRedo, onSave, onSearchStage, onUndo]
  )

  useEffect(
    () => {
      if (nextAction !== null) {
        nextActions[nextAction]()
        setNextAction(null)
      }
    },
    [nextAction, nextActions]
  )

  return <div className={styles.container}>
    <div className={styles.topBar}>
      <input type="text"
             key={'metadata-title-' + storyVersion + '-' + storyTitle}
             defaultValue={storyTitle}
             className={styles.titleInput}
             onBlur={onTitleBlur}/>
      <ul className={styles.topBarButtons}>
        {!loading ? <>
          <li>
            <ButtonIconUndo
              className={[styles.topBarButton, !hasUndo ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('undo') + ' ( Ctrl + Z )'}
              onClick={onUndo}/>
          </li>
          <li>
            <ButtonIconRedo
              className={[styles.topBarButton, !hasRedo ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('redo') + ' ( Ctrl + Y )'}
              onClick={onRedo}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconMagnifyingGlass className={styles.topBarButton}
                                       title={getLocale('center-on') + ' ( Ctrl + F )'}
                                       onClick={onSearchStage}/>
          </li>
          <li>
            <ButtonIconMusic className={styles.topBarButton}
                             title={getLocale('audio-list') + ' ( Ctrl + A )'}
                             onClick={onEditAudios}/>
          </li>
          <li>
            <ButtonIconToolbox className={styles.topBarButton}
                               title={getLocale('inventory') + ' ( Ctrl + I )'}
                               onClick={onEditItems}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconPlay className={styles.topBarButton}
                            title={getLocale('story-play') + ' ( Ctrl + P )'}
                            onClick={onPlay}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconFloppyDisk
              className={[styles.topBarButton, !isStoryUpdated ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('save') + ' ( Ctrl + S )'}
              onClick={onSave}/>
          </li>
          <li>
            <ButtonIconZip
              className={[styles.topBarButton, isStoryUpdated ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('zip-export') + ' ( Ctrl + E )'}
              onClick={onZip}/>
          </li>
          <li className={styles.topBarSeparator}></li>
        </> : null}
        <li>
          <ButtonIconXMark className={styles.topBarButton}
                           title={getLocale('story-close')}
                           onClick={onClose}/>
        </li>
      </ul>
    </div>
    <div className={styles.content}>{
      loading ? <Loader/> : <>
        <StudioStoryEditorGraphContainer/>
        <StudioForms/>
      </>
    }
    </div>
  </div>
}

export default StudioStoryEditorLayout