const storiesClassification = (stories) => {
  return Object.values(
    stories.reduce(
      (acc, story) => {
        const key = story.category || story.uuid
        if (acc[key] === undefined) {
          return {
            ...acc,
            [key]: {
              tableGroup: key,
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
  )
}

export { storiesClassification }
