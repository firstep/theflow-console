<template>
  <div>
    <v-data-table class="table-card"
      v-model="selected"
      :show-select="showSelect"
      :single-select="singleSelect"
      :headers="headers"
      :items="rows"
      :items-per-page="3"
      :loading="loading"
      loading-text="Loading... Please wait"
      hide-default-footer>
      <template #top>
        <slot name="header" />
      </template>
      <template v-slot:footer>
        <v-divider />
        <v-layout class="table-footer" wrap fill-height align-center justify-end>
          <v-flex xs5>
            Showing {{from}} to {{to}} of {{total}} entries
          </v-flex>
          <v-flex xs7>
            <v-pagination v-model="page" @input="paging" :length="totalPage === 0 ? 1 : totalPage" :total-visible="showPage"></v-pagination>
          </v-flex>
        </v-layout>
      </template>
      <template v-for="head in headers" v-slot:[`item.${head.value}`]=" {item} " >
        <slot :name="head.value" :item="item">
          {{item[head.value]}}
        </slot>
      </template>
      <!-- <template v-slot:[`item.${actionColumn}`]="{ item }">
        <slot name="action" :item="item" />
      </template> -->
    </v-data-table>
  </div>
</template>
<script>
export default {
  name: 'AppTable',
  props: {
    url: String,
    showSelect: Boolean,
    singleSelect: Boolean,
    pageSize: {
      type: Number,
      default: 10
    },
    headers: Array,
    showPage: {
      type: Number,
      default: 5
    },
    requestHandler: {
      type: Function,
      default: function (page, pageSize) {
        return { page: page, size: pageSize }
      }
    },
    responseHandler: {
      type: Function,
      default: function (data) {
        return { total: data['total'], rows: data['rows'] }
      }
    }
  },
  data () {
    return {
      page: 1,
      total: 0,
      rows: [],
      selected: [],
      loading: false
    }
  },
  computed: {
    totalPage: function () {
      return Math.ceil(this.total / this.pageSize)
    },
    from: function () {
      return this.total === 0 ? 0 : ((this.page - 1) * this.pageSize) + 1
    },
    to: function () {
      let to = this.page * this.pageSize
      return this.total === 0 || to > this.total ? this.total : to
    }
  },
  methods: {
    paging (page) {
      this.load()
    },
    async load (url = this.url) {
      // url = url || this.url
      if (!url) return
      this.selected = []
      this.loading = true
      let rst = await this.$REST.get(url, this.requestHandler && this.requestHandler(this.page, this.pageSize))
      this.loading = false
      if (rst) {
        let data = this.responseHandler && this.responseHandler(rst)
        this.total = data['total']
        this.rows = data['rows']
      }
    }
  },
  mounted () {
    this.load()
  }
}

</script>
<style scoped>
.v-pagination {
  justify-content: flex-end;
}

.table-card {
  border-radius: 3px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.04);
  background-color: #fff;
}

.table-footer {
  padding: 10px 0 10px 16px;
  background-color: #f7f7f7;
  color: #616161;
  font-size: 12px
}

</style>
