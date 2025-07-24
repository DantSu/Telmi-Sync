const
  sortByName = (stories) => stories.sort((a, b) => {
    if ((a.age - b.age) === 0) {
      return a.title.localeCompare(b.title)
    } else {
      return a.age - b.age
    }
  }),
  sortByUpdatedAt = (stories) => stories.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))

export {sortByUpdatedAt, sortByName}