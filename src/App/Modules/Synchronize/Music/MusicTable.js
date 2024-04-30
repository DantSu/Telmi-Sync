import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { musicClassification } from './MusicClassification.js'
import {isCellSelected} from '../../../Components/Table/TableHelpers.js';
import Table from '../../../Components/Table/Table.js'
import ModalMusicFormUpdate from './ModalMusicFormUpdate.js'
import ModalMusicDeleteConfirm from './ModalMusicDeleteConfirm.js'
import ModalMusicsDeleteConfirm from './ModalMusicsDeleteConfirm.js'
import ModalMusicsFormUpdate from './ModalMusicsFormUpdate.js'

const
  musicIds = {},
  musicGetId = (str) => {
    if (musicIds[str] === undefined) {
      musicIds[str] = Object.values(musicIds).length
    }
    return musicIds[str]
  }

function MusicTable ({className, musics, selectedMusics, setSelectedMusics, onEdit, onEditSelected, onDelete}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingMusics, setIsLoadingMusics] = useState(false),

    {flatTableMusics, tableMusics} = useMemo(
      () => {
        const flatMusics = musics.map(
          (m) => ({
            ...m,
            cellId: musicGetId(m.artist + '_' + m.album + '_' + m.track + '_' + m.title),
            cellTitle: m.track + '. ' + m.title,
            cellSubtitle: m.artist + ' - ' + m.album
          })
        )
        return {
          flatTableMusics: flatMusics,
          tableMusics: musicClassification(flatMusics)
        }
      },
      [musics]
    ),

    onSelect = useCallback(
      (music) => setSelectedMusics((musics) => {
        if (isCellSelected(musics, music)) {
          return musics.filter((v) => v.cellId !== music.cellId)
        } else {
          return [...musics, music]
        }
      }),
      [setSelectedMusics]
    ),

    onSelectGroup = useCallback(
      (musicTracks) => setSelectedMusics((musics) => {
        if (musicTracks.reduce((acc, music) => isCellSelected(musics, music) ? acc + 1 : acc, 0) === musicTracks.length) {
          return musics.filter((music) => !isCellSelected(musicTracks, music))
        }
        return [...musics, ...musicTracks.filter((music) => !isCellSelected(musics, music))]
      }),
      [setSelectedMusics]
    ),

    onSelectAll = useCallback(
      () => setSelectedMusics((musics) => {
        if (flatTableMusics.length === musics.length) {
          return []
        } else {
          return [...flatTableMusics]
        }
      }),
      [flatTableMusics, setSelectedMusics]
    ),

    onCallbackEdit = useCallback(
      (music) => {
        addModal((key) => {
          const modal = <ModalMusicFormUpdate key={key}
                                              music={music}
                                              onValidate={(music) => {
                                                onEdit(music)
                                                setIsLoadingMusics(true)
                                                 setSelectedMusics([])
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEdit, setSelectedMusics, addModal, rmModal]
    ),

    onCallbackEditSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicsFormUpdate key={key}
                                               musics={selectedMusics}
                                               onValidate={(musics) => {
                                                 onEditSelected(musics)
                                                 setIsLoadingMusics(true)
                                                 setSelectedMusics([])
                                               }}
                                               onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEditSelected, selectedMusics, setSelectedMusics, addModal, rmModal]
    ),

    onCallbackDelete = useCallback(
      (music) => {
        addModal((key) => {
          const modal = <ModalMusicDeleteConfirm key={key}
                                                 music={music}
                                                 onConfirm={() => {
                                                   onDelete([music.id])
                                                   setIsLoadingMusics(true)
                                                   setSelectedMusics([])
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, setSelectedMusics, addModal, rmModal]
    ),

    onCallbackDeleteSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicsDeleteConfirm key={key}
                                                  onConfirm={() => {
                                                    onDelete(selectedMusics.map((music) => music.id))
                                                    setIsLoadingMusics(true)
                                                    setSelectedMusics([])
                                                  }}
                                                  onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, selectedMusics, setSelectedMusics, addModal, rmModal]
    )

  useEffect(() => {setIsLoadingMusics(false)}, [musics, setIsLoadingMusics])

  return <Table className={className}
                titleLeft={getLocale('musics-local', flatTableMusics.length)}
                titleRight={selectedMusics.length ? getLocale('musics-selected', selectedMusics.length) : undefined}
                data={tableMusics}
                selectedData={selectedMusics}
                onSelect={onSelect}
                onSelectGroup={onSelectGroup}
                onSelectAll={onSelectAll}
                onEdit={onEdit !== undefined ? onCallbackEdit : undefined}
                onEditSelected={onEditSelected !== undefined ? onCallbackEditSelected : undefined}
                onDelete={onCallbackDelete}
                onDeleteSelected={onCallbackDeleteSelected}
                isLoading={isLoadingMusics}/>
}

export default MusicTable
