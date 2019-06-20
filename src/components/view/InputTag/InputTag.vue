<template>
  <div class="input-tag" :style="`width: ${width}px`">
    <div v-if="prepend" class="prepend">{{prepend}}</div>
    <div class="value">
      <inputs v-if="type == 'input' || type == 'datetime-local' || type == 'date'" :type="type" v-model="currentValue" :defaultVal="defaultVal" :placeholder="placeholder" :disabled="disabled" @change="change($event)" :maxlength="maxlength" :minlength="minlength" max="max" min="min"></inputs>
      <date-picker v-if="type == 'datepicker'" :type="datetype" v-model="currentValue" :defaultVal="defaultVal" :placeholder="placeholder" :disabled="disabled" :max="max" :min="min" @change="change($event)"></date-picker>
      <tab-button v-else-if="type == 'tab'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal" @change="change($event)"></tab-button>
      <input-list v-else-if="type == 'inputlist'" v-model="currentValue" :options="options" :id="id" :label="label" :defaultVal="defaultVal" :placeholder="placeholder" @change="change($event)"></input-list>
      <selects v-else-if="type == 'select'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal" @change="change($event)"></selects>
      <input-list-more v-else-if="type == 'inputlistmore'" v-model="currentValue" :id="id" :label="label" :options="options" :disabled="disabled" @change="change($event)"></input-list-more>
    </div>
    <div v-if="append" class="append">{{append}}</div>
  </div>
</template>

<script>
import Inputs from '@view/Inputs/Inputs'
import DatePicker from '@view/DatePicker/DatePicker'
import TabButton from '@view/TabButton/TabButton'
import InputList from '@view/InputList/InputList'
import Selects from '@view/Selects/Selects'
import InputListMore from '@view/InputListMore/InputListMore'

export default {
  components: {
    Inputs,
    DatePicker,
    TabButton,
    InputList,
    Selects,
    InputListMore
  },
  props: {
    width: {
      type: Number,
      default: 292
    },
    type: {
      type: String,
      default: 'input'
    },
    datetype: {
      type: String,
      default: 'date' // datetime-local  date
    },
    value: {
      type: [String, Number, Object, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: function () { return [] }
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: null
    },
    defaultVal: {
      type: [String, Number, Object],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: null
    },
    minlength: {
      type: Number,
      default: null
    },    
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val)
    }
  },
  computed: {
    currentValue: {
      get: function () {
        // if (_.isArray(this.value)) {
        //   let val = _.map(this.value, this.id);
        //   this.value = val
        // }
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss">
.input-tag {
  display: inline-flex;
  border-radius: 6px;
  border: 1px solid rgba($color: $gray-border, $alpha: 1);
  height: 40px;
  box-sizing: border-box;
  font-size: 14px;

  >.prepend, >.append {
    display: inline-block;
    color: $gray-nd;
    line-height: 40px;
    padding: 0 12px;
    background-color: rgba($color: $gray-border, $alpha: .4);
  }
  >.value {
    display: inline-block;
    height: 100%;
    flex: 1;

    >.inputs, >.input-list {
      width: 100%;
      >input {
        vertical-align: 1px;
        border: none;
        border-radius: 0;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
      }
    }

    >textarea {
        vertical-align: 1px;
        border: none;
        border-radius: 0;
        resize: none;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
    }

    >.selects {
      
      >select {
        vertical-align: 1px;
        border: none;
        border-radius: 0;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
      }
    }

    >.tab-button {
      border: none;
      border-radius: 0;
      margin: 0 auto;
    }
  }
  
  &:focus-within, &:hover {
    border: 1px solid rgba(63, 153, 255, 0.8);
    box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
  }
}

input::-ms-input-placeholder {
    text-align: center;
}

input::-webkit-input-placeholder {
    text-align: center;
}
</style>
