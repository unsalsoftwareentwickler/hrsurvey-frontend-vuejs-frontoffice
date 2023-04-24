<template>
  <v-container class="px-0">
    <Message/>
    <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
    <vue-excel-xlsx class="btnExcel" :data="itemsUserRole" :columns="excelColumnsRole" :filename="'role-table'" :sheetname="'roles'">{{$t('excel')}}</vue-excel-xlsx>
    <v-btn small outlined><download-csv :data="itemsUserRole" name= "role-table.csv">{{$t('csv')}}</download-csv></v-btn>
    <v-data-table
      :headers="headersUserRole"
      :items="itemsUserRole"
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
                                md="4"
                            >                     
                                <v-text-field
                                    v-model="editedItem.roleName"
                                    :label="$t('name')"
                                    :rules="[rules.required]"
                                    readonly                       
                                ></v-text-field>                    
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="4"
                            >                     
                                <v-text-field
                                    v-model="editedItem.displayName"
                                    :label="$t('displayName')"
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
                                    v-model="editedItem.roleDesc"
                                    :label="$t('description')"
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
          <v-dialog v-model="dialogMenu" max-width="600">
            <v-card>
              <v-list>
                <v-list-item v-for="item in menus" :key="item.appMenuId">                 
                  <v-list-item-icon><v-icon>{{item.iconClass}}</v-icon></v-list-item-icon>
                  <!-- <v-list-item-content v-text="item.menuTitle"></v-list-item-content> -->
                  <v-list-item-content>{{ $t(item.menuTitle) }}</v-list-item-content>
                  <v-list-item-action><v-checkbox v-model="item.isSelected" @click="assignToRole(item)"></v-checkbox></v-list-item-action>             
                </v-list-item>
              </v-list>
            </v-card>          
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{item}">
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                    mdi-pencil
                </v-icon>
            </template>                   
            <span>{{$t('edit')}}</span>
        </v-tooltip>
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-icon
                    small
                    @click="getMenus(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                    menu
                </v-icon>
            </template>                   
            <span>{{$t('assignedMenus')}}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Message from '../../components/common/Message'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Loading from '../../components/common/Loading'

export default {
    name:'userRoleList',
    components:{
      Message,
      Loading
    },
    data(){
      return{
        menus:null,
        rules:{
          required:value=>!!value||this.$t('required')
        },
        selectedRole:null,
        dialog:false,
        dialogDelete:false,
        dialogMenu:false,
        headersUserRole:[
          {text:this.$t('name'),value:'roleName'},
          {text:this.$t('displayName'),value:'displayName'},
          {text:this.$t('description'),value:'roleDesc'},
          {text:this.$t('actions'), value: 'actions', sortable: false},
        ],
        itemsUserRole:[],
        editedIndex:-1,
        editedItem:{
          userRoleId:'',
          roleName:'',
          displayName:'',
          roleDesc:''
        },
        defaultItem:{
          userRoleId:'',
          roleName:'',
          displayName:'',
          roleDesc:''
        },
        excelColumnsRole : [
          {label: "Role",field: "roleName"},
          {label: "Display",field: "displayName"},
          {label: 'Description', field: 'roleDesc' }         
        ]
      }
    },
    methods:{
      generatePdf(){
        const doc = new jsPDF()
        doc.autoTable({
          margin: { top: 10,left:2,right:1 },
          body: this.itemsUserRole,
          columns: [
            { header: 'Role', dataKey: 'roleName' },
            { header: 'Display', dataKey: 'displayName' },
            { header: 'Description', dataKey: 'roleDesc' }
          ],
        })
        doc.save('role-table.pdf')
      },
      assignToRole(item){
        const objMenuOperation={
          menuId:item.appMenuId,
          userRoleId:this.selectedRole,
          addedBy:parseInt(localStorage.getItem('loggedUserId')),
        }
        this.$store.dispatch('menu/assignNewMenu',objMenuOperation)
        .then(response=>{
          if(response.status==202){
            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
          }
        })
        .catch(err=>{
          console.log(err)
        })
      },
      getMenus(item){
        this.selectedRole=item.userRoleId
        this.getAppMenu(this.selectedRole)
        this.dialogMenu=true
      },
      getAppMenu(roleId){         
          this.$store.dispatch('menu/fetchAllMenu',roleId)
          .then((response)=>{
              if(response.status==200){
                this.menus=response.data            
              }
          })
          .catch((err)=>console.log(err))
      },
      initialize(){
        this.$store.dispatch('dashboard/applyLoading')
        this.$store.dispatch('user/fetchUserRoles')
        .then((response)=>{
          this.$store.dispatch('dashboard/cancelLoading')
          this.itemsUserRole=response.data
        })
        .catch((err)=>{
          this.$router.push({name:'NoInternet'})
          console.log(err)
        })
      },
      editItem(item){
        this.editedIndex=this.itemsUserRole.indexOf(item)
        this.editedItem=Object.assign({},item)
        this.dialog=true
      },
      deleteItem(item){
        this.editedItem = Object.assign({}, item)
        this.dialogDelete=true
      },
      deleteItemConfirm () {
        this.$store.dispatch('user/deleteUserRole',this.editedItem.userRoleId)
        .then(response=>{
          if(response.status==200){
            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
            this.$store.dispatch('user/fetchUserRoles')
            .then((response)=>{
              this.itemsUserRole=response.data                  
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
      save () {
        if(this.$refs.form.validate()){
          this.$store.dispatch('dashboard/applyLoading')
          if (this.editedIndex > -1) {
            //edit
            const objUserRole={
              userRoleId:this.editedItem.userRoleId,
              roleName:this.editedItem.roleName,
              displayName:this.editedItem.displayName,
              roleDesc:this.editedItem.roleDesc,
              lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('user/updateUserRole',objUserRole)
            .then(response=>{
              //console.log(response)
              this.$store.dispatch('dashboard/cancelLoading')
              if(response.status==200){
              this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
              this.$store.dispatch('user/fetchUserRoles')
              .then((response)=>{
                  this.close()
                  this.itemsUserRole=response.data
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
            } else {
            //insert
            const objUserRole={
              roleName:this.editedItem.roleName,
              displayName:this.editedItem.displayName,
              roleDesc:this.editedItem.roleDesc,
              addedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('user/createUserRole',objUserRole)
            .then(response=>{
              //console.log(response)
              this.$store.dispatch('dashboard/cancelLoading')
              if(response.status==200){
                this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                this.$store.dispatch('user/fetchUserRoles')
                .then((response)=>{
                  this.close()
                  this.itemsUserRole=response.data
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
            
        },
      },
    computed:{
      formTitle(){
        return this.editedIndex===-1?this.$t('newRole'):this.$t('editRole')
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