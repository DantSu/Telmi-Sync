const
  isCellSelected = (cellsSelected, cell) => {
    return Array.isArray(cellsSelected) && cellsSelected.find((d) => d.cellId === cell.cellId) !== undefined
  },
  checkGroupDisplayValue = (display) => {
    return display > 1 ? 0 : display
  }

export {isCellSelected, checkGroupDisplayValue}