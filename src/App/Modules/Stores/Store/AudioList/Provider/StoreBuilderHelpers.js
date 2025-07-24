const
  getDefaultCategory = (defaultTitle, defaultQuestion) => ({
    title: defaultTitle || '',
    question: defaultQuestion || '',
    audio: []
  }),

  findCategory = (audioList, audioListKeys) => {
    if (!audioListKeys.length) {
      return audioList
    }
    return findCategory(audioList.audio[audioListKeys.shift()], audioListKeys)
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

  removeAudioItem = (audioList, audioListKeys, item) => {
    if (audioListKeys.length === 1) {
      return {
        ...audioList,
        audio: [...audioList.audio.slice(0, audioListKeys[0]), ...audioList.audio.slice(audioListKeys[0] + 1)]
      }
    }
    const audioListKey = audioListKeys.shift()
    audioList.audio[audioListKey] = removeAudioItem(audioList.audio[audioListKey], audioListKeys, item)
    return {...audioList}
  }

export {getDefaultCategory, findCategory, addAudioItems, removeAudioItem}