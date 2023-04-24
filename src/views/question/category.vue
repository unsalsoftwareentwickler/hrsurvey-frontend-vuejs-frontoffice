<template>
    <v-container class="px-0">
        <Message/>
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsCategory" :columns="excelColumnsCategory" :filename="'questions-category-table'" :sheetname="'questions'">{{$t('excel')}}</vue-excel-xlsx>
        <v-btn small outlined><download-csv :data="itemsCategory" name= "questions-category-table.csv">{{$t('csv')}}</download-csv></v-btn>
        <v-data-table
        :headers="headersCategory"
        :items="itemsCategory"
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
                    {{$t('newCategory')}}
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
                                    v-model="editedItem.questionCategoryName"
                                    :label="$t('questionCategoryName')"
                                    :rules="[rules.required]" 
                                    clearable                      
                                    ></v-text-field>   

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
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Loading from '../../components/common/Loading.vue'

export default {
    name:'Category',
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
            headersCategory:[
                {text:this.$t('id'),value:'questionCategoryId'},
                {text:this.$t('questionCategoryName'),value:'questionCategoryName'},
                {text:this.$t('actions'), value: 'actions', sortable: false },
            ],
            itemsCategory:[],
            editedIndex:-1,
            editedItem:{
                questionCategoryId:'',
                questionCategoryName:'',           
            },
            defaultItem:{
                questionCategoryId:'',
                questionCategoryName:'',
            },
            excelColumnsCategory : [
                {label:'ID',field:'questionCategoryId'},
                {label:'Question Category Name',field:'questionCategoryName'}                    
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                body: this.itemsCategory,
                columns: [
                    {header:'ID',dataKey:'questionCategoryId'},
                    {header:'Question Category Name',dataKey:'questionCategoryName'}                                       
                ],
            })
            doc.save('questions-category-table.pdf')
        },
        initialize(id){
          this.$store.dispatch('dashboard/applyLoading')
          this.$store.dispatch('quiz/fetchCategories',id)
          .then((response)=>{
            this.$store.dispatch('dashboard/cancelLoading')
            this.itemsCategory=response.data
          })
          .catch((err)=>{
            this.$router.push({name:'NoInternet'})
            console.log(err)
          })
        },
        editItem(item){          
          this.editedIndex=this.itemsCategory.indexOf(item)
          this.editedItem=Object.assign({},item)
          this.dialog=true
        },
        deleteItem(item){
          this.editedItem = Object.assign({}, item)
          this.dialogDelete=true
        },
        deleteItemConfirm () {
            this.$store.dispatch('quiz/deleteCategory',this.editedItem.questionCategoryId)
            .then(response=>{
              if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('quiz/fetchCategories',this.userInfo.userId)
                  .then((response)=>{
                    this.itemsCategory=response.data                  
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
        save(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('dashboard/applyLoading')
                if(this.editedIndex>-1){
                    const objCategory={
                        questionCategoryId:this.editedItem.questionCategoryId,           
                        questionCategoryName:this.editedItem.questionCategoryName.trim(),
                        lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId'))
                    }
                    this.$store.dispatch('quiz/updateCategory',objCategory)
                    .then(response=>{     
                        this.$store.dispatch('dashboard/cancelLoading')         
                        if(response.status==200){
                            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                            this.$store.dispatch('quiz/fetchCategories',this.userInfo.userId)
                            .then((response)=>{
                                this.close()
                                this.itemsCategory=response.data
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
                }else{
                    const objCategory={          
                        questionCategoryName:this.editedItem.questionCategoryName.trim(),
                        addedBy:parseInt(localStorage.getItem('loggedUserId'))
                    }
                    this.$store.dispatch('quiz/createCategory',objCategory)
                    .then(response=>{              
                        this.$store.dispatch('dashboard/cancelLoading')
                        if(response.status==200){
                            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                            this.$store.dispatch('quiz/fetchCategories',this.userInfo.userId)
                            .then((response)=>{
                                this.close()
                                this.itemsCategory=response.data
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
                }
            }
        }
    },
    computed:{
      formTitle:function(){
        return this.editedIndex===-1?this.$t('newCategory'):this.$t('editCategory')
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
        this.userInfo=this.$store.getters['dashboard/userInfo']
        this.initialize(this.userInfo.userId)
    }
}
</script>