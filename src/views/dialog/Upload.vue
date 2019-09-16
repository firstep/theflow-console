<template>
  <DialogCard title="Upload" :actions="actions">
    <v-form v-model="valid" ref="uploadForm">
      <v-file-input
        display-size
        label="BPMN"
        placeholder="Pick an BPMN file"
        :rules="rules"
        accept="text/xml"
        @change="changImg"
      ></v-file-input>
    </v-form>
  </DialogCard>
</template>

<script>
  export default {
    props: {
      execute: Function,
      value: Object
    },
    data() {
      return {
        rst: null,
        valid: false,
        rules: [
          value => value && value.size != undefined || "File is required.",
          value => !value || value.size < 2000000 || "File size should be less than 2 MB!"
        ]
      };
    },
    methods: {
      changImg: function(file) {
          if(file){
              this.rst = file
          }
      },
      actions: function() {
        return {
          cancel: {
            flat: true,
            text: "Cancel",
            handle: () => {
              this.$emit("submit", false);
            }
          },
          execute: {
            key: "execute",
            flat: true,
            text: "Execute",
            closable: false,
            handle: async () => {
              if (this.valid) {
                if (this.execute) {
                  let rsts = await this.execute(this.rst);
                  if(rsts) {
                      this.$emit("submit", true);
                  }
                } else {
                  this.$emit("submit", this.rst);
                }
              } else {
                this.$refs.uploadForm.validate();
              }
            }
          }
        };
      }
    }
  };
</script>

<style scoped>
</style>
