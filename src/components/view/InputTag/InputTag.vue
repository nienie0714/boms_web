<template>
  <div class="input-tag">
    <div v-if="prepend" class="prepend">{{prepend}}</div>
    <div class="value">
      <inputs v-if="type == 'input'" v-model="currentValue" :defaultVal="defaultVal"></inputs>
      <tab-button v-else-if="type == 'tab'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal"></tab-button>
      <input-list v-else-if="type == 'inputlist'" v-model="currentValue" :options="options" :id="id" :label="label" :defaultVal="defaultVal"></input-list>
      <selects v-else-if="type == 'select'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal"></selects>
    </div>
    <div v-if="append" class="append">{{append}}</div>
  </div>
</template>

<script>
import Inputs from '@view/Inputs/Inputs'
import TabButton from '@view/TabButton/TabButton'
import InputList from '@view/InputList/InputList'
import Selects from '@view/Selects/Selects'

export default {
  components: {
    Inputs,
    TabButton,
    InputList,
    Selects
  },
  props: {
    type: {
      type: String,
      default: 'input'
    },
    value: {
      type: [String, Number, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
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
    change (value) {
      this.$emit('change', value)
    }
  },
  computed: {
    currentValue: {
      get: function () {
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
  display: inline-block;
  width: fit-content;
  border-radius: 6px;
  border: 1px solid rgba($color: $gray-border, $alpha: 1);
  height: 38px;
  font-size: 14px;
  // line-height: 38px;
  // overflow: hidden;

  >.prepend, >.append {
    display: inline-block;
    color: $gray-nd;
    padding: 0 12px;
    background-color: rgba($color: $gray-border, $alpha: .4);
  }
  >.value {
    display: inline-block;
    height: fit-content;
    width: fit-content;

    >.inputs, >.input-list {
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
    }
  }
  
  &:focus-within, &:hover {
    border: 1px solid rgba(63, 153, 255, 0.8);
    box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
  }
}
</style>
