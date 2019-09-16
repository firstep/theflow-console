<template>
  <div class="form">
    <template v-for="item in fields">
      <v-text-field
        v-if="item.type == 'text'"
        :label="item.name"
        :required="item.required"
        :style="layout(item)"
        v-model="formData[item.id]"
      />
      <v-textarea
        v-if="item.type == 'multi-line-text'"
        :label="item.name"
        :required="item.required"
        v-model="formData[item.id]"
      />
    </template>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      fields: Array,
      formData: Object
    },
    methods: {
      layout: function(field){
        if(field.params && field.params.column) {
          return `width: ${100/field.params.column}%`
        } else {
          return 'width: 100%'
        }
      }
    }
  };
</script>

<style scoped>
.form .v-input {
  display: inline-table;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
}
</style>
