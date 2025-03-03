import {useCallback} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useStudioStory, useStudioStoryUpdater, useStudioStoryVersions} from './Providers/StudioStoryHooks.js'
import {useStudioForm} from './Providers/StudioStageHooks.js'

import ModalElectronTaskVisualizer from '../../../Components/Electron/Modal/ModalElectronTaskVisualizer.js'
import StudioStoryEditorGraphContainer from './Graph/StudioStoryEditorGraphContainer.js'
import ButtonIconXMark from '../../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconFloppyDisk from '../../../Components/Buttons/Icons/ButtonIconFloppyDisk.js'
import ButtonIconRedo from '../../../Components/Buttons/Icons/ButtonIconRedo.js'
import ButtonIconUndo from '../../../Components/Buttons/Icons/ButtonIconUndo.js'
import ButtonIconToolbox from '../../../Components/Buttons/Icons/ButtonIconToolbox.js'
import ButtonIconPlay from '../../../Components/Buttons/Icons/ButtonIconPlay.js'
import ButtonIconZip from '../../../Components/Buttons/Icons/ButtonIconZip.js'
import ModalStudioStorySaveConfirm from './ModalStudioStorySaveConfirm.js'
import StudioForms from './Forms/StudioForms.js'
import Loader from '../../../Components/Loader/Loader.js'
import ModalPlayer from '../Player/ModalPlayer.js'

import styles from './StudioStoryEditor.module.scss'


function StudioStoryEditorLayout({closeEditor}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    {setForm} = useStudioForm(),
    {story, storyVersion} = useStudioStory(),
    {updateStory, isStoryUpdated} = useStudioStoryUpdater(),
    {onUndo, onRedo, hasUndo, hasRedo} = useStudioStoryVersions(),
    loading = story === null,

    onPlay = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalPlayer key={key}
                                     story={story}
                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal, story]
    ),

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
              title={getLocale('undo')}
              onClick={onUndo}/>
          </li>
          <li>
            <ButtonIconRedo
              className={[styles.topBarButton, !hasRedo ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('redo')}
              onClick={onRedo}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconToolbox className={styles.topBarButton}
                               title={getLocale('inventory')}
                               onClick={onEditItems}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconPlay className={styles.topBarButton}
                            title={getLocale('story-play')}
                            onClick={onPlay}/>
          </li>
          <li className={styles.topBarSeparator}></li>
          <li>
            <ButtonIconFloppyDisk
              className={[styles.topBarButton, !isStoryUpdated ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('save')}
              onClick={onSave}/>
          </li>
          <li>
            <ButtonIconZip
              className={[styles.topBarButton, isStoryUpdated ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('zip-export')}
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