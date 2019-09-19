<template>
  <div class="form">
    <template v-for="item in fields">
      <v-text-field
        v-if="item.type == 'text'"
        :key="item.id"
        :label="item.name"
        :required="item.required"
        :style="layout(item)"
        v-model="formData[item.id]"
      />
      <v-textarea
        v-if="item.type == 'multi-line-text'"
        :key="item.id"
        :label="item.name"
        :required="item.required"
        v-model="formData[item.id]"
      />
      <v-menu
        v-if="item.type == 'date'"
        :key="item.id"
        v-model="dateMenu[item.id]"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
        :style="layout(item)"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="formData[item.id]"
            :label="item.name"
            :required="item.required"
            readonly
            v-on="on"
            :style="layout(item)"
          ></v-text-field>
        </template>
        <v-date-picker v-model="formData[item.id]" no-title scrollable @input="dateMenu[item.id] = false">
        </v-date-picker>
      </v-menu>
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
    data: () => ({
      dateMenu: {}
    }),
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
