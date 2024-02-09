import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { musicClassification } from './MusicClassification.js'
import Table from '../../../Components/Table/Table.js'
import ModalMusicFormUpdate from './ModalMusicFormUpdate.js'
import ModalMusicDeleteConfirm from './ModalMusicDeleteConfirm.js'
import ModalMusicsDeleteConfirm from './ModalMusicsDeleteConfirm.js'
import ModalMusicsFormUpdate from './ModalMusicsFormUpdate.js'

function MusicTable ({className, musics, selectedMusics, setSelectedMusics, onEdit, onEditSelected, onDelete}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingMusics, setIsLoadingMusics] = useState(false),

    {flatTableMusics, tableMusics} = useMemo(
      () => {
        const flatMusics = musics.map(
          (s) => ({
            ...s,
            cellTitle: s.track + '. ' + s.title,
            cellSubtitle: s.artist + ' - ' + s.album
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
        if (musics.includes(music)) {
          return musics.filter((v) => v !== music)
        } else {
          return [...musics, music]
        }
      }),
      [setSelectedMusics]
    ),

    onSelectGroup = useCallback(
      (musicTracks) => setSelectedMusics((musics) => {
        if (musicTracks.reduce((acc, m) => musics.includes(m) ? acc + 1 : acc, 0) === musicTracks.length) {
          return musics.filter((m) => !musicTracks.includes(m))
        }

        return [...musics, ...musicTracks.filter((m) => !musics.includes(m))]
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
                                                setIsLoadingMusics(true)
                                                onEdit(music)
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEdit, addModal, rmModal]
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
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, addModal, rmModal]
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
