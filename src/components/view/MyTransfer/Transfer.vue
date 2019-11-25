<template>
  <div class="my-transfer el-transfer">
    <my-transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :parentData="pdata"
      :data="sourceData"
      :title="titles[0]"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </my-transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <my-transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :parentData="pdata"
      :data="targetData"
      :title="titles[1]"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer"></slot>
    </my-transfer-panel>
  </div>
</template>

<script>
  import MyTransferPanel from './Transfer-panel.vue';

  export default {
    name: 'MyTransfer',
    components: {
      MyTransferPanel,
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      pdata: {
        type: Array,
        default() {
          return [];
        }
      },
      titles: {
        type: Array,
        default() {
          return [];
        }
      },
      buttonTexts: {
        type: Array,
        default() {
          return [];
        }
      },
      filterPlaceholder: {
        type: String,
        default: ''
      },
      filterMethod: Function,
      leftDefaultChecked: {
        type: Array,
        default() {
          return [];
        }
      },
      rightDefaultChecked: {
        type: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      value: {
        type: Array,
        default() {
          return [];
        }
      },
      format: {
        type: Object,
        default() {
          return {};
        }
      },
      filterable: Boolean,
      props: {
        type: Object,
        default() {
          return {
            label: 'label',
            key: 'key',
            disabled: 'disabled'
          };
        }
      },
      targetOrder: {
        type: String,
        default: 'original'
      }
    },

    data() {
      return {
        leftChecked: [],
        rightChecked: [],
      };
    },

    computed: {
      dataObj() {
        const key = this.props.key;
        return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
      },
  
      sourceData() {
        if(!this.value) {
          return this.data.filter(item => [].indexOf(item[this.props.key]) === -1);
        } else {
          return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1);
        }
        
      },

      targetData() {
        if (this.targetOrder === 'original') {
          return this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1);
        } else {
          return this.value.reduce((arr, cur) => {
            const val = this.dataObj[cur];
            if (val) {
              arr.push(val);
            }
            return arr;
          }, []);
        }
      },

      hasButtonTexts() {
        return this.buttonTexts.length === 2;
      }
    },

    watch: {
      value(val) {
        this.dispatch('ElFormItem', 'el.form.change', val || []);
      },
    },

    methods: {
      getMigratingConfig() {
        return {
          props: {
            'footer-format': 'footer-format is renamed to format.'
          }
        };
      },

      onSourceCheckedChange(val, movedKeys) {
        this.leftChecked = val;
        if (movedKeys === undefined) return;
        this.$emit('left-check-change', val, movedKeys);
      },

      onTargetCheckedChange(val, movedKeys) {
        this.rightChecked = val;
        if (movedKeys === undefined) return;
        this.$emit('right-check-change', val, movedKeys);
      },

      addToLeft() {
        let currentValue = this.value.slice();
        this.rightChecked.forEach(item => {
          const index = currentValue.indexOf(item);
          if (index > -1) {
            currentValue.splice(index, 1);
          }
        });
        this.clearQuery('left')
        this.$refs.leftPanel.selectValue = '';
        this.$refs.rightPanel.selectValue = '';
        this.$emit('input', currentValue);
        this.$emit('change', currentValue, 'left', this.rightChecked);
      },

      addToRight() {
        let currentValue = this.value.slice();
        const itemsToBeMoved = [];
        const key = this.props.key;
        this.data.forEach(item => {
          const itemKey = item[key];
          if (
            this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
          ) {
            itemsToBeMoved.push(itemKey);
          }
        });
        currentValue = this.targetOrder === 'unshift'
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved);

        this.$refs.leftPanel.selectValue = '';
        this.$refs.rightPanel.selectValue = '';
        this.clearQuery('right')
        this.$emit('input', currentValue);
        this.$emit('change', currentValue, 'right', this.leftChecked);
      },

      clearQuery(which) {
        if (which === 'left') {
          this.$refs.leftPanel.query = '';
        } else if (which === 'right') {
          this.$refs.rightPanel.query = '';
        }
      },

    //   -------------
        dispatch(componentName, eventName, params) {
          var parent = this.$parent || this.$root;
          var name = parent.$options.componentName;

          while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;

            if (parent) {
              name = parent.$options.componentName;
            }
          }
          if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
          }
        },


        t(path, options) {
          let value = this.i18nHandler.apply(this, arguments);
          if (value !== null && value !== undefined) return value;

          const array = path.split('.');
          let current = lang;

          for (let i = 0, j = array.length; i < j; i++) {
            const property = array[i];
            value = current[property];
            if (i === j - 1) return this.formattemplate(value, options);
            if (!value) return '';
            current = value;
          }
          return '';
        },


        i18nHandler() {
          const vuei18n = Object.getPrototypeOf(this || Vue).$t;
          if (typeof vuei18n === 'function' && !!Vue.locale) {
            if (!merged) {
              merged = true;
              Vue.locale(
                Vue.config.lang,
                deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
              );
            }
            return vuei18n.apply(this, arguments);
          }
        },

        formattemplate(string, ...args) {
          if (args.length === 1 && typeof args[0] === 'object') {
            args = args[0];
          }

          if (!args || !args.hasOwnProperty) {
            args = {};
          }

          return string.replace(RE_NARGS, (match, prefix, i, index) => {
            let result;

            if (string[index - 1] === '{' &&
              string[index + match.length] === '}') {
              return i;
            } else {
              result = hasOwn(args, i) ? args[i] : null;
              if (result === null || result === undefined) {
                return '';
              }

              return result;
            }
          });
        }


    }
  };
</script>

<style lang="scss" scoped>
.my-transfer {
  .el-transfer__buttons {
    padding: 190px 6px;
    button {
      width: 24px;
      height: 24px;
      padding: 0;
      box-shadow: none;

    }
  }
  .el-transfer-panel {
    border: 1px solid #DDE6ED;
    border-radius: 6px;
    flex: 1;
    .el-transfer-panel__header {
      height: 36px;
      line-height: 36px;
      background: #F1F5F8;
      padding-left: 10px;
      border-bottom: none;
    }
  }
}
  
</style>

