const
  getDefaultCategory = (defaultTitle, defaultQuestion) => ({
    id: Date.now().toString(36),
    title: defaultTitle || '',
    question: defaultQuestion || '',
    audio: []
  }),

  getElementInAudioList = (audioList, audioListKeys) => {
    if (!audioListKeys.length) {
      return audioList
    }
    return getElementInAudioList(audioList.audio[audioListKeys.shift()], audioListKeys)
  },

  findElementInAudioList = (audioList, element) => audioList.audio.reduce(
    (acc, e, k) => {
      if (acc !== null) {
        return acc
      }
      if (e === element) {
        return [k]
      }
      if (Array.isArray(e.audio)) {
        const r = findElementInAudioList(e, element)
        if (r !== null) {
          return [k, ...r]
        }
      }
      return null
    },
    null
  ),

  getFirstAudioOfAudioList = (audioList) => audioList.audio.reduce(
    (acc, a) => acc !== null ? acc : (Array.isArray(a.audio) ? getFirstAudioOfAudioList(a) : a),
    null
  ),

  doAudioListValidation = (audioList) => {
    const firstAudio = getFirstAudioOfAudioList(audioList)
    if (firstAudio === null) {
      return null
    }
    return {
      ...audioList,
      image: firstAudio.image,
      audio: audioList.audio.reduce(
        (acc, a) => {
          if (Array.isArray(a.audio)) {
            const child = doAudioListValidation(a)
            return child === null ? acc : [...acc, child]
          }
          return [...acc, a]
        },
        []
      )
    }
  },

  updateAudioItem = (audioList, audioListKeys, item) => {
    if (!audioListKeys.length) {
      return item
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = updateAudioItem(audioList.audio[audioListKey], audioListKeys, item)
    return {...audioList}
  },

  updateAudioItemField = (audioList, audioListKeys, field, value) => {
    if (!audioListKeys.length) {
      return {
        ...audioList,
        [field]: value
      }
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = updateAudioItemField(audioList.audio[audioListKey], audioListKeys, field, value)
    return {...audioList}
  },

  addAudioItems = (audioList, audioListKeys, items) => {
    if (!audioListKeys.length) {
      return {
        ...audioList,
        audio: [...audioList.audio, ...items]
      }
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = addAudioItems(audioList.audio[audioListKey], audioListKeys, items)
    return {...audioList}
  },

  insertAudioItems = (audioList, audioListKeys, index, items) => {
    if (!audioListKeys.length) {
      return {
        ...audioList,
        audio: [
          ...audioList.audio.slice(0, index),
          ...items,
          ...audioList.audio.slice(index)
        ]
      }
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = insertAudioItems(audioList.audio[audioListKey], audioListKeys, index, items)
    return {...audioList}
  },

  removeAudioItem = (audioList, audioListKeys) => {
    if (audioListKeys.length === 1) {
      return {
        ...audioList,
        audio: [...audioList.audio.slice(0, audioListKeys[0]), ...audioList.audio.slice(audioListKeys[0] + 1)]
      }
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = removeAudioItem(audioList.audio[audioListKey], audioListKeys)
    return {...audioList}
  }

export {
  getDefaultCategory,
  getElementInAudioList,
  findElementInAudioList,
  getFirstAudioOfAudioList,
  doAudioListValidation,
  updateAudioItem,
  updateAudioItemField,
  addAudioItems,
  insertAudioItems,
  removeAudioItem
}