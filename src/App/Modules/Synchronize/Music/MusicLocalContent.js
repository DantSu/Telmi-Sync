import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocalMusic } from '../../../Components/LocalMusic/LocalMusicHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { musicClassification } from './MusicClassification.js'
import Table from '../../../Components/Table/Table.js'
import ModalMusicFormUpdate from './ModalMusicFormUpdate.js'
import ModalMusicDeleteConfirm from './ModalMusicDeleteConfirm.js'
import ModalMusicsDeleteConfirm from './ModalMusicsDeleteConfirm.js'
import ModalMusicsFormUpdate from './ModalMusicsFormUpdate.js'

const {ipcRenderer} = window.require('electron')

function MusicLocalContent ({selectedLocalMusics, setSelectedLocalMusics}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingLocalMusics, setIsLoadingLocalMusics] = useState(false),
    rawLocalMusics = useLocalMusic(),

    localMusics = useMemo(
      () => musicClassification(
        rawLocalMusics.map((s) => ({
          ...s,
          cellTitle: s.track + '. ' + s.title,
          cellSubtitle: s.artist + ' - ' + s.album
        }))
      ),
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

    onSelectGroup = useCallback(
      (musicTracks) => setSelectedLocalMusics((musics) => {
        if(musicTracks.reduce((acc, m) => musics.includes(m) ? acc + 1 : acc, 0) === musicTracks.length) {
          return musics.filter((m) => !musicTracks.includes(m))
        }

        return [...musics, ...musicTracks.filter((m) => !musics.includes(m))]
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
                                                ipcRenderer.send('local-musics-update', [music])
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onEditSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicsFormUpdate key={key}
                                               musics={selectedLocalMusics}
                                               onValidate={(musics) => {
                                                 ipcRenderer.send('local-musics-update', musics)
                                                 setIsLoadingLocalMusics(true)
                                                 setSelectedLocalMusics([])
                                               }}
                                               onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [selectedLocalMusics, setSelectedLocalMusics, addModal, rmModal]
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

  return <Table titleLeft={getLocale('musics-local', localMusics.length)}
                titleRight={selectedLocalMusics.length ? getLocale('musics-selected', selectedLocalMusics.length) : undefined}
                data={localMusics}
                selectedData={selectedLocalMusics}
                onSelect={onSelect}
                onSelectGroup={onSelectGroup}
                onSelectAll={onSelectAll}
                onEdit={onEdit}
                onEditSelected={onEditSelected}
                onDelete={onDelete}
                onDeleteSelected={onDeleteSelected}
                isLoading={isLoadingLocalMusics}/>
}

export default MusicLocalContent
