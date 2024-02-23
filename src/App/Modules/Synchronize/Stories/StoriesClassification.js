const storiesClassification = (stories) => {
  return Object.values(
    stories.reduce(
      (acc, story) => {
        const key = story.category || story.uuid
        if (acc[key] === undefined) {
          return {
            ...acc,
            [key]: {
              tableGroup: story.category || story.uuid,
              tableChildren: [story]
            }
          }
        }
        acc[key].tableChildren = [...acc[key].tableChildren, story]
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
  ).sort((a, b) => {
    if (Array.isArray(a.tableChildren) && !Array.isArray(b.tableChildren)) {
      return -1
    } else if (!Array.isArray(a.tableChildren) && Array.isArray(b.tableChildren)) {
      return 1
    } else if (Array.isArray(a.tableChildren) && Array.isArray(b.tableChildren)) {
      return a.tableGroup.localeCompare(b.tableGroup)
    }
    return a.cellTitle.localeCompare(b.cellTitle)
  })
}

export { storiesClassification }
