<template>
  <v-container class="px-0">
    <Message/>
    <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
    <vue-excel-xlsx class="btnExcel" :data="itemsUsers" :columns="excelColumnsUser" :filename="'user-table'" :sheetname="'users'">{{$t('excel')}}</vue-excel-xlsx>
    <v-btn small outlined><download-csv :data="itemsUsers" name= "user-table.csv">{{$t('csv')}}</download-csv></v-btn>
    <v-data-table
      :headers="roleName=='SuperAdmin'?headersSuperAdmin:headersAdmin"
      :items="itemsUsers"
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
                @click="resetNewItem"
                absolute
                right
              >
                {{$t('newUser')}}
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
                            md="4"
                          >                     
                              <v-text-field
                                  v-model="editedItem.fullName"
                                  :label="$t('name')"
                                  :rules="[rules.required]"
                                  clearable                       
                              ></v-text-field>                    
                          </v-col>                             
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            v-if="roleName=='SuperAdmin'"
                          >                     
                            <v-select
                              v-model="roleSelect"
                              :label="$t('role')"
                              :items="roleItems"
                              item-text="displayName"
                              item-value="userRoleId"
                              :rules="[rules.required]"                                                       
                              clearable
                              return-object                       
                            ></v-select>                                         
                        </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >                     
                            <v-text-field
                              v-model="editedItem.email"
                              :label="$t('email')"
                              :rules="[rules.required,rules.emailRules]"
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
                              v-model="editedItem.mobile"
                              :label="$t('mobile')"
                              clearable                       
                            ></v-text-field>                    
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-menu
                              v-model="birthMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateOfBirth"
                                  :label="$t('dateOfBirth')"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  clearable
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateOfBirth"
                                @input="birthMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >                     
                            <v-text-field
                              v-model="editedItem.password"
                              :label="$t('password')"
                              type="password"
                              :rules="[rules.required,rules.min]"                              
                              :hint="$t('passwordLengthMessage')"                             
                              clearable                       
                            ></v-text-field>                    
                          </v-col> 
                        </v-row>
                        <v-row v-if="roleName=='SuperAdmin' && showBilling==true">
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >                     
                            <v-select
                              v-model="planSelect"
                              :label="$t('billingPlan')"
                              :items="itemsPlan"
                              item-text="title"
                              item-value="billingPlanId"
                              :rules="[rules.required]"                                                       
                              clearable
                              return-object                       
                            ></v-select>                                         
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >                     
                            <v-select
                              :label="$t('paymentMode')"
                              v-model="modeSelect"
                              :items="modes"
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
                              v-model="editedItem.transactionDetail"
                              :label="$t('transactionDetail')"
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
                            <v-file-input
                              v-model="imageFile"
                              accept="image/*"
                              :label="$t('profilePicture')"
                              prepend-icon="mdi-camera"
                              @change="onFileSelected"                       
                              show-size
                            >
                            </v-file-input>                    
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-img                       
                              :src="previewImage"
                              max-height="100"
                              max-width="150"
                              contain                      
                            >
                            </v-img>
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
          <v-dialog v-model="dialogPlanRenew" max-width="800">
            <v-card>
              <v-card-title class="headline">{{$t('renewPlan')}}</v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="planRenewForm">
                    <v-row>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.fullName"
                          :label="$t('name')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.roleName"
                          :label="$t('role')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.email"
                          :label="$t('email')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.plan"
                          :label="$t('previousPlan')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.mode"
                          :label="$t('previousPaymentMode')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.transactionDetail"
                          :label="$t('previousTransactionDetail')"
                          outlined
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >                     
                        <v-select
                          v-model="planSelect"
                          :label="$t('newPlan')"
                          :items="itemsPlan"
                          item-text="title"
                          item-value="billingPlanId"
                          :rules="[rules.required]"                                                       
                          clearable
                          return-object
                          outlined                       
                        ></v-select>                                         
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >                     
                        <v-select
                          :label="$t('newMode')"
                          v-model="modeSelect"
                          :items="modes"
                          :rules="[rules.required]" 
                          clearable
                          outlined
                        >
                        </v-select>  
                      </v-col>
                      <v-col
                      cols="12"
                      md="4"
                      sm="6"
                      >
                        <v-text-field
                          v-model="newTransactionDetail"
                          :label="$t('transactionDetail')"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">{{$t('cancel')}}</v-btn>
                <v-btn color="blue darken-1" text @click="applyNewPlan">{{$t('renew')}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.dateOfBirth`]="{item}">
        <span>{{formatDateOfBirth(item)}}</span> 
      </template>
      <template v-slot:[`item.actions`]="{item}">
        <v-tooltip v-if="roleName=='SuperAdmin'" top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="mr-2"
                @click="renewPlan(item)"
                v-bind="attrs"
                v-on="on"
              >
                autorenew
              </v-icon> 
            </template>                   
            <span>{{$t('renewPlan')}}</span>
        </v-tooltip>
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
                    @click="deleteItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                    mdi-delete
                </v-icon>
            </template>                   
            <span>{{$t('delete')}}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Message from '../../components/common/Message'
import config from '../../../public/config'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Loading from '../../components/common/Loading.vue'

export default {
    name:'userList',
    components:{
      Message,
      Loading
    },
    data(){
        return{
          show: false,
          imageFile:null,
          previewImage:null,
          selectedFile:null,
          birthMenu: false,
          roleSelect: null,
          roleItems:[],
          planSelect: null,
          itemsPlan:[],
          modes:['Offline','N/A'],
          modeSelect:'',
          billingSection:true,
          rules:{
            required:value=>!!value||this.$t('required'),
            min: v => v.length >= 8 || this.$t('min8Character'),
            emailRules:v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('emailInvalid')
          },
          dialog:false,
          dialogDelete:false,
          dialogPlanRenew:false,
          newTransactionDetail:'',
          defaultLogoUrl:window.location.origin+'/upload/logo-quick-test-black.png',
          headersAdmin:[
            {text:this.$t('name'),value:'fullName'},
            {text:this.$t('displayName'),value:'displayName'},
            {text:this.$t('email'),value:'email'},           
            {text:this.$t('mobile'),value:'mobile'},
            {text:this.$t('dateOfBirth'),value:'dateOfBirth'},
            {text:this.$t('actions'), value:'actions', sortable: false },
          ],
          headersSuperAdmin:[
            {text:this.$t('name'),value:'fullName'},
            {text:this.$t('role'),value:'displayName'},
            {text:this.$t('email'),value:'email'}, 
            {text:this.$t('plan'),value:'title'}, 
            {text:this.$t('interval'),value:'interval'},     
            {text:this.$t('paymentMode'),value:'paymentMode'}, 
            {text:this.$t('expireyDate'),value:'expireyDate'}, 
            {text:this.$t('transactionDetail'),value:'transactionDetail'},   
            {text:this.$t('actions'), value:'actions', sortable: false },
          ],
          itemsUsers:[],
          editedIndex:-1,
          editedItem:{
            userId:'',
            userRoleId:'',
            roleName:'',
            plan:'',
            mode:'',
            fullName:'',
            mobile:'',
            email:'',
            imagePath:'',
            dateOfBirth:null,
            address:'',
            transactionDetail:'',
            password:'',
          },
          defaultItem:{
            userId:'',
            userRoleId:'',
            roleName:'',
            plan:'',
            mode:'',
            fullName:'',
            mobile:'',
            email:'',
            imagePath:'',
            dateOfBirth:null,
            address:'',
            transactionDetail:'',
            password:'',
          },
          excelColumnsUser : [
            {label: "Name",field: "fullName"},
            {label: "Role",field: "displayName"},
            {label: "Mobile",field: "mobile"},
            {label: "Email",field: "email"},
            {label: "Date of Birth",field: "dateOfBirth"},
            {label: "Address",field: "address"},           
          ],
        }
    },
    methods:{
      generatePdf(){
        const doc = new jsPDF()
        doc.autoTable({
          margin: { top: 10,left:2,right:1 },
          body: this.itemsUsers,
          columns: [
            { header: 'Name', dataKey: 'fullName' },
            { header: 'Role', dataKey: 'displayName' },
            { header: 'Mobile', dataKey: 'mobile' },
            { header: 'Email', dataKey: 'email' },
            { header: 'Date of Birth', dataKey: 'dateOfBirth' },
            { header: 'Address', dataKey: 'address' },
          ],
        })
        doc.save('user-table.pdf')
      },
      initialize(id){
        this.$store.dispatch('dashboard/applyLoading')
        this.$store.dispatch('user/fetchUsers',id)
        .then((response)=>{
          this.$store.dispatch('dashboard/cancelLoading')
          this.itemsUsers=response.data
        })
        .catch((err)=>{
          this.$router.push({name:'NoInternet'})
          console.log(err)
        })
      },
      getUserRoles(){
        this.$store.dispatch('user/fetchUserRoles')
        .then((response)=>{
          this.roleItems=response.data.filter(function(item){
            return item.userRoleId!=2 && item.userRoleId!=3
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      getPlans(){
        this.$store.dispatch('settings/fetchBillingPlans')
        .then((response)=>{
          this.itemsPlan=response.data
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      onFileSelected(e){           
        if(e!=null){
          this.selectedFile=e
          const reader=new FileReader()
          reader.readAsDataURL(this.selectedFile)
          reader.onload=e=>{
            this.previewImage=e.target.result
          }
        }else{               
          this.selectedFile=null
          this.previewImage=null
          this.editedItem.imagePath=''
        }                      
      },
      resetNewItem(){
        this.billingSection=true
        this.getUserRoles()
      },
      formatDateOfBirth(item){
        return item.dateOfBirth==null?null:item.dateOfBirth.substr(0,10)
      },
      editItem(item){
        //console.log(item)
        item.dateOfBirth=item.dateOfBirth==null?null:item.dateOfBirth.substr(0,10)
        this.previewImage=item.imagePath!=null?config.hostname+item.imagePath:''
        this.roleSelect= {roleName: item.roleName, userRoleId: item.userRoleId}
        this.planSelect= {billingPlanId: item.billingPlanId}
        this.modeSelect=item.paymentMode
        this.editedIndex=this.itemsUsers.indexOf(item)
        this.editedItem=Object.assign({},item)
        this.billingSection=false
        this.dialog=true
      },
      renewPlan(item){
        //console.log(item)
        this.editedItem=Object.assign({},item)
        this.editedItem.fullName=item.fullName
        this.editedItem.roleName=item.roleName
        this.editedItem.email=item.email
        this.editedItem.plan=item.title
        this.editedItem.transactionDetail=item.transactionDetail
        this.editedItem.mode=item.paymentMode      
        this.dialogPlanRenew=true
      },
      applyNewPlan(){
        if(this.$refs.planRenewForm.validate()){
          const objNewPlan={
            addedBy:this.editedItem.userId,
            transactionEmail:this.editedItem.email,
            billingPlanId:this.planSelect.billingPlanId,
            paymentMode:this.modeSelect,   
            transactionDetail:this.newTransactionDetail  
          }
          //console.log(objNewPlan)
          this.$store.dispatch('user/updateBillingPlan',objNewPlan)
          .then((response)=>{
            if(response.status==200){
              this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
              this.close()
              this.initialize(this.userInfo.userId)
            }
          })
          .catch((err)=>{
            this.$router.push({name:'NoInternet'})
            console.log(err)
          })

        }
      },
      deleteItem(item){
        this.editedItem = Object.assign({}, item)
        this.dialogDelete=true
      },
      deleteItemConfirm () {
        this.$store.dispatch('user/deleteUser',this.editedItem.userId)
        .then(response=>{
          //console.log(response)
          if(response.status==200){
            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
            this.$store.dispatch('user/fetchUsers',this.userInfo.userId)
            .then((response)=>{
              this.itemsUsers=response.data                  
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
        this.dialogPlanRenew=false
        this.$nextTick(()=>{
          this.roleSelect=null
          this.planSelect=null
          this.modeSelect=''
          this.selectedFile=null
          this.imageFile=null
          this.previewImage=null
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
          if(this.selectedFile!=null){
            let fd=new FormData()
            fd.append('image',this.selectedFile)
            this.$store.dispatch('user/uploadImage',fd)
            .then(response=>{
              //console.log(response)
              if(response.status==200){
                this.editedItem.imagePath='/'+response.data.dbPath                           
                this.insertOrUpdateUser()
              }
            })
            .catch(err=>{
              console.log(err)
            })
          }else{
            this.insertOrUpdateUser()
          }
        }
      },
      sentWelcomeEmail(obj){
        if(this.$store.getters['settings/allSettings'].allowWelcomeEmail==true){
          const objEmail={
            toEmail:obj.email,
            name:obj.fullName,
            logoPath:config.hostname+(this.$store.getters['settings/logoPath']==''?this.defaultLogoUrl:this.$store.getters['settings/logoPath'].replace(/\\/g, '/')),
            siteUrl:window.location.origin,
            siteTitle:this.$store.getters['settings/allSettings'].siteTitle,
            password:obj.password,
            //body:'We are happy to have you with us. As a registed member of <b>'+this.$store.getters['settings/allSettings'].siteTitle+'</b> from now you can access to <b>'+this.$store.getters['settings/allSettings'].siteTitle+'</b> through this Email: <b>'+obj.email+'</b> and Password: <b>'+obj.password+'</b>'
          }
          this.$store.dispatch('settings/welcomeEmailSent',objEmail)
        }
      },
      insertOrUpdateUser(){  
        this.$store.dispatch('dashboard/applyLoading')  
        this.editedItem.dateOfBirth=this.editedItem.dateOfBirth==null?null:this.editedItem.dateOfBirth.substr(0,10)                
        this.previewImage=this.editedItem.imagePath!=null?this.editedItem.imagePath:''
        this.imagePath=this.editedItem.imagePath!=null?this.editedItem.imagePath:''
        if (this.editedIndex > -1){
          const objUser={
            userId:this.editedItem.userId,
            fullName:this.editedItem.fullName,
            mobile:this.editedItem.mobile,
            email:this.editedItem.email,
            imagePath:this.editedItem.imagePath,
            dateOfBirth:this.editedItem.dateOfBirth,
            address:this.editedItem.address,
            password:this.editedItem.password,
            billingPlanId:this.planSelect.billingPlanId,
            lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
          }
          if(this.userInfo.roleName=='SuperAdmin'){
            objUser.userRoleId=this.roleSelect.userRoleId     
          }else{
            objUser.userRoleId=2
          }
          this.$store.dispatch('user/updateUser',objUser)
          .then(response=>{
          this.$store.dispatch('dashboard/cancelLoading')
          if(response.status==200){
            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
            this.$store.dispatch('user/fetchUsers',this.userInfo.userId)
            .then((response)=>{
              this.close()
              this.itemsUsers=response.data
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
          if(this.modeSelect=='Online'){
            this.$store.dispatch('dashboard/cancelLoading')
            this.$root.$emit('message_from_parent_long',this.$t('onlinePaymentnotallowed'))
          }else{
            const objUser={
              fullName:this.editedItem.fullName,
              mobile:this.editedItem.mobile,
              email:this.editedItem.email,
              imagePath:this.editedItem.imagePath,
              dateOfBirth:this.editedItem.dateOfBirth,
              address:this.editedItem.address,
              password:this.editedItem.password,
              addedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            if(this.userInfo.roleName=='SuperAdmin'){
              objUser.userRoleId=this.roleSelect.userRoleId    
              objUser.billingPlanId=this.planSelect.billingPlanId
              objUser.paymentMode=this.modeSelect   
              objUser.transactionDetail=this.editedItem.transactionDetail        
            }else{
              objUser.userRoleId=2
            }
            //console.log(objUser)         
            this.$store.dispatch('user/createUser',objUser)
            .then(response=>{
            this.$store.dispatch('dashboard/cancelLoading')
            if(response.status==200){
              this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
              this.sentWelcomeEmail(objUser)
              this.$store.dispatch('user/fetchUsers',this.userInfo.userId)
              .then((response)=>{
                this.close()
                this.itemsUsers=response.data
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
        return this.editedIndex===-1?this.$t('newUser'):this.$t('editUser')
      },
      roleName(){
        return this.userInfo.roleName
      },
      showBilling(){
        return this.billingSection
      }
    },
    watch:{
      dialog (val) {
        val || this.close()
      },
      dialogPlanRenew (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created(){
      this.userInfo=this.$store.getters['dashboard/userInfo']
      this.initialize(this.userInfo.userId)
      this.getUserRoles()
      this.getPlans()
    }
}
</script>