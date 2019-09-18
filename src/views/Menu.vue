<template>
  <v-list dense nav class="menu">
    <slot />
    <template v-for="item in items">
      <!-- single item -->
      <v-list-item v-if="!item.items && isAccess(item)" :key="item.title" :to="item.url" @click="focus">
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- group item -->
      <v-list-group v-if="item.items && isAccess(item)" v-model="item.active" :key="item.title" :prepend-icon="item.icon" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item-group color="indigo">
          <template v-for="subItem in item.items">
          <v-list-item v-if="isAccess(subItem)" :key="subItem.title" :to="subItem.url">
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </template>
        </v-list-item-group>
      </v-list-group>
    </template>
  </v-list>
</template>
<script>
import helper from "@/components/helper"
export default {
  name: 'AppMenu',
  data() {
    return {
      drawer: null,
      items: [
        {
          icon: 'mdi-home',
          title: 'DASHBOARD',
          url: '/'
        },
        {
          icon: 'mdi-merge',
          title: 'PROCESS',
          items: [
            { title: 'TODO', url: '/todo'},
            { title: 'DEFINITION', url:"/definitions", resource: 'definition' },
            { title: 'DESIGN', url: '/design', resource:'definition'},
            { title: 'INSTANCE', url:'/process', resource: 'process' },
          ]
        }
      ]
    }
  },
  methods: {
    focus() {
      this.items.filter(item => item.active === true).forEach(item => item.active = false)
    },
    isAccess(item) {
      return this.$PERMISSION.accessable(item.resource)
    }
  }
}

</script>
<style scoped>
  .menu .v-list-group__items .v-list-item__content {
    margin-left: 54px
  }
</style>
