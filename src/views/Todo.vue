<template>
  <div id="todo">
    <v-overlay
        absolute
        :value="overlay"
        zIndex=1
      >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-tabs v-model="tab" background-color="transparent" color="basil">
      <v-tab key="todo">TODO</v-tab>
      <v-tab key="toclaim">TOCLAIM</v-tab>
      <v-tab key="finished">FINISHED</v-tab>
      <v-tab key="started">STARTED</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="todo">
        <AppTable :url="todoUrl" :headers="runningHeaders" ref="todoTable">
          <template #action="{item}">
            <v-icon class="mr-2" title="ASSIGNEE">
              mdi-clipboard-flow
            </v-icon>
            <v-icon class="mr-2" title="DELEGATE">
              mdi-clipboard-account-outline
            </v-icon>
            <v-icon class="mr-2" title="RELEASE">
              mdi-clipboard-outline
            </v-icon>
            <v-icon class="mr-2" title="COMPLATE">
              mdi-clipboard-check-outline
            </v-icon>
            <v-icon @click="showDiagram(item.id)" title="Diagram">
              mdi-image-outline
            </v-icon>
          </template>
        </AppTable>
      </v-tab-item>
      <v-tab-item key="toclaim">
        <AppTable
          :url="toclaimUrl"
          :headers="runningHeaders"
          ref="toclaimTable"
          :showSelect="true"
        >
        <template #action="{item}">
            <v-icon @click="claim(item.currTaskId)" title="CLAIM">
                mdi-clipboard-plus
            </v-icon>
        </template>
        </AppTable>
      </v-tab-item>
      <v-tab-item key="finished">
        <AppTable
          :url="finishedUrl"
          :headers="historyHeaders"
          ref="finishedTable"
        >
        <template #state="{item}">
            <v-chip :color="getState(item).color" :title="item.deleteReason" small dark>{{getState(item).text}}</v-chip>
        </template>
        <template #action="{item}">
            <v-icon @click="showHistory(item.id)" title="TASKS">
                mdi-clock-outline
            </v-icon>
        </template>
        <template #durationMills="{item}">
        {{ item.durationMills ? ((item.durationMills % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(2) + 'H' : ''}}
        </template>
        </AppTable>
      </v-tab-item>
      <v-tab-item key="started">
        <AppTable
          :url="startedUrl"
          :headers="historyHeaders"
          ref="startedTable"
        >
        <template #state="{item}">
            <v-chip :color="getState(item).color" :title="item.deleteReason" small dark>{{getState(item).text}}</v-chip>
        </template>
        <template #action="{item}">
            <v-icon @click="showHistory(item.id)" title="TASKS">
                mdi-clock-outline
            </v-icon>
        </template>
        <template #durationMills="{item}">
        {{ item.durationMills ? ((item.durationMills % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(2) + 'H' : ''}}
        </template>
        </AppTable>
      </v-tab-item>
    </v-tabs-items>
    <AppTask ref="taskSider" />
  </div>
</template>

<script>
  import AppTable from "@/components/Table";
  import AppTask from "@/views/Task";
  import ImageView from "@/views/dialog/ImageView.vue";
  export default {
    components: { AppTable, AppTask },
    data() {
      return {
        overlay: false,
        tab: null,
        todoUrl: "/flow/process/todo",
        toclaimUrl: "/flow/process/unclaimed",
        finishedUrl: "/flow/process/involved",
        startedUrl: "/flow/process/started",
        runningHeaders: [
          { text: "BUSINESS KEY", value: "businessKey" },
          { text: "NAME", value: "name" },
          { text: "START USER", value: "startUser" },
          { text: "START TIME", value: "startTime" },
          { text: "CURRENT STEP", value: "currTaskName" },
          { text: "STATE", value: "suspended" },
          { text: "ACTIONS", value: "action", sortable: false, align: "center" }
        ],
        historyHeaders: [
          { text: "BUSINESS KEY", value: "businessKey" },
          { text: "NAME", value: "name" },
          { text: "START USER", value: "startUser" },
          { text: "START TIME", value: "startTime" },
          { text: "END TIME", value: "endTime" },
          { text: "DURATION TIME", value: "durationMills" },
          { text: "STATE", value: "state" },
          { text: "ACTIONS", value: "action", sortable: false, align: "center" }
        ]
      };
    },
    methods: {
        getState: function(item) {
            if(item.deleteReason) {
                return {text:"DELETED", color: "#757575"}
            } else if(item.ended) {
                return {text:"FINISHED", color: "teal"}
            } else if(item.suspended) {
                return {text:"SUSPENDED", color: "amber"}
            } else {
                return {text:"ACTIVE", color: "green"}
            }
        },
        showHistory(id){
            this.$refs.taskSider.load(id, 'history');
        },
        async showDiagram(id) {
            this.overlay = true;
            let img = await this.$REST.get(`/flow/process/${id}/diagram`, null, {responseType: 'arraybuffer'})
            this.overlay = false;
            if(img) {
            let src = 'data:image/png;base64,'+ btoa(new Uint8Array(img).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            this.$dialog.show(ImageView, {url: src, width: 960})
            }
        },
        async claim(id) {
            if(!id) return

            this.overlay = true
            let rst = await this.$REST.put(`/flow/tasks/${id}/claim`)
            this.overlay = false
            if(rst) {
                this.$refs.toclaimTable.load()
            }
        }
    }
  };
</script>

<style>
</style>
