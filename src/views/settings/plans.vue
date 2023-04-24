<template>
    <v-container class="px-0">
        <Message/>
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsPlan" :columns="excelColumnsPlan" :filename="'billing-table'" :sheetname="'billing'">{{$t('excel')}}</vue-excel-xlsx>
        <v-data-table
            :headers="headersPlan"
            :items="itemsPlan"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >        
                    <v-dialog
                        v-model="dialog"
                        max-width="800"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="primary"
                        dark
                        class="text-capitalize mb-2"
                        v-bind="attrs"
                        v-on="on"               
                        absolute
                        right
                        >
                        {{$t('newPlan')}}
                        </v-btn>
                    </template>
                    <v-card>
                        <Loading/>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-form ref="form">
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="8"
                                        >                     
                                            <v-text-field
                                                v-model="editedItem.title"
                                                :label="$t('title')"
                                                :rules="[rules.required]" 
                                                clearable                      
                                            ></v-text-field>   
                                        </v-col>  
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >                     
                                            <v-text-field
                                                v-model="editedItem.price"
                                                :label="$t('priceUsd')"
                                                type="number"
                                                clearable                      
                                            ></v-text-field>   
                                        </v-col>                                                                                                             
                                    </v-row>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >                     
                                            <v-select
                                                :label="$t('interval')"
                                                v-model="intervalSelect"
                                                :items="intervals"
                                                :rules="[rules.required]" 
                                                clearable
                                            >
                                            </v-select>  
                                        </v-col> 
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >                     
                                            <v-text-field
                                                v-model="editedItem.assessmentCount"
                                                :label="$t('assessment')"
                                                type="number" 
                                                :rules="[rules.required,rules.minimumVal]"
                                                clearable                      
                                            ></v-text-field>  
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >                     
                                            <v-text-field
                                                v-model="editedItem.questionPerAssessmentCount"
                                                :label="$t('questionPerAssessmentCount')"
                                                type="number"
                                                :rules="[rules.required,rules.minimumVal]"
                                                clearable                      
                                            ></v-text-field>  
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >                     
                                            <v-text-field
                                                v-model="editedItem.responsePerAssessmentCount"
                                                :label="$t('responsePerAssessmentCount')" 
                                                type="number"
                                                :rules="[rules.required,rules.minimumVal]"
                                                clearable                      
                                            ></v-text-field>  
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="8"
                                        >                     
                                            <v-textarea
                                                v-model="editedItem.additionalText"
                                                :label="$t('additionalText')"
                                                :rules="[rules.required]"
                                                rows="1"
                                                clearable                       
                                            ></v-textarea>  
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                        >
                        {{$t('cancel')}}
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="save"
                        >
                        {{$t('save')}}
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="headline">{{$t('deleteConfirmMessage')}}</v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">{{$t('cancel')}}</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{$t('ok')}}</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{item}">
                <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                >
                mdi-pencil
                </v-icon>
                <v-icon
                small
                @click="deleteItem(item)"
                >
                mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Message from '../../components/common/Message'
import Loading from '../../components/common/Loading.vue'

