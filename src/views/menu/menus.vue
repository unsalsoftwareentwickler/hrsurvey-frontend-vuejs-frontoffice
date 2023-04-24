<template>
<v-container class="px-0">
    <Message/>
    <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
    <vue-excel-xlsx class="btnExcel" :data="itemsMenu" :columns="excelColumnsMenu" :filename="'menus-table'" :sheetname="'menus'">{{$t('excel')}}</vue-excel-xlsx>
    <v-btn small outlined><download-csv :data="itemsMenu" name= "menus-table.csv">{{$t('csv')}}</download-csv></v-btn>
    <v-data-table
      :headers="headersMenu"
      :items="itemsMenu"
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
                {{$t('newMenu')}}
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
                          v-model="editedItem.menuTitle"
                          :label="$t('menuTitle')"
                          :rules="[rules.required]" 
                          clearable                      
                        ></v-text-field>   

                      </v-col>                                          
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"                                                              
                      >                     
                        <v-text-field
                          v-model="editedItem.url"
                          :label="$t('url')"
                          :rules="[rules.required]"                        
                          clearable                  
                        ></v-text-field>   

                      </v-col>                                      
                    </v-row>
                    <v-row>         
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >                     
                        <v-text-field
                          v-model="editedItem.sortOrder"
                          :label="$t('orderNo')"
                          type="number"
                          :rules="[rules.required]" 
                          clearable                      
                        ></v-text-field>   

                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >                     
                        <v-text-field
                          v-model="editedItem.iconClass"
                          :label="$t('iconMaterial')" 
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
import Loading from '../../components/common/Loading'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
    name:'BrowseList',
    components:{
        Message,
        Loading
    },
    data(){
        return{
            rules:{
              required:value=>!!value||this.$t('required')
            },
            dialog:false,
            dialogDelete:false,
            headersMenu:[
                {text:this.$t('menuTitle'),value:'menuTitle'},
                {text:this.$t('url'),value:'url'},
                {text:this.$t('orderNo'),value:'sortOrder'},
                {text:this.$t('iconMaterial'),value:'iconClass'},
                {text:this.$t('actions'), value: 'actions', sortable: false },
            ],
            itemsMenu:[],
            editedIndex:-1,
            editedItem:{
                appMenuId:'',
                menuTitle:'',
                url:'',              
                sortOrder:'',
                iconClass:'',           
            },
            defaultItem:{
                appMenuId:'',
                menuTitle:'',
                url:'',
                isSubMenu:'',
                sortOrder:'',
                iconClass:'',
            },
            excelColumnsMenu : [
                {label: "Menu Title",field: "menuTitle"},
                {label: 'URL', field: 'url' },
                {label: 'Menu Order', field: 'sortOrder' },
                {label: 'Icon name(material)', field: 'iconClass' }             
            ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
              margin: { top: 10,left:2,right:1 },
              body: this.itemsMenu,
              columns: [
                  { header: 'Menu Title', dataKey: 'menuTitle' },
                  { header: 'URL', dataKey: 'url' },
                  { header: 'Menu Order', dataKey: 'sortOrder' },
                  { header: 'Icon name(material)', dataKey: 'iconClass' }
              ],
            })
            doc.save('menu-table.pdf')
        },
        initialize(){
          this.$store.dispatch('dashboard/applyLoading')
          this.$store.dispatch('menu/fetchMenu')
          .then((response)=>{
            this.$store.dispatch('dashboard/cancelLoading')
            this.itemsMenu=response.data
          })
          .catch((err)=>{
            this.$router.push({name:'NoInternet'})
            console.log(err)
          })
        },
        editItem(item){          
          this.editedIndex=this.itemsMenu.indexOf(item)
          this.editedItem=Object.assign({},item)
          this.dialog=true
        },
        deleteItem(item){
          this.editedItem = Object.assign({}, item)
          this.dialogDelete=true
        },
        deleteItemConfirm () {
            this.$store.dispatch('menu/deleteMenu',this.editedItem.appMenuId)
            .then(response=>{
              if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('menu/fetchMenu')
                  .then((response)=>{
                      this.itemsMenu=response.data                  
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
              const objMenu={
                appMenuId:this.editedItem.appMenuId,           
                menuTitle:this.editedItem.menuTitle,
                url:this.editedItem.url,             
                sortOrder:this.editedItem.sortOrder,
                iconClass:this.editedItem.iconClass,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('menu/updateMenu',objMenu)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')              
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('menu/fetchMenu')
                  .then((response)=>{
                    this.close()
                    this.itemsMenu=response.data                 
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
              const objMenu={
                menuTitle:this.editedItem.menuTitle,
                url:this.editedItem.url,             
                sortOrder:this.editedItem.sortOrder,
                iconClass:this.editedItem.iconClass,
                addedBy:parseInt(localStorage.getItem('loggedUserId'))
              }
              this.$store.dispatch('menu/createMenu',objMenu)
              .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                  this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                  this.$store.dispatch('menu/fetchMenu')
                  .then((response)=>{
                    this.close()
                    this.itemsMenu=response.data
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
        return this.editedIndex===-1?this.$t('newMenu'):this.$t('editMenu')
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