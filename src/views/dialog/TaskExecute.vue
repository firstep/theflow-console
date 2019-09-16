<template>
  <DialogCard :title="title" :actions="actions">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1" editable>SETTING</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2" :editable="!!form">FORM</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form v-model="settingValid" ref="settingForm">
            <v-text-field label="Opinion" v-model="opinion" required :rules="opinionRule"  />
            <v-textarea v-model="variables" clearable label="Variables(JSON)" :rules="varRule" />
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
          <Form v-if="!!form" :formData="formData" :fields="form.fields" ref="theForm" />
          <div v-if="!form" class="align-center">Current task is no form.</div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </DialogCard>
</template>

<script>
  import Form from "@/views/dialog/Form"
  export default {
    name: "TaskExecute",
    components: {Form},
    props: {
      execute: Function,
      value: Object,
      task: Object,
      title: {
        type: String,
        default: "Execute Task"
      }
    },
    data: () => ({
      settingValid: false,
      form: null,
      formData: {},
      step: 1,
      opinion: "",
      variables: null,
      opinionRule: [
        v => !!v || 'Name is required',
        v => v.length <= 60 || 'Name must be less than 10 characters.',
        v => v.length >= 2 || 'Name must be more than 2 characters.'
      ],
      varRule: [
        v => {
          if(v) {
            try{
              JSON.parse(v)
              return true
            } catch(e) {
              return "Variables must bu a JSON String."
            }
          } else {
            return true
          }
        }
      ]
    }),
    computed: {
      postData: function () {
        return {
          opinion: this.opinion,
          variables: this.variables ? JSON.parse(this.variables) : null,
          formData: !!this.form ? JSON.parse(JSON.stringify(this.formData)) : null
        }
      },
      btnText: function() {
        if(!this.form) return "Execute"
        return this.step == 2 ? "Execute" : "Next"
      }
    },
    methods: {
      actions: function() {
        return {
          cancel: {
            flat: true,
            text: "Cancel",
            handle: () => {
              this.$emit('submit', false)
            }
          },
          execute: {
            key: 'execute',
            flat: true,
            text: this.btnText,
            closable: false,
            handle: async () => {
              if (this.settingValid) {
                if(!!this.form && this.step == 1) {
                  this.step = 2
                  return 
                }
                if(this.execute) {
                  let rst = this.execute(this.postData)
                  this.$emit("submit", rst);
                } else {
                  this.$emit("submit", this.postData);
                }
              } else {
                this.$refs.settingForm.validate()
              }
            }
          }
        };
      }
    },
    created: function() {
      if(!!this.form) {
        this.form.fields.forEach(item => {
          this.formData[item.id] = item.value
        });
      }
    },
    async asyncData({params}) {
      let task = params.task
      if(!task || !task.formKey) return
      let data = await vm.$REST.get(`/flow/tasks/${task.id}/form`)
      return {form: data}
    }
  };
</script>

<style scoped>
.v-card__text > .v-stepper {
  margin: 0 -20px;
  box-shadow: none;
}
</style>