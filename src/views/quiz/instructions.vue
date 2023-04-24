<template>
    <v-container>
        <Message/>
        <v-row justify="center">
            <v-col cols="12" md="4" class="font-weight-black"><h3><v-icon @click="switchToList()">arrow_back</v-icon>{{this.quizObj.quizTitle}}</h3></v-col>
        </v-row>
        <v-data-table
            :headers="headersInstruction"
            :items="itemsInstruction"
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
                        {{$t('newInstruction')}}
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
                                        >                     
                                            <v-textarea
                                                v-model="editedItem.description"
                                                :label="$t('instruction')"
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
</template>

<script>
import Message from '../../components/common/Message'
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
            headersInstruction:[
                {text:this.$t('instruction'),value:'description'},
                {text: this.$t('actions'), value: 'actions', sortable: false }
            ],
            itemsInstruction:[],
            editedIndex:-1,
            editedItem:{
                instructionId:'',               
                description:''         
            },
            defaultItem:{
                instructionId:'',
                description:''
            },
            quizObj:{}
        }
    },
    methods:{
        switchToList(){
            this.$router.push({name:'QuizTopics'})
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchInstructions',this.quizObj.quizTopicId)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsInstruction=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        editItem(item){
            //console.log(item)           
            this.editedIndex=this.itemsInstruction.indexOf(item)
            this.editedItem=Object.assign({},item)
            this.dialog=true
        },
        deleteItem(item){
            this.editedItem = Object.assign({}, item)
            this.dialogDelete=true
        },
        deleteItemConfirm(){
            this.$store.dispatch('settings/deleteInstruction',this.editedItem.instructionId)
            .then(response=>{
            //console.log(response)
            if(response.status==200){
                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                this.initialize()
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
        closeDelete(){
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
                instructionId:this.editedItem.instructionId,
                quizTopicId:this.quizObj.quizTopicId,
                description:this.editedItem.description,                           
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('settings/updateInstruction',objFaq)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')              
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))                 
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
              const objFaq={
                quizTopicId:this.quizObj.quizTopicId,
                description:this.editedItem.description,                            
                addedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('settings/createInstruction',objFaq)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))                
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
       }
    },
    computed:{
      formTitle:function(){
        return this.editedIndex===-1?this.$t('newInstruction'):this.$t('editInstruction')
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
        this.quizObj=this.$store.getters['question/quiz']
        this.initialize()
    }
}
</script>