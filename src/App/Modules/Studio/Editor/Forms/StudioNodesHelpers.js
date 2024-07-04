const
  addStage = (nodes) => {
    let i = Object.keys(nodes.stages).length
    while (nodes.stages['s' + i] !== undefined) {
      ++i
    }
    nodes.stages['s' + i] = {
      image: null,
      audio: null,
      ok: null,
      home: null,
      control: {
        ok: false,
        home: true,
        autoplay: true
      }
    }
    return 's' + i
  },
  addAction = (nodes) => {
    let i = Object.keys(nodes.actions).length
    while (nodes.actions['a' + i] !== undefined) {
      ++i
    }
    nodes.actions['a' + i] = []
    return 'a' + i
  },
  addStageOption = (nodes, stageNodeFrom, StageIdTo) => {
    if (stageNodeFrom.ok === null) {
      stageNodeFrom.ok = {action: addAction(nodes), index: 0}
    }
    nodes.actions[stageNodeFrom.ok.action].push({stage: StageIdTo})
    return {...nodes}
  },
  addInventoryItem = (nodes) => {
    let i = nodes.inventory.length
    const findId = (v) => v.id === ('i' + i)
    while (nodes.inventory.findIndex(findId) !== -1) {
      ++i
    }
    nodes.inventory.push({
      id: 'i' + i,
      name: '',
      initialNumber: 0,
      maxNumber: 1,
      counterAsBar: false,
      image: null,
    })
    return nodes.inventory.length - 1
  },
  nodesMoveObject = (nodes, objectsArray, objectFromKey, objectTo) => {
    if (objectsArray[objectFromKey] === objectTo) {
      return nodes
    }
    const
      objectFrom = objectsArray.splice(objectFromKey, 1),
      objectToKey = objectsArray.findIndex((v) => v === objectTo)
    objectsArray.splice(
      objectToKey + (objectToKey >= objectFromKey ? 1 : 0),
      0,
      ...objectFrom
    )
    return {...nodes}
  },
  addNote = (notes, stageId, title) => {
    notes[stageId] = {title: title || stageId, text: ''}
    return {...notes}
  },
  getConditionComparator = () => (['<', '<=', '=', '>', '>='])

export {addStage, addAction, addStageOption, addInventoryItem, nodesMoveObject, addNote, getConditionComparator}