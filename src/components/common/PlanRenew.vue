<template>
    <div>
        <v-dialog v-model="dialogPlan" max-width="1200">
            <v-card>
                <Loading/>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4" v-for="item in itemsPlan" :key="item.billingPlanId">
                                <v-card hover shaped outlined class="cardBorder">
                                    <v-card-title class="pt-12"><v-row justify="center">{{item.title}}</v-row></v-card-title>
                                    <v-card-subtitle class="text-center">{{$t(item.interval)}}</v-card-subtitle>
                                    <v-card-subtitle class="text-center"><v-avatar color="grey darken-1" size="70"><span class="lime--text text-h5">${{item.price}}</span></v-avatar></v-card-subtitle>
                                    <v-card-text class="py-8">
                                        <v-row justify="center" class="black--text">{{item.assessmentCount}} {{$t('assessments')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.questionPerAssessmentCount}} {{$t('questionsOnEachAssessment')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.responsePerAssessmentCount}} {{$t('responsesForEachAssessment')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.additionalText}}</v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-row justify="center" v-if="item.price>0">
                                            <form v-bind:action="stripePostUrl" method="POST">
                                                <input type="hidden" name="billingId" v-bind:value="item.billingPlanId">
                                                <v-btn type="submit" @click="saveBillingPlan(item)" class="text-capitalize" outlined>{{$t('renew')}}</v-btn>
                                            </form>
                                        </v-row>   
                                        <v-row justify="center" v-else><v-btn @click="saveBillingPlan(item)" class="text-capitalize" outlined>{{$t('renew')}}</v-btn></v-row>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="timeout" left vertical>
            {{msg}}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text class="text-capitalize" v-bind="attrs" @click="snackbar=false">{{$t('close')}}</v-btn>
                <v-btn color="white" text class="text-capitalize" v-bind="attrs" @click="showPlan()">{{$t('renew')}}</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<script>
import config from '../../../public/config'
import Loading from '../../components/common/Loading'
export default {
    name:'PlanRenew',
    components:{
      Loading
    },  
    data(){
        return{
            snackbar: false,
            msg: this.$t('planExpiredMsg'),
            timeout: -1,
            userInfo:{},
            dialogPlan:false,
            itemsPlan:[],
        }
    },
    methods:{
        showPlan(){      
            this.snackbar=false
            this.dialogPlan=true
            this.initializePlan()
        },
        chkPlanRenew(){
            if(this.userInfo.isPlanExpired=='true'){
                this.snackbar=true
            }
        },
        initializePlan(){
            this.$store.dispatch('settings/fetchBillingPlans')
            .then((response)=>{
                this.itemsPlan=response.data
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        saveBillingPlan(item){
            if(item.price==0){
                this.$store.dispatch('dashboard/applyLoading')
                const objNewPlan={
                    addedBy:this.userInfo.userId,
                    transactionEmail:this.userInfo.email,
                    billingPlanId:item.billingPlanId,
                    paymentMode:'N/A',   
                    transactionDetail:this.$t('billingPlanRenewed')  
                }
                this.$store.dispatch('user/updateBillingPlan',objNewPlan)
                .then((response)=>{
                    this.$store.dispatch('dashboard/cancelLoading')
                    if(response.status==200){
                        this.$router.push({name:'Landing'})
                        this.$root.$emit('message_from_parent_long',this.$t('planRenewalSuccess'))                     
                    }
                })
                .catch((err)=>{
                    console.log(err)
                }) 
            }else{
                localStorage.setItem('billingPlanId', item.billingPlanId)
            }
        },
    },
    computed:{
        stripePostUrl(){
            return config.hostname+'/create-checkout-renew-plan'
        }   
    },
    mounted(){
        this.$root.$on('message_for_renew_plan',(msg)=>{
            this.snackbar=true
            this.msg=msg
        })
    },
    created(){
        this.userInfo=this.$store.getters['dashboard/userInfo']
        this.chkPlanRenew()
    }
}
</script>
<style scoped>
    .cardBorder{
        border-color: black;
        border-radius: 1px;
    }
</style>