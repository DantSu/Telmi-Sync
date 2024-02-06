import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocalMusic } from '../../../Components/LocalMusic/LocalMusicHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'
import Table from '../../../Components/Table/Table.js'
import ModalMusicFormUpdate from './ModalMusicFormUpdate.js'

const {ipcRenderer} = window.require('electron')

function MusicLocalContent ({selectedLocalMusic, setSelectedLocalMusic}) {
  const
    {addModal, rmModal} = useModal(),
    [isLoadingLocalMusic, setIsLoadingLocalMusic] = useState(false),
    rawLocalMusic = useLocalMusic(),

    localMusic = useMemo(
      () => rawLocalMusic.map((s) => ({
        ...s,
        subtitle: s.artist + ' - ' + s.album
      })),
      [rawLocalMusic]
    ),

    onLocalMusicSelect = useCallback(
      (m) => setSelectedLocalMusic((music) => {
        if (music.includes(m)) {
          return music.filter((v) => v !== m)
        } else {
          return [...music, m]
        }
      }),
      [setSelectedLocalMusic]
    ),

    onEdit = useCallback(
      (music) => {
        addModal((key) => {
          const modal = <ModalMusicFormUpdate key={key}
                                              music={music}
                                              onValidate={(music) => {
                                            setIsLoadingLocalMusic(true)
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
          const modal = <ModalDialogConfirm key={key}
                                            title="Suppression d'histoire"
                                            message={<>Êtes-vous sûr de vouloir supprimer la
                                              musique <strong>"{music.title}"</strong> ?</>}
                                            onConfirm={() => {
                                              setIsLoadingLocalMusic(true)
                                              ipcRenderer.send('local-music-delete', music.id)
                                            }}
                                            onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    )

  useEffect(() => {setIsLoadingLocalMusic(false)}, [rawLocalMusic, setIsLoadingLocalMusic])

  return <Table titleLeft={'Mes musiques (' + localMusic.length + ')'}
                titleRight={selectedLocalMusic.length ? selectedLocalMusic.length + ' musique(s) sélectionné(s)' : undefined}
                data={localMusic}
                selectedData={selectedLocalMusic}
                onSelect={onLocalMusicSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoadingLocalMusic}/>
}

export default MusicLocalContent
