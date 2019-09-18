<template>
    <v-app>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark flat>
                                <v-icon class="mr-1">mdi-polymer</v-icon>
                                <v-toolbar-title>TheFlow</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-form ref="loginForm" v-model="valid">
                                    <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" type="text" :rules="rules" required @keyup.enter="login" />
                                    <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock" type="password" :rules="rules" required @keyup.enter="login" />
                                </v-form>
                            </v-card-text>
                            <v-card-actions class="pb-8 pl-8 pr-8">
                                <v-btn block large color="primary" @click="login">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
export default {
    name:"AppLogin",
    props: {
        source: String,
    },
    data: () => ({
        valid: false,
        username: '',
        password: '',
        rules:[
            v => !!v || 'Text is required',
            v => v.length <= 60 || 'Text must be less than 10 characters.',
            v => v.length >= 2 || 'Text must be more than 2 characters.'
        ]
    }),
    methods: {
      login: async function(){
        if(!this.valid){
            this.$refs.loginForm.validate()
            return
        }
        let data = {username: this.username, password: this.password}
        let response = await this.$REST.post('auth', data);
        if(response){
            this.$HELPER.session.reset(response)
            this.$router.push("/")
        }
      }
    },
    created: function() {
        this.$HELPER.session.clear()
    }
}
</script>