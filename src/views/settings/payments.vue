<template>
    <v-container class="px-0" v-if="roleName=='SuperAdmin'">
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsPayment" :columns="excelColumnsPayment" :filename="'payment-table'" :sheetname="'payments'">{{$t('excel')}}</vue-excel-xlsx>
        <v-data-table
            :headers="headersPayment"
            :items="itemsPayment"
            class="elevation-1"
        >
        </v-data-table>
    </v-container>
    <v-container class="px-0" v-else-if="roleName=='Admin'">
    <Message/>
        <v-data-table
            :headers="headersQuizPayment"
            :items="itemsQuizPayment"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >
                    <v-dialog
                    v-model="dialog"
                    max-width="700"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"               
                                class="text-capitalize mb-2"
                                absolute
                                right
                                @click="loadStripe"
                            >
                                {{$t('paymentSettings')}}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title><v-row justify="center">{{$t('stripe')}}</v-row></v-card-title>
                            <v-card-text>
                                <v-form ref="form">                       
                                    <v-row>
                                        <v-col
                                            cols="12"
                                        >                     
                                            <v-text-field
                                                v-model="stripeSessionId"                                       
                                                :label="$t('stripeSecretkey')"                                     
                                                :rules="[rules.required]"
                                                clearable                       
                                            ></v-text-field>                                    
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    dark
                                    @click="updateStripe"
                                    class="mr-2 mb-10 text-capitalize" 
                                    absolute
                                    right                     
                                >
                                {{$t('submit')}}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Message from '../../components/common/Message'

export default {
    name:'Payments',
    components:{
        Message
    },
    data(){
        return{
            dialog:false,
            stripeSessionId:'',
            userInfo:null,
            rules:{
                required:value=>!!value||this.$t('required'),
            },
            headersQuizPayment:[
                {text:this.$t('title'),value:'quizTitle'},
                {text:this.$t('priceUsd'),value:'quizPrice'},
                {text:this.$t('amountPaidUSD'),value:'amount'},
                {text:this.$t('stripeSessionId'),value:'sessionId'},
                {text:this.$t('email'),value:'email'},
                {text:this.$t('name'),value:'fullName'}, 
                {text:this.$t('dateTime'),value:'dateAdded'},             
            ],
            itemsQuizPayment:[],
            headersPayment:[
                {text:this.$t('title'),value:'title'},
                {text:this.$t('priceUsd'),value:'price'},
                {text:this.$t('paymentMode'),value:'paymentMode'},
                {text:this.$t('interval'),value:'interval'},
                {text:this.$t('assessment'),value:'assessmentCount'},
                {text:this.$t('questionPerAssessmentCount'),value:'questionPerAssessmentCount'},
                {text:this.$t('responsePerAssessmentCount'),value:'responsePerAssessmentCount'},
                {text:this.$t('startDate'),value:'startDate'},
                {text:this.$t('endDate'),value:'endDate'},
                {text:this.$t('userEmail'),value:'userEmail'},
                {text:this.$t('transactionEmail'),value:'transactionEmail'},
                {text:this.$t('transactionDetail'),value:'transactionDetail'},
                {text:this.$t('stripeSessionId'),value:'stripeSessionId'},  
                {text:this.$t('dateTime'),value:'dateAdded'},             
            ],
            itemsPayment:[],
            excelColumnsPayment : [
                {label:'Title',field:'title'},
                {label:'Price',field:'price'},
                {label:'Mode',field:'paymentMode'},
                {label:'Interval',field:'interval'},
                {label:'Assessment',field:'assessmentCount'},
                {label:'Date Start',field:'startDate'},
                {label:'Date End',field:'endDate'},
                {label:'Questions(Per Assessment)',field:'questionPerAssessmentCount'},
                {label:'Response(Per Assessment)',field:'responsePerAssessmentCount'},
                {label:'User Email',field:'userEmail'},
                {label:'Transaction Email',field:'transactionEmail'},
                {label:'Stripe Session Id',field:'stripeSessionId'},  
                {label:'Date-Time',field:'dateAdded'},             
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF({orientation:'l'})
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsPayment,
                columns: [
                    {header:'Title',dataKey:'title'},
                    {header:'Price',dataKey:'price'},
                    {header:'Mode',dataKey:'paymentMode'},
                    {header:'Interval',dataKey:'interval'},
                    {header:'Assessment',dataKey:'assessmentCount'},
                    {header:'Date Start',dataKey:'startDate'},
                    {header:'Date End',dataKey:'endDate'},
                    {header:'Questions',dataKey:'questionPerAssessmentCount'},
                    {header:'Response',dataKey:'responsePerAssessmentCount'},
                    {header:'User Email',dataKey:'userEmail'},
                    {header:'Transaction Email',dataKey:'transactionEmail'},
                    {header:'Stripe Session Id',dataKey:'stripeSessionId'},  
                    {header:'Date-Time',dataKey:'dateAdded'}, 
                ],
            })
            doc.save('Payments-table.pdf')
        },
        initializeSuperAdmin(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchPayment')
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsPayment=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        initializeAdmin(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchQuizPayment',parseInt(localStorage.getItem('loggedUserId')))
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                //console.log(response.data)
                this.itemsQuizPayment=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateStripe(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                stripeSecretKey:this.stripeSessionId,
                clientUrl:window.location.origin,
                addedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateStripeSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                    this.dialog=false
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        loadStripe(){
            this.$store.dispatch('dashboard/applyLoading') 
            this.$store.dispatch('settings/fetchSingleSettings',parseInt(localStorage.getItem('loggedUserId')))
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.stripeSessionId=response.data.stripeSecretKey
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        }
    },
    computed:{   
        roleName(){
            return this.userInfo.roleName
        }    
    },
    created(){
        this.userInfo=this.$store.getters['dashboard/userInfo']
        if(this.userInfo.roleName=='SuperAdmin'){
            this.initializeSuperAdmin()
        }else if(this.userInfo.roleName=='Admin'){
            this.initializeAdmin()
        }
    }
}
</script>