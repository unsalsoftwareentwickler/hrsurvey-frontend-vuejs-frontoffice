<template>
    <v-container class="px-0">
        <Message/>
        <v-form ref="form">
            <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                    <v-text-field
                        v-model="newPassword"
                        :label="$t('newPassword')"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        :hint="$t('passwordLengthMessage')"
                        @click:append="show = !show"
                        clearable
                    >
                    </v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                    <v-text-field
                        v-model="confirmPassword"
                        :label="$t('confirmNewPassword')"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        :hint="$t('passwordLengthMessage')"
                        @click:append="show = !show"   
                        clearable                   
                    >
                    </v-text-field>
                </v-col>               
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                    <v-btn
                        color="primary"
                        @click="change"
                    >
                        {{$t('change')}}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>   
</template>

<script>
import Message from '../../components/common/Message'

export default {
    name:'Password',
    components:{
        Message
    },
    data(){
        return{
            rules:{
                required:value=>!!value||this.$t('required'),
                min: v => v.length >= 8 || this.$t('min8Character')
            },
            newPassword:'',
            confirmPassword:'',
            show: false,           
        }
    },
    methods:{
        change(){
            if(this.$refs.form.validate()){
                const objUser={
                    userId:parseInt(localStorage.getItem('loggedUserId')),
                    password:this.newPassword
                }
                if(this.newPassword!=this.confirmPassword){
                    this.$root.$emit('message_from_parent_long',this.$t('passwordNotMatched'))
                }else{
                    this.$store.dispatch('user/changePassword',objUser)
                    .then(response=>{
                            if(response.status==200){
                                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))                    
                            }else if(response.status==202){
                                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                            }
                        })
                    .catch(err=>{
                        this.$router.push({name:'NoInternet'})
                        console.log(err)
                    })
                }
            }
            
        }
    }
}
</script>