<template>
  <v-navigation-drawer
      absolute
      right
      v-model="rightSider"
      width="860"
      class="right-sider"
      :class="{'elevation-6':rightSider}"
    >
  <v-toolbar flat>
      <v-toolbar-title>
        <v-menu open-on-hover offset-y v-if="tag == 'running'">
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            dark
            v-on="on"
            :loading="loading"
          >
            ACTIONS
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="claim" >
            <v-icon class="mr-4">mdi-clipboard-plus</v-icon>
            <v-list-item-title>CLAIM</v-list-item-title>
          </v-list-item>
          <v-list-item @click="assignee" >
            <v-icon class="mr-4">mdi-clipboard-flow</v-icon>
            <v-list-item-title>ASSIGNEE</v-list-item-title>
          </v-list-item>
          <v-list-item @click="delegate" >
            <v-icon class="mr-4">mdi-clipboard-account-outline</v-icon>
            <v-list-item-title>DELEGATE</v-list-item-title>
          </v-list-item>
          <v-list-item @click="release" >
            <v-icon class="mr-4">mdi-clipboard-outline</v-icon>
            <v-list-item-title>RELEASE</v-list-item-title>
          </v-list-item>
          <v-list-item @click="complate" >
            <v-icon class="mr-4">mdi-clipboard-check-outline</v-icon>
            <v-list-item-title>COMPLATE</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="reject" >
            <v-icon class="mr-4">mdi-clipboard-arrow-left-outline</v-icon>
            <v-list-item-title>REJECT</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-icon @click="closeRightSider">mdi-close</v-icon>
      </v-toolbar-items>
  </v-toolbar>
  <AppTable ref="historyTaskTable" :headers="historyHeaders" v-show="tag == 'history'">
    <template #durationMills="{item}">
      {{((item.durationMills % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(2) + 'H'}}
    </template>
  </AppTable>
  <AppTable ref="runningTaskTable" :showSelect=true :singleSelect=true :headers="runningHeaders" v-show="tag == 'running'">
    <template #header>
      
    </template>
    <template #suspended="{item}">
      <v-chip :color="item.suspended ? 'grey' :'green'" small dark>{{ item.suspended ? "SUSPEND" : "ACTIVE" }}</v-chip>
    </template>
    <template #delegated="{item}">
      <v-chip :color="item.delegated ? 'amber' :'grey'" small dark>{{ item.suspended ? "DELEGATED" : "OWNED" }}</v-chip>
    </template>
  </AppTable>
  </v-navigation-drawer>
</template>

<script>
import AppTable from "@/components/Table"
import TaskExecute from "@/views/dialog/TaskExecute"
export default {
  name: 'AppTask',
  components: {AppTable},
  data() {
    return {
      rightSider : false,
      updated: false,
      loading: false,
      tag: '',
      processId: '',
      runningHeaders: [
        { text: 'NAME', value: 'name'},
        { text: 'OWNER', value: 'center' },
        { text: 'ASSIGNEE', value: 'assignee' },
        { text: 'CREATE TIME', value: 'createTime' },
        { text: 'CLAIM TIME', value: 'claimTime' },
        { text: 'DELEGATED', value: 'delegated' },
        { text: 'SUSPENDED', value: 'suspended' }
      ],
      historyHeaders: [
        { text: 'NAME', value: 'name'},
        { text: 'ASSIGNEE', value: 'assignee' },
        { text: 'CREATE TIME', value: 'createTime' },
        { text: 'END TIME', value: 'endTime' },
        { text: 'DURATION TIME', value: 'durationMills' }
      ],
    }
  },
  methods: {
    load: function(id, tag){
      //有ID 说明是组件外调用，重置updated，没有ID说明组件内处理过，更新为updated
      this.updated = id ? false : (!this.updated ? true : this.updated)
      this.tag = tag || this.tag
      this.processId = id || this.processId
      if(!this.processId) return
      this.rightSider = true
      if(this.tag == 'running') {
        this.$refs.runningTaskTable.load(`/flow/process/${this.processId}/tasks/running`)
      }else if(this.tag == 'history'){
        this.$refs.historyTaskTable.load(`/flow/process/${this.processId}/tasks/history`)
      }
    },
    preAct: function(){
      let tasks = this.$refs.runningTaskTable.selected;
      if(tasks.length == 0){
        this.$dialog.message.info("SELECT TASK PLEASE!", {
          position: 'top'
        })
        return null
      }
      return tasks[0]
    },
    doAct: async function(uri, body, config){
      this.loading = true
      
      let rst = await this.$REST.put(uri, body, config)
      this.loading = false
      if(rst) this.load()
    },
    claim: function(){
      let task = this.preAct()
      if(task)
        this.doAct(`/flow/tasks/${task.id}/claim`)
    },
    assignee: async function() {
      let task = this.preAct()
      if(!task) return

      let uid = await this.$dialog.prompt({
        text: 'Assignee To',
        title: 'Please input username'
      })
      if(!uid) return

      this.doAct(`/flow/tasks/${task.id}/assignee`, null, {params:{userId: uid}})
    },
    release: function(){
      let task = this.preAct()
      if(!task) return

      this.doAct(`/flow/tasks/${task.id}/assignee`)
    },
    delegate: async function() {
      let task = this.preAct()
      if(!task) return

      let uid = await this.$dialog.prompt({
        text: 'Delegate To',
        title: 'Please input username'
      })
      if(!uid) return

      this.doAct(`/flow/tasks/${task.id}/delegate`, null, {params:{userId: uid}})
    },
    complate: async function(){
      let task = this.preAct()
      if(!task) return

      let rst = await this.$dialog.showAndWait(TaskExecute, {
        task: task, 
        width: 680,
        title: "COMPLATE TASK", 
        persistent: true,
        execute: data => {
          return this.$REST.put(`/flow/tasks/${task.id}/complate`, data)
        }
      })
      if(rst) {
        this.load()
      }
    },
    reject: async function() {
      let task = this.preAct()
      if(!task) return

      let rst = await this.$dialog.showAndWait(TaskExecute, {
        title:"REJECT TASK",
        width: 680,
        persistent: true, 
        execute: data => {
          return this.$REST.put(`/flow/tasks/${task.id}/back`, data)
        }
      })
      if(rst) {
        this.load()
      }
    },
    closeRightSider() {
        this.rightSider = !this.rightSider;
        if (this.updated) {
          //this.$refs.runningTable.load(); 
          this.$emit('updated')
        }
    }
  }
}
</script>

<style scoped>
  .right-sider {
    background-color: #eeeeee !important;
  }
</style>