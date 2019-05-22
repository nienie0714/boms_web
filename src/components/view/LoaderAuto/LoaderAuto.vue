<script>
export default {
  props: ['component', 'path'],
  render: function (createElement) {
    this.$options.components[this.component] = resolve => require.ensure([], () => resolve('../../../views/' + this.path + ''))
    return createElement(this.component)
  }
}
</script>
