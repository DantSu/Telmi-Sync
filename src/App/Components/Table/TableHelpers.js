const isCellSelected = (cellsSelected, cell) => {
  return Array.isArray(cellsSelected) && cellsSelected.find((d) => d.cellId === cell.cellId) !== undefined
}

export {isCellSelected}