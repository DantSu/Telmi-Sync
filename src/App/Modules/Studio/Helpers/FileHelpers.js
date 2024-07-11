const
  isFileDefined = (file, path) => typeof file !== 'string' || file === '' ? null : path + file,
  isImageDefined = (file, path) => typeof file !== 'string' || file === '' ? null : path + '/images/' + file,
  isAudioDefined = (file, path) => typeof file !== 'string' || file === '' ? null : path + '/audios/' + file


export {isFileDefined, isImageDefined, isAudioDefined}