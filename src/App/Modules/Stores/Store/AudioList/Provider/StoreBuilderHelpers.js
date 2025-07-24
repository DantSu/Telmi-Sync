const
  getDefaultCategory = (defaultTitle, defaultQuestion) => ({
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
        if(r !== null) {
          return [k, ...r]
        }
      }
      return null
    },
    null
  ),

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

export {getDefaultCategory, getElementInAudioList, findElementInAudioList, addAudioItems, insertAudioItems, removeAudioItem}