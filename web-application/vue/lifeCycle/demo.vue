<template>
  <div>
    <div>
      father {{ number }};

      <input v-model="number" />
    </div>
    emitByChild: {{ childVal }}
    <child :number="number" @change="changeVal" />
  </div>
</template>

<script>
import child from './child';
export default {
  name: 'father',
  components: {
    child
  },
  data() {
    return {
      number: 0,
      childVal: 0
    };
  },
  methods: {
    changeVal(val) {
      this.childVal = val;
    }
  },
  created() {
    console.log('father created');
  },
  mounted() {
    console.log('father mounted');
  },
  beforeUpdate() {
    console.log('father before update');
  },
  updated() {
    console.log('father update');
  }
};
</script>
