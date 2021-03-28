<template>
  <div>
    <div>propsNum: {{ number }}</div>
    <div>
      ChildNum: {{ childNum }}
      <input v-model="childNum" />
    </div>
    <div>
      onlyChild: {{ childNum2 }}
      <input v-model="childNum2" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'child',
  props: ['number'],
  watch: {
    childNum(val) {
      this.$emit('change', val);
    }
  },
  data() {
    return {
      childNum: 0,
      childNum2: 0
    };
  },
  created() {
    console.log('child created');
  },
  mounted() {
    console.log('child mounted');
  },
  beforeUpdate() {
    console.log('child before update');
  },
  updated() {
    console.log('child update');
  }
};
</script>
