<template>
  <div id="process">
    <v-overlay
        absolute
        :value="overlay"
        zIndex=1
      >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-tabs v-model="tab" background-color="transparent" color="basil">
      <v-tab key="running">RUNNING</v-tab>
      <v-tab key="history">HISTORY</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="running">
      <AppTable :url="runningUrl" :headers="runningHeaders" ref="runningTable">
        <template #action="{item}">
          <v-icon class="mr-2" @click="execute(item.id)" title="EXECUTE">
            mdi-play-circle-outline
          </v-icon>
          <v-icon
            v-if="editable"
            class="mr-2"
            @click="pause(item.id, item.suspended)"
            title="PAUSE"
          >
            {{ item.suspended ? "mdi-replay" : "mdi-pause-circle-outline" }}
          </v-icon>
          <v-icon v-if="editable" class="mr-2" @click="del(item.id)" title="DELETE">
            mdi-trash-can-outline
          </v-icon>
          <v-icon @click="showDiagram(item.id)" title="DIAGRAM">
            mdi-image-outline
          </v-icon>
        </template>
        <template #suspended="{item}">
          <v-chip :color="item.suspended ? 'gray' : 'green'" small dark>{{
            item.suspended ? "SUSPEND" : "ACTIVE"
          }}</v-chip>
        </template>
      </AppTable>
      </v-tab-item>
      <v-tab-item key="history">
        <AppTable :url="historyUrl" :headers="historyHeaders" ref="historyTable">
          <template #action="{item}">
            <v-icon @click="showHistory(item.id)" title="TASKS">
              mdi-clock-outline
            </v-icon>
            <v-icon v-if="editable" @click="delHistory(item.id)" title="DELETE">
              mdi-trash-can-outline
            </v-icon>
            <v-icon @click="showDiagram(item.id)" title="DIAGRAM">
              mdi-image-outline
            </v-icon>
          </template>
          <template #durationMills="{item}">
            {{((item.durationMills % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(2) + 'H'}}
          </template>
        </AppTable>
      </v-tab-item>
    </v-tabs-items>
    <AppTask ref="taskSider" />
  </div>
</template>
<script>
import AppTable from '@/components/Table'
import AppTask from '@/views/Task'
import ImageView from '@/views/dialog/ImageView.vue'
export default {
  name: 'AppProcess',
  components: { AppTable, AppTask },
  data () {
    return {
      overlay: false,
      tab: null,
      runningUrl: '/flow/process/running',
      historyUrl: '/flow/process/history',
      runningHeaders: [
        { text: 'BUSINESS KEY', value: 'businessKey' },
        { text: 'NAME', value: 'name' },
        { text: 'START USER', value: 'startUser' },
        { text: 'START TIME', value: 'startTime' },
        { text: 'CURRENT STEP', value: 'currTaskName' },
        { text: 'STATE', value: 'suspended' },
        { text: 'ACTIONS', value: 'action', sortable: false, align: 'center' }
      ],
      historyHeaders: [
        { text: 'BUSINESS KEY', value: 'businessKey' },
        { text: 'NAME', value: 'name' },
        { text: 'START USER', value: 'startUser' },
        { text: 'START TIME', value: 'startTime' },
        { text: 'END TIME', value: 'endTime' },
        { text: 'DURATION TIME', value: 'durationMills' },
        { text: 'DELETE REASON', value: 'deleteReason' },
        { text: 'ACTIONS', value: 'action', sortable: false, align: 'center' }
      ],
      editable: this.$PERMISSION.has('process:edit')
    }
  },
  methods: {
    execute (id) {
      this.$refs.taskSider.load(id, 'running')
    },
    async pause (id, suspended) {
      this.overlay = true
      let state = suspended ? 'active' : 'suspend'
      let rst = await this.$REST.put(`/flow/process/${id}/${state}`)
      this.overlay = false
      if (rst) {
        this.$refs.runningTable.load()
      }
    },
    async del (id) {
      let confirm = await this.$dialog.prompt({
        text: 'If you really want to delete it, input the reason please!',
        title: 'Warning'
      })
      if (!confirm) return
      this.overlay = true
      let rst = await this.$REST.delete(`/flow/process/${id}`, { reason: confirm })
      this.overlay = false
      if (rst) {
        this.$refs.runningTable.load()
      }
    },
    async showDiagram (id) {
      this.overlay = true
      let img = await this.$REST.get(`/flow/process/${id}/diagram`, null, { responseType: 'arraybuffer' })
      this.overlay = false
      if (img) {
        let src = 'data:image/png;base64,' + btoa(new Uint8Array(img).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        this.$dialog.show(ImageView, { url: src, width: 960, title: 'ggggg' })
      }
    },
    showHistory (id) {
      this.$refs.taskSider.load(id, 'history')
    },
    async delHistory (id) {
      let confirm = await this.$dialog.confirm({
        text: 'Do you really want to delete it?',
        title: 'Warning'
      })
      if (!confirm) return
      this.overlay = true
      let rst = await this.$REST.delete(`/flow/process/${id}/history`, { reason: confirm })
      this.overlay = false
      if (rst) {
        this.$refs.historyTable.load()
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
