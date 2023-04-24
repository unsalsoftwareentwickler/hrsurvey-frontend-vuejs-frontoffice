<template>
    <div class="login-page">  
        <Message/>    
        <v-card elevation="14" class="login-box" shaped>
            <v-row v-if="this.logoImg!=''" justify="center" class="pt-2"> <a><v-img @click="switchRegister" :src="this.logoImg" max-height="50" max-width="150" contain></v-img></a> </v-row>
            <v-row v-else justify="center" class="pt-2"><a><v-img @click="switchRegister" :src="this.defaultLogoUrl" max-height="50" max-width="150" contain></v-img> </a> </v-row>
            <v-card-text class="text-center pt-4">
                <h2 class="black--text">{{this.title}}</h2>
                <p class="grey--text">{{this.description}}</p>         
            </v-card-text>

            <v-card-text>
                <v-form ref="form">
                    <v-text-field 
                        :label="$t('email')" 
                        v-model="emailLogin" 
                        append-icon="email"
                        :rules="[rules.required,rules.emailRules]"
                        outlined
                        dense
                        rounded
                    >
                    </v-text-field>
                    <v-text-field 
                        :label="$t('password')" 
                        v-model="passwordLogin" 
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"                            
                        :hint="$t('passwordLengthMessage')"                                      
                        @click:append="show = !show"
                        class="mb-10"
                        outlined
                        rounded
                        dense
                    >
                    </v-text-field>

                    <!-- <div class="mb-5 text-center font-weight-bold">
                        <a class="text-decoration-none text-uppercase black--text" @click="superAdminCred">Super Admin</a> 
                        <a class="text-decoration-none text-uppercase black--text pl-6" @click="adminCred">Admin</a> 
                        <a class="text-decoration-none text-uppercase black--text pl-6" @click="userCred">Candidate</a>
                    </div> -->

                    <v-btn :loading="loading" class="text-capitalize mb-2" @click="submit" rounded block dark>{{$t('signIn')}}</v-btn>
                    <v-btn color="grey lighten-2" class="text-capitalize black--text" @click="switchPricing" rounded block>{{$t('register')}}</v-btn>
                </v-form>
            </v-card-text>
            <v-card-actions class="mt-6">
                <v-row justify="center">
                    <v-btn text class="text-capitalize grey--text" @click="forget = true">{{$t('forgetPassword')}}</v-btn>
                </v-row>             
            </v-card-actions>
            <v-expand-transition>
                <v-card v-if="forget" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;">
                    <v-row v-if="this.logoImg!=''" justify="center" class="pt-2"><a><v-img @click="switchRegister" :src="this.logoImg" max-height="50" max-width="150" contain></v-img></a></v-row>
                    <v-row v-else justify="center" class="pt-2"><a><v-img @click="switchRegister" :src="this.defaultLogoUrl" max-height="50" max-width="150" contain></v-img></a></v-row>
                    <v-card-text class="pb-0">
                        <v-form ref="formForget">
                            <v-text-field
                              v-model="emailForget"
                              :label="$t('email')"
                              :rules="[rules.required,rules.emailRules]"
                              clearable                       
                            ></v-text-field>                                                                               
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                        <v-btn @click="forget = false" text color="grey darken-4" class="text-capitalize">{{$t('close')}}</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="sendPassword" text color="grey darken-4" class="text-capitalize">{{$t('sentPassword')}}</v-btn>                       
                    </v-card-actions>
                </v-card>
            </v-expand-transition>
            <v-expand-transition>
                <v-card v-if="registerAdmin" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;">
                    <v-row v-if="this.logoImg!=''" justify="center" class="pt-2"><v-img :src="this.logoImg" max-height="50" max-width="150" contain></v-img></v-row>
                    <v-row v-else justify="center" class="pt-2"><v-img :src="this.defaultLogoUrl" max-height="50" max-width="150" contain></v-img></v-row>                    
                    <v-card-text class="text-center">
                        <h2 class="black--text">{{$t('adminRegister')}}</h2>                              
                    </v-card-text>
                    <v-card-text>
                        <v-form ref="formRegister">
                            <v-text-field 
                                :label="$t('name')" 
                                v-model="fullNameRegister"                               
                                :rules="[rules.required]"
                                clearable
                            >
                            </v-text-field>
                            <v-text-field
                              v-model="emailRegister"
                              :label="$t('email')"
                              :rules="[rules.required,rules.emailRules]"
                              clearable                       
                            ></v-text-field>
                            <v-text-field 
                                :label="$t('password')" 
                                v-model="passwordRegister" 
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show ? 'text' : 'password'"                            
                                hint="At least 8 characters"                                      
                                @click:append="show = !show"
                            >
                            </v-text-field>                                                                                
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="registrationAdmin" class="text-capitalize" rounded dark block>{{$t('register')}}</v-btn>                       
                    </v-card-actions>
                </v-card>
            </v-expand-transition>



            <v-expand-transition>
                <v-card v-if="registerStudent" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;">
                    <v-row v-if="this.logoImg!=''" justify="center" class="pt-2"><v-img :src="this.logoImg" max-height="50" max-width="150" contain></v-img></v-row>
                    <v-row v-else justify="center" class="pt-2"><v-img :src="this.defaultLogoUrl" max-height="50" max-width="150" contain></v-img></v-row>                    
                    <v-card-text class="text-center">
                        <h2 class="black--text">{{$t('candidateRegister')}}</h2>                              
                    </v-card-text>
                    <v-card-text>
                        <v-form ref="formRegister">
                            <v-text-field 
                                :label="$t('name')" 
                                v-model="fullNameRegister"                               
                                :rules="[rules.required]"
                                clearable
                            >
                            </v-text-field>
                            <v-text-field
                              :label="$t('email')"
                              v-model="emailRegister"                            
                              :rules="[rules.required,rules.emailRules]"
                              clearable                       
                            ></v-text-field>
                            <v-text-field 
                                :label="$t('password')" 
                                v-model="passwordRegister" 
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show ? 'text' : 'password'"                            
                                :hint="$t('passwordLengthMessage')"                                      
                                @click:append="show = !show"
                            >
                            </v-text-field>                                                                              
                        </v-form>
                    </v-card-text>
                    <v-card-actions>                      
                        <v-btn @click="registrationStudent" class="text-capitalize" block dark rounded>{{$t('register')}}</v-btn>                       
                    </v-card-actions>
                </v-card>
            </v-expand-transition>
        </v-card>      
    </div>               
