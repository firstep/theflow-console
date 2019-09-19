<template>
  <DialogCard title="SELECT DEFINITION" :actions="actions">
    <AppTable
      :showSelect="true"
      :pageSize="5"
      :url="url"
      :headers="headers"
      ref="defTable"
    >
      <template #action="{item}">
            <v-icon @click="diagram(item.id)" title="DIAGRAM" loading="true">
            mdi-image-outline
            </v-icon>
      </template>
    </AppTable>
  </DialogCard>
</template>

<script>
import AppTable from '@/components/Table'
import ImageView from '@/views/dialog/ImageView.vue'
export default {
  components: {
    AppTable
  },
  props: {
    value: Object,
    formKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      url: '/flow/definitions?formKey = ' + this.formKey,
      headers: [
        { text: 'KEY', value: 'key' },
        {
          text: 'NAME',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'VERSION', value: 'version' },
        { text: 'ACTION', value: 'action', sortable: false }
      ]
    }
  },
  methods: {
    actions: function () {
      return {
        cancel: {
          flat: true,
          text: 'Cancel',
          handle: () => {
            this.$emit('submit', false)
          }
        },
        publish: {
          key: 'publish',
          flat: true,
          text: 'Publish',
          closable: false,
          handle: () => {
            let defs = this.$refs.defTable.selected
            if (defs.length === 0) {
              this.$TOAST.info('SELECT PROCESS DEFINITION PLEASE!')
              return null
            }
            this.$emit('submit', defs)
          }
        }
      }
    },
    diagram: async function (id) {
      let img = await this.$REST.get(`/flow/definitions/${id}/resources/diagram`, null, { responseType: 'arraybuffer' })
      if (img) {
        let src = 'data:image/png;base64,' + btoa(new Uint8Array(img).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        this.$dialog.show(ImageView, { url: src, width: 960 })
      }
    }
  }
}
</script>

<style>
</style>
