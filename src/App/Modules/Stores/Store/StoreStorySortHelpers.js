const
  getSortName = (a, b) => (a.age - b.age) === 0 ? a.title.localeCompare(b.title) : a.age - b.age,
  sortByName = (stories, asc) => stories.sort((a, b) => asc ? getSortName(a, b) : getSortName(b, a)),
  getSortUpdateAt = (a, b) => Date.parse(a.updated_at) - Date.parse(b.updated_at),
  sortByUpdatedAt = (stories, asc) => stories.sort((a, b) => asc ? getSortUpdateAt(a, b) : getSortUpdateAt(b, a))

export {sortByUpdatedAt, sortByName}