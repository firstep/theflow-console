<template>
  <DialogCard title="Start Process" :actions="actions">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1" editable>SETTING</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2" :editable="!!form">FORM</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form v-model="settingValid" ref="settingForm">
          <v-text-field label="BusinessKey" icon="mdi-account" v-model="businessKey" :rules="keyRule" />
          <v-text-field label="ProcessName" icon="mdi-account" v-model="processName" required :rules="nameRule" />
          <v-textarea label="Variables(JSON)" v-model="variables" clearable :rules="varRule" ></v-textarea>
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
          <Form v-if="!!form" :formData="formData" :fields="form.fields" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </DialogCard>
</template>

<script>
  import Form from "@/views/dialog/Form"
  export default {
    components: {Form},
    props: {
      value: Object,
      defId: String,
      defName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        settingValid: false,
        form: null,
        formData: {},
        step: 1,
        showExe: false,
        businessKey: '',
        processName: this.defName,
        variables: null,
        keyRule: [
          v => v.length <= 60 || 'Field must be less than 10 characters.',
          v => !v || v.length >= 2 || 'Field must be more than 2 characters.'
        ],
        nameRule: [
          v => !!v || 'Field is required',
          v => v.length <= 60 || 'Field must be less than 10 characters.',
          v => v.length >= 2 || 'Field must be more than 2 characters.'
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
      };
    },
    computed: {
      postData: function() {
        return {
          businessKey: this.businessKey,
          processDefId: this.defId,
          processName: this.processName,
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
              this.$emit("submit", false);
            }
          },
          execute: {
            key: "execute",
            flat: true,
            text: this.btnText,
            closable: false,
            handle: async () => {
              if (this.settingValid) {
                if(!!this.form && this.step == 1) {
                  this.step = 2
                  return 
                }
                let rst = await this.$REST.post("/flow/process", this.postData)
                if(rst) {
                  this.$emit("submit", rst);
                }
              } else {
                this.$refs.settingForm.validate();
              }
            }
          }
        };
      }
    },
    async asyncData({params}) {
      if(!params.hasForm) {
        return
      }
      let data = await vm.$REST.get(`/flow/definitions/${params.defId}/start_form`)
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
