const
  metadataToStartStageObject = (metadata, startAction) => ({
    image: metadata.newImageTitle || metadata.imageTitle || null,
    audio: metadata.newAudioTitle || metadata.audioTitle || null,
    ok: startAction,
    home: null,
    control: {
      ok: true,
      home: true,
      autoplay: false
    }
  })


export {metadataToStartStageObject}