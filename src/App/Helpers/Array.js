
const
  isFlatArraysEquals = (arr1, arr2) => arr1.length === arr2.length && arr1.reduce((acc, v, k) => acc && v === arr2[k], true)


export {isFlatArraysEquals}