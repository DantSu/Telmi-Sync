import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocalMusic } from '../../../Components/LocalMusic/LocalMusicHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalMusicFormUpdate from './ModalMusicFormUpdate.js'
import ModalMusicDeleteConfirm from './ModalMusicDeleteConfirm.js'
import ModalMusicsDeleteConfirm from './ModalMusicsDeleteConfirm.js'

const {ipcRenderer} = window.require('electron')

function MusicLocalContent ({selectedLocalMusics, setSelectedLocalMusics}) {
  const
    {addModal, rmModal} = useModal(),
    [isLoadingLocalMusics, setIsLoadingLocalMusics] = useState(false),
    rawLocalMusics = useLocalMusic(),

    localMusics = useMemo(
      () => rawLocalMusics.map((s) => ({
        ...s,
        cellTitle: s.track + '. ' + s.title,
        cellSubtitle: s.artist + ' - ' + s.album
      })),
      [rawLocalMusics]
    ),

    onSelect = useCallback(
      (music) => setSelectedLocalMusics((musics) => {
        if (musics.includes(music)) {
          return musics.filter((v) => v !== music)
        } else {
          return [...musics, music]
        }
      }),
      [setSelectedLocalMusics]
    ),

    onSelectAll = useCallback(
      () => setSelectedLocalMusics((musics) => {
        if (localMusics.length === musics.length) {
          return []
        } else {
          return [...localMusics]
        }
      }),
      [localMusics, setSelectedLocalMusics]
    ),

    onEdit = useCallback(
      (music) => {
        addModal((key) => {
          const modal = <ModalMusicFormUpdate key={key}
                                              music={music}
                                              onValidate={(music) => {
                                                setIsLoadingLocalMusics(true)
                                                ipcRenderer.send('local-music-update', music)
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onDelete = useCallback(
      (music) => {
        addModal((key) => {
          const modal = <ModalMusicDeleteConfirm key={key}
                                                 music={music}
                                                 onConfirm={() => {
                                                   ipcRenderer.send('local-musics-delete', [music.id])
                                                   setIsLoadingLocalMusics(true)
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onDeleteSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicsDeleteConfirm key={key}
                                                 onConfirm={() => {
                                                   ipcRenderer.send(
                                                     'local-musics-delete',
                                                     selectedLocalMusics.map((music) => music.id)
                                                   )
                                                   setIsLoadingLocalMusics(true)
                                                   setSelectedLocalMusics([])
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [selectedLocalMusics, setSelectedLocalMusics, addModal, rmModal]
    )

  useEffect(() => {setIsLoadingLocalMusics(false)}, [rawLocalMusics, setIsLoadingLocalMusics])

  return <Table titleLeft={'Mes musiques (' + localMusics.length + ')'}
                titleRight={selectedLocalMusics.length ? selectedLocalMusics.length + ' musique(s) sélectionné(s)' : undefined}
                data={localMusics}
                selectedData={selectedLocalMusics}
                onSelect={onSelect}
                onSelectAll={onSelectAll}
                onEdit={onEdit}
                onDelete={onDelete}
                onDeleteSelected={onDeleteSelected}
                isLoading={isLoadingLocalMusics}/>
}

export default MusicLocalContent
