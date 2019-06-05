<script>
import _ from 'lodash'

export default {
  mounted () {
    this.$nextTick(() => {
      this.changeWindowSize()
    })
  },
  methods: {
    changeWindowSize () {},
    showValue (row, item) {
      let value = '-'
      if (_.get(row, item.key)) {
        if (item.format) {
          if (item.format.constructor == Array) {
            value = this.formatSubstr(_.get(row, item.key), item.format)
          } else {
            let method = item.format
            method({row: row, item: item}, val => {
              value = val
            })
          }
        } else if (item.hasOwnProperty('enumKey')) {
          let obj = {
            key: item.enumKey,
            value: _.get(row, item.key)
          }
          value = this.$store.getters.getName(obj) || value
        } else {
          value = _.get(row, item.key) || value
        }
      } else if (_.get(row, item.key) === 0) {
        value = 0
      }
      return value
    },
    formatSubstr (value, indexArr) {
      return value.substr(indexArr[0], indexArr[1])
    }
  }
}
</script>
