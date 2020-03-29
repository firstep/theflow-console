<template>
  <div>
    <v-overlay
        absolute
        :value="overlay"
        zIndex=2
      >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-tabs v-model="tab" background-color="transparent" color="basil" class="tab-head">
      <v-tab key="process">PROCESS</v-tab>
      <v-tab key="form">FORM</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tab-content">
      <v-tab-item key="process">
          <iframe v-if="editable" src="/modeler/#/processes" frameborder="0" height="100%" width="100%" scrolling="no" ></iframe>
      </v-tab-item>
      <v-tab-item key="form">
          <iframe v-if="editable" src="/modeler/#/forms" frameborder="0" height="100%" width="100%" scrolling="no" ></iframe>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import DefinitionSel from '@/views/dialog/DefinitionSel.vue'
export default {
  data () {
    return {
      overlay: false,
      tab: null,
      editable: this.$PERMISSION.has('definition:edit')
    }
  },
  methods: {

  },
  components: {

  },
  created: function () {
    let that = this
    window.vm.$on('publish-process', async function (id) {
      if (!id) return
      let confirm = await this.$dialog.confirm({
        text: 'Do you really want to publish it?',
        title: 'Confirm'
      })
      if (!confirm) return

      that.overlay = true
      let rst = await this.$REST.post(`/flow/definitions/models/${id}`)
      that.overlay = false
      if (rst) {
        this.$TOAST.success('Publish sucess!')
      }
    })

    // window.vm.$on('publish-form', async function (id, key) {
    //   if (!id || !key) return
    //   let rst = await this.$dialog.showAndWait(DefinitionSel, {
    //     width: 640,
    //     formKey: key,
    //     persistent: true
    //   })
    //   if (!rst) return

    //   that.overlay = true
    //   let deploys = rst.map(def => this.$REST.post(`/flow/definitions/${def.id}/forms/models/${id}`))
    //   let rsts = await Promise.all(deploys)
    //   that.overlay = false
    //   if (rsts.find(v => !v)) {
    //     this.$TOAST.error('Publish faild!')
    //   } else {
    //     this.$TOAST.success('Publish sucess!')
    //   }
    // })
  },
  beforeDestroy () {
    window.vm.$off('publish-process')
    // window.vm.$off('publish-form')
  }
}
</script>

<style>
  .tab-head {
    position: absolute;
    top: 12px;
    z-index: 1;
  }
  .tab-content div {
    width: 100%;
    height: 100%;
  }
  .tab-content {
    width: 100%;
    height: 100%;
    padding-top: 48px;
    background-color: #eee !important;
  }
</style>
