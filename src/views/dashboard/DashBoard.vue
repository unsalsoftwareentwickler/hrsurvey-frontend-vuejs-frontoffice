<template>
    <v-container class="px-0">
        <Message/>
        <v-row v-if="itemsQuiz.length==0 && roleName=='Student'" justify="center" class="font-weight-bold">{{$t('noAssessment')}}</v-row>
        <v-row v-else-if="itemsQuiz.length>0 && roleName=='Student'" justify="center" class="font-weight-bold">{{$t('availableAssessment')}}</v-row>
        <v-row justify="center" v-if="roleName=='Student'">
            <v-col cols="12" sm="6" md="4" v-for="item in itemsQuiz" :key="item.quizTopicId">
                <v-card color="grey lighten-3" shaped elevation="6">
                    <v-card-text class="pb-0">
                        <p class="title text--primary">{{item.quizTitle}}</p>
                    </v-card-text>
                    <v-list class="pa-0">
                        <v-list-item class="py-0">
                            <v-list-item-icon><v-icon>timer</v-icon></v-list-item-icon>
                            <v-list-item-title>{{ $t('time') }}</v-list-item-title>
                            <v-list-item-title>{{item.quizTime==0?'':item.quizTime+' minutes'}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="py-0">
                            <v-list-item-icon><v-icon>grade</v-icon></v-list-item-icon>
                            <v-list-item-title>{{ $t('marks') }}</v-list-item-title>
                            <v-list-item-title>{{item.quizTotalMarks==0?'':item.quizTotalMarks}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="py-0">
                            <v-list-item-icon><v-icon>help</v-icon></v-list-item-icon>
                            <v-list-item-title>{{ $t('questions') }}</v-list-item-title>
                            <v-list-item-title>{{item.questionsCount}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <form v-bind:action="stripePostUrl" method="POST" v-if="item.quizPrice>0 && item.paymentCount==0 && chkPaymentAllowed==true">
                            <input type="hidden" name="quizTopicId" v-bind:value="item.quizTopicId">
                            <input type="hidden" name="adminId" v-bind:value="loggedUserId">
                            <v-btn type="submit" class="text-capitalize white--text" color="grey darken-2" @click="saveQuizTopicId(item)">{{ $t('pay') }} {{getCurrency}}{{item.quizPrice}}</v-btn>
                        </form>
                        <v-btn v-else class="white--text" color="grey darken-2" @click="initializeInstruction(item)">{{ $t('start') }}</v-btn>
                    </v-card-actions>                   
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="roleName=='Admin'">
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card :to="{name:'Users'}" class="grey lighten-1">
                    <v-card-title>
                        <v-icon x-large left>{{this.userIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('candidate')}} <span class="black--text">{{totalStudents}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card :to="{name:'QuizTopics'}" class="grey lighten-2">
                    <v-card-title>
                        <v-icon x-large left>{{this.assessIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('assess')}} <span class="black--text">{{totalQuizes}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card :to="{name:'QuizTopics'}" class="grey lighten-3">
                    <v-card-title>
                        <v-icon x-large left>{{this.assessIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('liveAssess')}} <span class="black--text">{{liveQuizes}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card :to="{name:'Quizes'}" class="grey lighten-4">
                    <v-card-title>
                        <v-icon x-large left>{{this.questionIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('question')}} <span class="black--text">{{totalQuestions}}</span></v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="roleName=='SuperAdmin'">
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card :to="{name:'Users'}" class="grey lighten-1">
                    <v-card-title>
                        <v-icon x-large left>{{this.userIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('admin')}} <span class="black--text">{{totalStudents}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card class="grey lighten-2">
                    <v-card-title>
                        <v-icon x-large left>{{this.assessIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('assess')}} <span class="black--text">{{totalQuizes}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card class="grey lighten-3">
                    <v-card-title>
                        <v-icon x-large left>{{this.assessIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('liveAssess')}} <span class="black--text">{{liveQuizes}}</span></v-card-text>
                </v-card>
            </v-col>
            <v-col class="pl-2" cols="12" sm="6" md="3">
                <v-card class="grey lighten-4">
                    <v-card-title>
                        <v-icon x-large left>{{this.questionIcon}}</v-icon>       
                    </v-card-title>
                    <v-card-text>{{$t('question')}} <span class="black--text">{{totalQuestions}}</span></v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
            >      
                <v-card>
                    <v-toolbar
                        dark                       
                    >
                        <v-btn
                            icon
                            dark
                            @click="dialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-toolbar-title>{{$t('instructions')}}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn                          
                            text
                            class="text-capitalize"
                            @click="continueQuiz()"
                            >
                            <h3>{{$t('continue')}}</h3> 
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-timeline align-top dense>
                        <v-timeline-item small dark v-for="item in itemsInstruction" :key="item.instructionId">
                            {{item.description}}
                        </v-timeline-item>
                    </v-timeline>
                </v-card>        
            </v-dialog>
        </v-row>
        <Analytics class="pa-0" v-if="roleName=='Admin' || roleName=='SuperAdmin'"/>
    </v-container>
</template>

<script>
import config from '../../../public/config'
import Analytics from '../../components/common/Analytics'
import Message from '../../components/common/Message'

export default {
    name:'Dashboard',
    components:{
        Analytics,
        Message,
    },
    data(){
        return{         
            itemsQuiz:[],  
            itemsInstruction:[],
            userInfo:{},
            totalStudents:'',
            totalQuizes:'',
            liveQuizes:'',
            totalQuestions:'',
            userId:null,
            isPaymentAllowed:false, 
            dialog:false ,
            notifications:false,
            sound:true,
            widgets:false,
            userIcon:'',
            assessIcon:'',
            questionIcon:''                 
        }
    },
    methods:{
        fetchMenus(){
            this.$store.dispatch('menu/fetchMenu')
            .then((response)=>{
                //console.log(response.data)
                this.userIcon=response.data[3].iconClass
                this.assessIcon=response.data[5].iconClass
                this.questionIcon=response.data[6].iconClass
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        initializeStudent(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('dashboard/fetchLiveQuizes',this.userInfo.email)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsQuiz=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        initializeAdmin(id){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('dashboard/fetchSummary',id)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                    this.totalStudents=response.data.totalStudents
                    this.totalQuizes=response.data.totalQuizes
                    this.liveQuizes=response.data.liveQuizes
                    this.totalQuestions=response.data.totalQuestions
                }
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        initializeInstruction(item){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchInstructions',item.quizTopicId)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.data.length>0){
                    this.dialog=true
                    this.itemsInstruction=response.data
                    this.$store.dispatch('quiz/storeSingleQuiz',item)
                }else{
                    this.startQuiz(item)
                }              
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        startQuiz(item){          
            this.$store.dispatch('dashboard/applyLoading')
            const objResponseInitial={
                userId:parseInt(localStorage.getItem('loggedUserId')),
                email:this.userInfo.email,
                quizTopicId:item.quizTopicId,
                quizTitle:item.quizTitle,
                quizMark:item.quizTotalMarks,
                quizPassMarks:item.quizPassMarks,
                quizTime:item.quizTime,
                addedBy:parseInt(localStorage.getItem('loggedUserId'))
            }
            this.$store.dispatch('dashboard/createInitialResponse',objResponseInitial)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                    this.$store.dispatch('dashboard/startQuiz',item)
                    this.$store.dispatch('dashboard/saveQuizLiveTime',item.quizTime)
                    this.$router.push({name:'StartQuiz'})
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
        },
        continueQuiz(){
            this.dialog=false
            this.startQuiz(this.$store.getters['quiz/singleQuiz'])
        },
        saveQuizTopicId(item){
            localStorage.setItem('quizTopicId', item.quizTopicId)
        },
        roleActions(){
            if(this.userInfo.roleName=='Student'){
                this.$store.dispatch('dashboard/applyLoading')
                this.$store.dispatch('settings/fetchSingleSettings',this.userInfo.addedBy)
                .then((response)=>{
                    this.$store.dispatch('dashboard/cancelLoading')
                    if(response.status==200){
                        if(response.data.currency!='' && response.data.currencySymbol!='' && response.data.stripeSecretKey!=''){
                            this.isPaymentAllowed=true
                        }else{
                            this.isPaymentAllowed=false
                        }
                        this.initializeStudent()
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            }else if(this.userInfo.roleName=='Admin'){
                this.initializeAdmin(this.userInfo.userId)
                this.$store.dispatch('settings/fetchSingleSettings',this.userInfo.userId)
            }else if(this.userInfo.roleName=='SuperAdmin'){
                this.initializeAdmin(this.userInfo.userId)
            }
        },
        makePayment(){
            var url = new URL(window.location.href);
            var sessionId = url.searchParams.get('session_id');
            if(sessionId){
                var uniqueId=sessionId.replace(/{|}/g,'')
                fetch(config.hostname+'/checkout-session-quiz-pay?sessionId='+uniqueId+'&adminId='+this.userInfo.addedBy)
                .then(response => response.json())
                    .then(data=>{
                            if(data.id==uniqueId && data.paymentStatus=='paid'){                      
                                const obj={
                                    quizTopicId:parseInt(localStorage.getItem('quizTopicId')),
                                    email:this.userInfo.email,
                                    amount:data.amountTotal/100,
                                    currency:this.$store.getters['settings/currency'],
                                    sessionId:uniqueId,
                                    addedBy:this.userInfo.userId,
                                    adminId:this.userInfo.addedBy
                                }
                                this.$store.dispatch('quiz/createPayment',obj)
                                .then(response=>{
                                    if(response.status==200){
                                        location.replace(window.location.origin+'/dashboard')                                       
                                    }else if(response.status==202){
                                        this.$root.$emit('message_from_parent',response.data.responseMsg)
                                    }
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                            }
                        }
                    )
                .catch(function (err) {
                    console.log('Error when fetching Checkout session', err);
                });
            }
        },
        makeRenewal(){
            var url = new URL(window.location.href);
            var renewId = url.searchParams.get('renew_id')
            if(renewId){
                var stripeUniqueId=renewId.replace(/{|}/g,'')
                fetch(config.hostname+'/checkout-session?sessionId='+stripeUniqueId)
                .then(response => response.json())
                .then(data=>{
                        if(data.id==stripeUniqueId && data.paymentStatus=='paid'){
                            const objNewPlan={
                                addedBy:this.userInfo.userId,
                                transactionEmail:data.customerDetails.email,
                                userEmail:this.userInfo.email,
                                stripeSessionId:stripeUniqueId,
                                billingPlanId:localStorage.getItem('billingPlanId'),
                                paymentMode:'Online',
                                transactionDetail:stripeUniqueId
                            }
                            this.$store.dispatch('user/updateBillingPlan',objNewPlan)
                            .then((response)=>{
                                if(response.status==200){
                                    this.$router.push({name:'Landing'})
                                    this.$root.$emit('message_from_parent_long',this.$t('billingPlanRenewalSuccess'))                     
                                }
                            })
                            .catch((err)=>{
                                console.log(err)
                            })                         
                        }
                    }
                )
                .catch(function (err) {
                    console.log('Error when fetching Checkout session', err);
                });
            }
        }
    },
    computed:{  
        loggedUserId(){
            return this.userInfo.addedBy
        },
        roleName(){
            return this.userInfo.roleName
        },
        getCurrency(){
            return this.$store.getters['settings/currencySymbol']
        },
        stripePostUrl(){
            return config.hostname+'/pay-for-quiz'
        },
        chkPaymentAllowed(){
            return this.isPaymentAllowed
        },    
    },
    created(){
        this.userInfo=this.$store.getters['dashboard/userInfo']     
        this.$store.dispatch('dashboard/changeVisibility')
        this.$store.dispatch('dashboard/saveQuestionSerial',0)
        this.$store.dispatch('dashboard/saveQuizFlag',false)
        this.roleActions()
        this.fetchMenus()
        if(this.userInfo.roleName=='Student'){
            this.$store.dispatch('dashboard/saveQuestionSerial',0)
            this.$store.dispatch('dashboard/saveSerialToShow',1)
            this.makePayment()
        }else if(this.userInfo.roleName=='Admin'){
            this.makeRenewal()
        }      
    }
}
</script>