</template>

<script>
import Message from '../../components/common/Message'
import config from '../../../public/config'
import i18n from '@/plugins/i18n'

export default {
    name:'Signin',
    components:{
        Message
    },
    data(){
        return{
            rules:{
                required:value=>!!value||this.$t('required'),
                min: v => v.length >= 8 ||this.$t('min8Character'),
                emailRules:v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('emailInvalid')
            },
            registerAdmin: false,
            registerStudent: false,
            forget:false,
            emailForget:'',
            fullNameRegister:'',
            emailRegister:'',
            passwordRegister:'',
            emailLogin:'',
            passwordLogin:'',
            show: false,
            loading:false,
            userInfo:null,
            msg:'',
            userId:null,
            logoImg:'',
            title:'',
            description:'',
            allowPaidRegistration:false,
            registrationAmountWithText:'',
            stripeSessionId:'',
            refAdminId:'',
            defaultLogoUrl:window.location.origin+'/upload/logo-assess-hour.png',           
        }
    },
    methods:{    
        superAdminCred(){
            this.emailLogin='superAdmin@assessHour.com'
            this.passwordLogin='abcd1234'
        },  
        adminCred(){
            this.emailLogin='sangibruse@gmail.com'
            this.passwordLogin='abcd1234'
        },
        userCred(){
            this.emailLogin='shuvo4958@gmail.com'
            this.passwordLogin='abcd1234'
        },
        switchRegister(){
            this.$router.push({name:'Landing'})
        },
        switchPricing(){
            this.$store.dispatch('dashboard/switchRegister',true)
            this.$router.push({name:'Landing'})
        },
        sendPassword(){
            if(this.$refs.formForget.validate()){
                this.$store.dispatch('user/fetchUserInfo',this.emailForget)
                .then((response)=>{
                    if(response.status==200){
                        const objEmail={
                            toEmail:this.emailForget,
                            logoPath:config.hostname+(this.$store.getters['settings/logoPath']==''?this.defaultLogoUrl:this.$store.getters['settings/logoPath'].replace(/\\/g, '/')),
                            siteUrl:window.location.origin,
                            //subject:'Forget Password',
                            siteTitle:this.title,
                            password:response.data.password
                            //body:'We found you an authorized member of <b>'+this.title+'</b>. As you forget your password,here it is: <b>'+response.data.password+'</b>.'
                        }
                        this.$store.dispatch('settings/passwordEmailSent',objEmail)
                        this.$root.$emit('message_from_parent',this.$t('pleaseCheckyouremail'))
                    }else if(response.status==202){
                        this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                    }
                })
            } 
        },
        registrationAdmin(){
            if(this.$refs.formRegister.validate()){
                this.$store.dispatch('dashboard/applyLoading')
                const objUser={          
                    fullName:this.fullNameRegister,
                    email:this.emailRegister,
                    billingPlanId:parseInt(localStorage.getItem('billingPlanId')),
                    password:this.passwordRegister,
                    stripeSessionId:this.stripeSessionId           
                }
                this.$store.dispatch('user/createRegistrationAdmin',objUser)
                .then(response=>{
                    this.$store.dispatch('dashboard/cancelLoading')
                    if(response.status==200){
                        const credential={
                            email:this.emailRegister,
                            password:this.passwordRegister
                        }
                        this.logIn(credential)
                        if(this.$store.getters['settings/allSettings'].allowWelcomeEmail==true){
                            const objEmail={
                                toEmail:this.emailRegister,
                                name:this.fullNameRegister,
                                logoPath:config.hostname+(this.$store.getters['settings/logoPath']==''?this.defaultLogoUrl:this.$store.getters['settings/logoPath'].replace(/\\/g, '/')),
                                siteUrl:window.location.origin,
                                siteTitle:this.title,
                                password:this.passwordRegister,
                                //body:'We are happy to have you with us. As a registed member of <b>'+this.title+'</b> from now you can access to <b>'+this.title+'</b> through this Email: <b>'+this.emailRegister+'</b> and Password: <b>'+this.passwordRegister+'</b>'
                            }
                            this.$store.dispatch('settings/welcomeEmailSent',objEmail)
                        }
                                        
                    }else if(response.status==202){
                        this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        },

        registrationStudent(){
            if(this.$refs.formRegister.validate()){
                this.$store.dispatch('dashboard/applyLoading')
                const objUser={          
                    fullName:this.fullNameRegister,
                    email:this.emailRegister,
                    password:this.passwordRegister,
                    addedBy:this.refAdminId          
                }
                this.$store.dispatch('user/createRegistrationStudent',objUser)
                .then(response=>{
                    this.$store.dispatch('dashboard/cancelLoading')
                    if(response.status==200){
                        const credential={
                            email:this.emailRegister,
                            password:this.passwordRegister
                        }
                        this.logIn(credential)
                        if(this.$store.getters['settings/allSettings'].allowWelcomeEmail==true){
                            const objEmail={
                                toEmail:this.emailRegister,
                                name:this.fullNameRegister,
                                logoPath:config.hostname+(this.$store.getters['settings/logoPath']==''?this.defaultLogoUrl:this.$store.getters['settings/logoPath'].replace(/\\/g, '/')),
                                siteUrl:window.location.origin,
                                body:'We are happy to have you with us. As a registed member of <b>'+this.title+'</b> from now you can access to <b>'+this.title+'</b> through this Email: <b>'+this.emailRegister+'</b> and Password: <b>'+this.passwordRegister+'</b>'
                            }
                            this.$store.dispatch('settings/welcomeEmailSent',objEmail)
                        }
                                        
                    }else if(response.status==202){
                        this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                    }
                })
                .catch(err=>{
                    this.$router.push({name:'NoInternet'})
                    console.log(err)
                })
            }
        },
        submit(){
            if(this.$refs.form.validate()){
                this.loading=true
                const credential={
                    email:this.emailLogin,
                    password:this.passwordLogin
                }
                this.logIn(credential)
            }
        },
        logIn(credential){
            this.$store.dispatch('dashboard/fetchSigninInfo',credential)
            .then(response=>{                                              
                    if(response.status==200){
                        this.userId=parseInt(localStorage.getItem('loggedUserId'))                                                     
                        const objLogHistory={
                            userId:this.userId,
                            ip:this.$store.getters['dashboard/clientInfo'].userIp,
                            browser:this.$store.getters['dashboard/clientInfo'].browserName==null?'others':this.$store.getters['dashboard/clientInfo'].browserName,
                            browserVersion:this.$store.getters['dashboard/clientInfo'].browserVersion,
                            platform:this.$store.getters['dashboard/clientInfo'].platform                             
                        }
                        this.$store.dispatch('dashboard/createLogHistory',objLogHistory)
                        .then((response)=>{
                            if(response.status==200){
                                this.$router.push({name:'Dashboard'})                                                                      
                            }
                        })                                                                          
                    }else if(response.status==204){
                        this.loading=false
                        this.msg=this.$t('incorrectEmailPassword')
                        this.$root.$emit('message_from_parent',this.msg)
                    }                      
                })
            .catch(err => {                   
                if(this.$store.getters['dashboard/authStatus']==='error'){
                    this.loading=false                      
                    this.msg=this.$t('errorNetworkConnection')
                    this.$root.$emit('message_from_parent',this.msg)
                }
                console.log(err)
            }) 
        },
        getSettings(){
            this.$store.dispatch('settings/fetchSiteSettings')
            .then(response=>{
                if(response.status==200){
                    this.logoImg=response.data.logoPath==''?'':config.hostname+response.data.logoPath.replace(/\\/g, '/')
                    this.title=response.data.siteTitle==''?'Assess Hour':response.data.siteTitle
                    this.description=response.data.welComeMessage==''?'Hello there,Sign in to start your task!':response.data.welComeMessage
                    const favicon = document.getElementById('favicon')
                    favicon.href = config.hostname+response.data.faviconPath.replace(/\\/g, '/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        },      
        paidRegistration(){
            var url = new URL(window.location.href)
            var sessionId = url.searchParams.get('session_id')
            var adminId = url.searchParams.get('ad')
            var billingPlanPrice=parseInt(localStorage.getItem('billingPlanPrice'))
            if(adminId){
                this.registerStudent=true
                this.refAdminId=adminId
            }else if(sessionId){
                this.stripeSessionId=sessionId.replace(/{|}/g,'')
                fetch(config.hostname+'/checkout-session?sessionId='+this.stripeSessionId)
                .then(response => response.json())
                .then(data=>{
                        if(data.id==this.stripeSessionId && data.paymentStatus=='paid'){
                            this.registerAdmin=true
                            this.emailRegister=data.customerDetails.email

                            const obj={
                                transactionEmail:data.customerDetails.email,
                                stripeSessionId:this.stripeSessionId,
                                price:data.amountTotal/100,
                                paymentMode:'Online',
                                transactionDetail:this.stripeSessionId
                            }
                            this.$store.dispatch('settings/createRegistrationPayment',obj)
                        }
                    }
                )
                .catch(function (err) {
                    console.log('Error when fetching Checkout session', err);
                });
            }else if(billingPlanPrice==0){
                this.registerAdmin=true
            } 
        },
    },
    computed:{
        chkPaidRegistration(){
            return this.allowPaidRegistration
        },
        stripePostUrl(){
            return config.hostname+'/create-checkout-session-registration'
        }
    },
    created(){
        i18n.locale=(localStorage.getItem('language')==null || localStorage.getItem('language')=='')?'en':localStorage.getItem('language')
        this.paidRegistration()
        if(localStorage.getItem('logCode')!=null){
            this.$store.dispatch('dashboard/updateLogHistory',localStorage.getItem('logCode'))
        }
        this.$store.dispatch('dashboard/switchRegister',false)
        this.$store.dispatch('dashboard/resetApp')
        this.$store.dispatch('dashboard/fetchClientInfo')
        this.$store.dispatch('settings/resetRefreshCount')       
        this.getSettings()
    }
}
</script>

<style scoped>
    .login-page {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 85vh;
    }    
    .login-box {
        width: 380px;
    }
    .v-card--reveal {
        bottom: 0;
        opacity: 1 !important;
        position: absolute;
        width: 100%;
    }
</style>