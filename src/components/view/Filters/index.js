import _ from 'lodash'

let filterOpt = (val, options, itemValue, itemLabel) => {
  let value = val.trim().toUpperCase()
  let arr = []
  if (value || value === 0) {
    arr = _.filter(options, (obj) => {
      let v1 = itemValue ? obj[itemValue] : obj
      let v2 = itemLabel ? obj[itemLabel] : obj
      return ((v1.toString().includes(value.toString())) || v2.toString().includes(value.toString()))
    })
  } else {
    arr = options
  }
  return arr
}

export {filterOpt}