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
      home: {action: 'backAction', index: 0},
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
      display: 0,
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
  getComparisonOperators = () => (['<', '<=', '==', '>', '>=', '!=']),
  doComparisonOperator = (itemCount, conditionNumber, conditionComparator) => {
    switch (conditionComparator) {
      case 0:
        return itemCount < conditionNumber
      case 1:
        return itemCount <= conditionNumber
      case 2:
        return itemCount === conditionNumber
      case 3:
        return itemCount > conditionNumber
      case 4:
        return itemCount >= conditionNumber
      case 5:
        return itemCount !== conditionNumber
      default:
        return false
    }
  },
  getAssigmentOperators = () => (['+=', '-=', '=']),
  doAssignmentOperator = (itemCount, updateNumber, updateType) => {
    switch (updateType) {
      case 0:
        return itemCount + updateNumber
      case 1:
        return itemCount - updateNumber
      default:
        return updateNumber
    }
  }

export {addStage, addAction, addStageOption, addInventoryItem, nodesMoveObject, addNote, getComparisonOperators, doComparisonOperator, getAssigmentOperators, doAssignmentOperator}