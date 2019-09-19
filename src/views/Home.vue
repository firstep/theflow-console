<template>
  <v-app>
    <!-- left sider -->
    <v-navigation-drawer width=230 app dense permanent clipped mini-variant-width=60 :expand-on-hover="drawer">
      <AppMenu>
        <v-subheader v-if="!drawer">MEMU</v-subheader>
      </AppMenu>
    </v-navigation-drawer>

    <!-- head -->
    <v-app-bar height=60 app flat clipped-left dense>
      <v-icon v-if="!drawer">mdi-polymer</v-icon>
      <v-toolbar-title v-if="!drawer">TheFlow</v-toolbar-title>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
                text
                v-on="on"
                min-height="60"
              >
              {{username}}
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item link="true">
            <v-list-item-title @click="logout">LOGOUT</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- content -->
    <v-content>
      <v-container fluid fill-height>
          <router-view />
      </v-container>
    </v-content>

    <!-- foot -->
    <!-- <v-footer app>
      <span>&copy; 2019</span>
    </v-footer> -->

  </v-app>
</template>

<script>
import AppMenu from '@/views/Menu'

export default {
  name: 'home',
  components: { AppMenu },
  data () {
    return {
      drawer: null,
      username: this.$HELPER.session.username
    }
  },
  methods: {
    logout: async function () {
      await this.$REST.post('logout')
      this.$router.push('/login')
    }
  }
}

</script>

<style>
  .v-application{
    background-color: #EEEEEE !important;
    font-size: 12px;
  }
  .v-toolbar{
    border-bottom: 1px solid #e6e6e6!important;
  }
  .v-toolbar__title{
    padding-left: 10px;
  }
  .v-app-bar__nav-icon{
    margin-left: 65px;
  }
  .fill-height > div{
    height: 100%;
    width: 100%;
  }
  html {
    overflow-y: auto !important;
  }
</style>
