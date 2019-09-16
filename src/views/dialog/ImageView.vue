<template>
  <v-card>
    <v-img
      :src="url"
      
    ></v-img>
  </v-card>
</template>

<script>
  export default {
    props:{
        url: String
    },
    data() {
      return {};
    },
    methods: {
        closeClick () {
        this.$emit('submit', 'test')
        }
    },
    components: {}
  };
</script>

<style>
</style>
