<template>
  <div id="definition">
    <v-overlay absolute :value="overlay" zIndex="1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <AppTable :url="url" :headers="headers" ref="defTable">
      <template #header>
        <v-btn color="primary" dark class="mt-5 ml-5 mb-5" @click="upload">
          CREATE
        </v-btn>
      </template>
      <template #action="{item}">
        <v-icon class="mr-2" @click="start(item)" title="START">
          mdi-play-circle-outline
        </v-icon>
        <v-icon v-if="editable" class="mr-2" @click="pause(item.id, item.suspended)" :title="item.suspended ? 'ACTIVE' : 'PAUSE'">
          {{ item.suspended ? "mdi-replay" : "mdi-pause-circle-outline" }}
        </v-icon>
        <v-icon v-if="editable" class="mr-2" @click="del(item.id)" title="DELETE" loading="true">
          mdi-trash-can-outline
        </v-icon>
        <v-icon @click="diagram(item.id)" title="DIAGRAM" loading="true">
          mdi-image-outline
        </v-icon>
      </template>
    </AppTable>
  </div>
</template>
<script>
  import helper from "@/components/helper"
  import AppTable from "@/components/Table";
  // import UploadDialog from "@/views/dialog/Upload.vue";
  import StartProcess from "@/views/dialog/StartProcess.vue";
  import ImageView from "@/views/dialog/ImageView.vue";
  export default {
    name: "",
    components: { AppTable, StartProcess, ImageView },
    data() {
      return {
        overlay: false,
        url: "/flow/definitions",
        headers: [
          { text: "KEY", value: "key" },
          {
            text: "NAME",
            align: "left",
            sortable: false,
            value: "name"
          },
          { text: "VERSION", value: "version" },
          { text: "ACTIONS", value: "action", sortable: false }
        ],
        editable: this.$PERMISSION.editable('definition')
      };
    },
    methods: {
      async upload() {
        this.$router.push("/design")
        // let rst = await this.$dialog.showAndWait(UploadDialog, {
        //   persistent: true,
        //   execute: rst => {
        //     let config = {
        //       headers: { "Content-Type": "multipart/form-data" }
        //     };
        //     let param = new FormData();
        //     param.append("file", rst);

        //     return this.$REST.post("/flow/definitions", param, config);
        //   }
        // });
        // if (rst) {
        //   this.$refs.defTable.load();
        // }
      },
      async start(defInst) {
        if(defInst.suspended) {
          return this.$dialog.message.warning('Current definition is suspended.', {position: 'top'})
        }
        let rst = await this.$dialog.showAndWait(StartProcess, {
          width: 680,
          defId: defInst.id,
          defName: defInst.name,
          hasForm: defInst.hasStartForm,
          persistent: true
        });
        if (rst) {
          let confirm = await this.$dialog.confirm({
            text: "Process started, check now?",
            title: "Info"
          })

          if(confirm) {
            this.$router.push("/process")
          }
        }
      },
      async pause(id, suspended) {
        let state = suspended ? "active" : "suspend";
        this.overlay = true;
        let rst = await this.$REST.put(`/flow/definitions/${id}/${state}`);
        this.overlay = false;
        if (rst) {
          this.$refs.defTable.load();
        }
      },
      async del(id) {
        let confirm = await this.$dialog.prompt({
          text: "If you really want to delete it, input the reason please!",
          title: "Warning"
        });
        if (!confirm) return;
        this.overlay = true;
        let rst = await this.$REST.delete(`/flow/definitions/${id}`, {
          reason: confirm
        });
        this.overlay = false;
        if (rst) {
          this.$refs.defTable.load();
        }
      },
      async diagram(id) {
        this.overlay = true;
        let img = await this.$REST.get(`/flow/definitions/${id}/resources/diagram`, null, {responseType: 'arraybuffer'})
        this.overlay = false;
        if(img) {
          let src = 'data:image/png;base64,'+ btoa(new Uint8Array(img).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          this.$dialog.show(ImageView, {url: src, width: 960})
        }
      }
    }
  };
</script>
<style scoped>
</style>
