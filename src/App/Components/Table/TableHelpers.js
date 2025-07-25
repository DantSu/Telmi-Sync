const
  findData = (dataList, data) => {
    const index = dataList.findIndex((v) => (v.tableGroup !== undefined) ? v.tableChildren.indexOf(data) !== -1 : data === v)
    if(index === -1) {
      return null
    }
    const isInGroup = dataList[index].tableGroup !== undefined
    return {
      index: index,
      isInGroup,
      indexInGroup: isInGroup ? dataList[index].tableChildren.indexOf(data) : -1
    }
  },

  orderIndexes = (index1, index2) => {
    if(
      index1.index > index2.index ||
      (index1.index === index2.index && index1.isInGroup && index1.indexInGroup > index2.indexInGroup)
    ) {
      return [index2, index1]
    }
    return [index1, index2]
  },

  isCellSelected = (cellsSelected, cell) => {
    return Array.isArray(cellsSelected) && cellsSelected.find((d) => d.cellId === cell.cellId) !== undefined
  },

  checkGroupDisplayValue = (display) => {
    return display > 1 ? 0 : display
  }

export {findData, orderIndexes, isCellSelected, checkGroupDisplayValue}