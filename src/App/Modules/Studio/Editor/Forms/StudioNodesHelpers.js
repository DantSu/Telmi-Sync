const
  addStage = (nodes) => {
    let i = Object.keys(nodes.stages).length
    while (nodes.stages['s' + i] !== undefined) {
      ++i
    }
    nodes.stages['s' + i] = {
      'image': null,
      'audio': null,
      'ok': null,
      'home': null,
      'control': {
        'ok': false,
        'home': true,
        'autoplay': false
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
  addNote = (notes, stageId, title) => {
    notes[stageId] = {title: title || stageId, text: ''}
    return {...notes}
  }

export {addStage, addAction, addStageOption, addNote}