export default {
    name:'BillingPlan',
    components:{
      Message,
      Loading
    },
    data(){
        return{
            rules:{
                required:value=>!!value||this.$t('required'),
                minimumVal:value=>value>0
            },
            //intervals:[this.$t('monthly'),this.$t('yearly')],
            intervals:['Monthly','Yearly'],
            intervalSelect:'',
            dialog:false,
            dialogDelete:false,
            headersPlan:[
                {text:this.$t('title'),value:'title'},
                {text:this.$t('priceUsd'),value:'price'},
                {text:this.$t('interval'),value:'interval'},
                {text:this.$t('assessment'),value:'assessmentCount'},
                {text:this.$t('questionPerAssessmentCount'),value:'questionPerAssessmentCount'},
                {text:this.$t('responsePerAssessmentCount'),value:'responsePerAssessmentCount'},
                {text:this.$t('actions'),value:'actions', sortable: false }
            ],
            itemsPlan:[],
            editedIndex:-1,
            editedItem:{
                title:'',
                price:0,
                interval:'',
                assessmentCount:0,
                questionPerAssessmentCount:0,   
                responsePerAssessmentCount:0,
                additionalText:''       
            },
            defaultItem:{
                title:'',
                price:0,
                interval:'',
                assessmentCount:0,
                questionPerAssessmentCount:0,   
                responsePerAssessmentCount:0,
                additionalText:''
            },
            excelColumnsPlan : [
                {label:'Title',field:'title'},
                {label:'Price',field:'price'},
                {label:'Interval',field:'interval'},
                {label:'Assessment',field:'assessmentCount'},
                {label:'Questions(Per Assessment)',field:'questionPerAssessmentCount'},
                {label:'Response(Per Assessment)',field:'responsePerAssessmentCount'}           
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsPlan,
                columns: [
                    {header:'Title',dataKey:'title'},
                    {header:'Price',dataKey:'price'},
                    {header:'Interval',dataKey:'interval'},
                    {header:'Assessment',dataKey:'assessmentCount'},
                    {header:'Questions(Per Assessment)',dataKey:'questionPerAssessmentCount'},
                    {header:'Response(Per Assessment)',dataKey:'responsePerAssessmentCount'}
                ],
            })
            doc.save('billing-plan.pdf')
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchBillingPlans')
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsPlan=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        editItem(item){
            //console.log(item)
            this.intervalSelect= item.interval
            this.editedIndex=this.itemsPlan.indexOf(item)
            this.editedItem=Object.assign({},item)
            this.dialog=true
        },
        deleteItem(item){
            this.editedItem = Object.assign({}, item)
            this.dialogDelete=true
        },
        deleteItemConfirm () {
            this.$store.dispatch('settings/deleteBillingPlans',this.editedItem.billingPlanId)
            .then(response=>{
            //console.log(response)
            if(response.status==200){
                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                this.$store.dispatch('settings/fetchBillingPlans')
                .then((response)=>{
                    this.itemsPlan=response.data                  
                })
                .catch((err)=>{
                    console.log(err)
                })
            }else if(response.status==202){
                this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
            }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
            this.closeDelete()
        },
        close(){
            this.dialog=false
            this.$nextTick(()=>{
                this.intervalSelect=''
                this.editedItem=Object.assign({},this.defaultItem)
                this.editedIndex=-1
            })
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('dashboard/applyLoading')
                const objPlan={
                    title:this.editedItem.title.trim(),
                    price:this.editedItem.price==null?0:this.editedItem.price,
                    interval:this.intervalSelect,
                    assessmentCount:this.editedItem.assessmentCount,
                    questionPerAssessmentCount:this.editedItem.questionPerAssessmentCount,
                    responsePerAssessmentCount:this.editedItem.responsePerAssessmentCount,
                    additionalText:this.editedItem.additionalText,
                    addedBy:parseInt(localStorage.getItem('loggedUserId')),
                }
                //console.log(objPlan)
                if (this.editedIndex > -1){   
                    objPlan.billingPlanId=this.editedItem.billingPlanId
                    objPlan.lastUpdatedBy=parseInt(localStorage.getItem('loggedUserId'))

                    this.$store.dispatch('settings/updateBillingPlans',objPlan)
                    .then(response=>{
                        this.$store.dispatch('dashboard/cancelLoading')
                        if(response.status==200){
                            this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                            this.close()
                            this.initialize()
                        }else if(response.status==202){
                                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                            }
                        })
                        .catch(err=>{
                            this.$router.push({name:'NoInternet'})
                            console.log(err)
                        })
                }else{ 
                    this.$store.dispatch('settings/createBillingPlans',objPlan)
                    .then(response=>{
                        this.$store.dispatch('dashboard/cancelLoading')
                        if(response.status==200){
                            this.$root.$emit('message_from_parent',this.$t('successfullySaved'))
                            this.close()
                            this.initialize()
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
        },
        
    },
    computed:{
      formTitle:function(){
        return this.editedIndex===-1?this.$t('newPlan'):this.$t('editPlan')
      }
    },
    watch:{
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created(){
        this.initialize()
    }
}
</script>