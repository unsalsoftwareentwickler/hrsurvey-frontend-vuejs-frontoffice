<template>
    <v-container class="px-0" v-if="getUserRole=='SuperAdmin'">
        <Message/>
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsFaq" :columns="excelColumnsFaq" :filename="'Faq-table'" :sheetname="'FAQ'">{{$t('excel')}}</vue-excel-xlsx>
        <v-data-table
            :headers="headersFaq"
            :items="itemsFaq"
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
                        {{$t('newFaq')}}
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
                                        md="6"
                                    >                     
                                        <v-text-field
                                            v-model="editedItem.title"
                                            :label="$t('title')"
                                            :rules="[rules.required]" 
                                            clearable                      
                                        ></v-text-field>   
                                    </v-col>                                                                                                               
                                </v-row>
                                <v-row>
                                    <v-col
                                        cols="12"                                                                                              
                                    >                     
                                        <v-textarea
                                            v-model="editedItem.description"
                                            :label="$t('description')"
                                            :rules="[rules.required]"                        
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
    <v-container class="px-0" v-else>
        <v-expansion-panels focusable>
            <v-expansion-panel v-for="item in itemsFaq" :key="item.faqId">
                <v-expansion-panel-header>{{item.title}}</v-expansion-panel-header>
                <v-expansion-panel-content>{{item.description}}</v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
import Message from '../../components/common/Message'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Loading from '../../components/common/Loading.vue'

export default {
    name:'Faqs',
    components:{
    Message,
    Loading
},
    data(){
        return{
            rules:{
                required:value=>!!value||this.$t('required'),
            },
            dialog:false,
            dialogDelete:false,
            headersFaq:[
                {text:this.$t('title'),value:'title'},
                {text:this.$t('description'),value:'description'},
                {text:this.$t('actions'), value: 'actions', sortable: false }
            ],
            itemsFaq:[],
            editedIndex:-1,
            editedItem:{
                faqId:'',
                title:'',
                description:''         
            },
            defaultItem:{
                faqId:'',
                title:'',
                description:''
            },
            excelColumnsFaq : [
                {label:'Title',field:'title'},
                {label:'Description',field:'description'}           
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsFaq,
                columns: [
                    {header:'Title',dataKey:'title'},
                    {header:'Description',dataKey:'description'}
                ],
            })
            doc.save('faq-table.pdf')
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchfaqs')
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsFaq=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        editItem(item){
            //console.log(item)           
            this.editedIndex=this.itemsFaq.indexOf(item)
            this.editedItem=Object.assign({},item)
            this.dialog=true
        },
        deleteItem(item){
            this.editedItem = Object.assign({}, item)
            this.dialogDelete=true
        },
        deleteItemConfirm () {
            this.$store.dispatch('settings/deleteFaq',this.editedItem.faqId)
            .then(response=>{
            //console.log(response)
            if(response.status==200){
                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                this.$store.dispatch('settings/fetchfaqs')
                .then((response)=>{
                    this.itemsFaq=response.data                  
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
        save (){
          if(this.$refs.form.validate()){
            this.$store.dispatch('dashboard/applyLoading')
            if(this.editedIndex>-1){
              const objFaq={
                faqId:this.editedItem.faqId,           
                title:this.editedItem.title,
                description:this.editedItem.description,                           
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('settings/updateFaq',objFaq)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')              
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('settings/fetchfaqs')
                  .then((response)=>{
                    this.close()
                    this.itemsFaq=response.data
                  })
                  .catch((err)=>{
                    console.log(err)
                  })
                }else if(response.status==202){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                }
              })
              .catch(err=>{    
                this.$router.push({name:'NoInternet'})           
                console.log(err)            
              })

            }else{          
              const objFaq={
                title:this.editedItem.title,
                description:this.editedItem.description,                            
                addedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('settings/createFaq',objFaq)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('settings/fetchfaqs')
                  .then((response)=>{
                    this.close()
                    this.itemsFaq=response.data
                  })
                  .catch((err)=>{
                    console.log(err)
                  })
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
    },
    computed:{
      formTitle:function(){
        return this.editedIndex===-1?this.$t('newFaq'):this.$t('editFaq')
      },
      getUserRole:function(){
        return this.$store.getters['dashboard/userInfo'].roleName
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