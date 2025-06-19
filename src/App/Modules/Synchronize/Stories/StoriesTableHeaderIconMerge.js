import {useModal} from '../../../Components/Modal/ModalHooks.js'
import ButtonIconMerge from '../../../Components/Buttons/Icons/ButtonIconMerge.js'
import TableHeaderIcon from '../../../Components/Table/TableHeaderIcon.js'
import ModalStoriesMergeForm from './ModalStoriesMergeForm.js'



function StoriesTableHeaderIconMerge({selectedStories, setSelectedStories}) {
  const {addModal, rmModal} = useModal()

  return <TableHeaderIcon componentIcon={ButtonIconMerge}
                          title="stories-merge"
                          onClick={() => {
                            addModal((key) => {
                              const modal = <ModalStoriesMergeForm key={key}
                                                                   stories={selectedStories}
                                                                   onClose={() => rmModal(modal)}/>
                              return modal
                            })
                            setSelectedStories([])
                          }}/>
}


export default StoriesTableHeaderIconMerge