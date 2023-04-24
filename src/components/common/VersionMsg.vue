<template>
    <v-snackbar v-model="snackbar" :timeout="timeout" right vertical>
        {{msg}}
        <template v-slot:action="{ attrs }">
            <v-btn color="blue" text class="text-capitalize" v-bind="attrs" @click="snackbar=false">{{ $t('close') }}</v-btn>
            <v-btn color="white" text class="text-capitalize" v-bind="attrs" @click="updateVersion()">{{ $t('refresh') }}</v-btn>
        </template>
    </v-snackbar>
</template>
<script>
export default {
    name:'VersionMsg',
    data(){
        return{
            snackbar: false,
            msg: this.$t('newContentsAvailable'),
            timeout: -1,
            appSettings:{}
        }
    },
    methods:{
        updateVersion(){      
            this.snackbar=false
            this.$store.dispatch('settings/changeAppVersion',this.appSettings.version)
            location.reload()
            //location.replace(window.location.origin)
        },
        chkAppVersion(){
            this.appSettings=this.$store.getters['settings/allSettings']
            if(this.$store.getters['settings/appVersion']!=this.appSettings.version){
                this.snackbar=true
            }
        }
    },
    created(){
        this.chkAppVersion()
    }
}
</script>