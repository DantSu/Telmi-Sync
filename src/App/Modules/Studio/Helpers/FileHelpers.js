const
  getStageImagePath = (stage, metadata) => stage.newImage || (stage.image ? metadata.path + '/images/' + stage.image : undefined),
  getStageAudioPath = (stage, metadata) => stage.newAudio || (stage.audio ? metadata.path + '/audios/' + stage.audio : undefined)


export {getStageImagePath, getStageAudioPath}