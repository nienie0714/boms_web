import _ from 'lodash'

let filterOpt = (val, options, id, label) => {
  let value = val
  if (_.isString(value)) {
    value = value.trim().toUpperCase()
  }
  let arr = []
  if (value || value === 0) {
    arr = _.filter(options, (obj) => {
      let v1 = id ? obj[id] : obj
      let v2 = label ? obj[label] : obj
      return ((v1.toString().includes(value.toString())) || v2.toString().includes(value.toString()))
    })
  } else {
    arr = options
  }
  return arr
}

export {filterOpt}