const musicClassification = (musics) => {
  return Object.values(
    musics.reduce(
      (acc, music) => {
        const key = music.artist + '_' + music.album
        if (acc[key] === undefined) {
          return {
            ...acc,
            [key]: {
              tableGroup: music.artist + ' - ' + music.album,
              tableChildren: [music]
            }
          }
        }
        acc[key].tableChildren = [...acc[key].tableChildren, music]
        return acc
      },
      {}
    )
  ).reduce(
    (acc, category) => {
      if (category.tableChildren.length < 2) {
        return [...acc, ...category.tableChildren]
      } else {
        return [...acc, category]
      }
    },
    []
  )
}

export { musicClassification }
