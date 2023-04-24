<template>
    <v-container class="px-0">
        <Message/>
        <v-data-table
            :headers="headersTemplate"
            :items="itemsTemplate"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >         
                    <v-dialog
                        v-model="dialog"
                        max-width="900"
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
                                {{$t('newTemplate')}}
                            </v-btn>
                        </template>
                        <v-card>
                            <Loading/>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span><span v-show="false">{{colorBackground}}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-row align="center" justify="center">
                                    <v-chip-group multiple>
                                        <v-chip id="[fullName]" @dragstart="drag($event)" draggable>Student Name</v-chip>
                                        <v-chip id="[email]" @dragstart="drag($event)" draggable>Email</v-chip>
                                        <v-chip id="[mobile]" @dragstart="drag($event)" draggable>Mobile</v-chip>
                                        <v-chip id="[address]" @dragstart="drag($event)" draggable>Address</v-chip>
                                        <v-chip id="[dateOfBirth]" @dragstart="drag($event)" draggable>Date of Birth</v-chip>
                                        <v-chip id="[quizTitle]" @dragstart="drag($event)" draggable>Title</v-chip>
                                        <v-chip id="[quizTime]" @dragstart="drag($event)" draggable>Time</v-chip>
                                        <v-chip id="[timeTaken]" @dragstart="drag($event)" draggable>Time Taken</v-chip>
                                        <v-chip id="[quizMark]" @dragstart="drag($event)" draggable>Marks</v-chip>
                                        <v-chip id="[userObtainedQuizMark]" @dragstart="drag($event)" draggable>Marks Obtained</v-chip>
                                        <v-chip id="[attemptCount]" @dragstart="drag($event)" draggable>Attempt Number</v-chip>
                                    </v-chip-group>
                                </v-row>
                            </v-card-text>

                            <v-card-text>
                                <v-container>
                                    <v-form ref="form">
                                        <v-row>
                                            <v-col 
                                                cols="12"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.title"
                                                    :label="$t('certificateTitle')"
                                                    :rules="[rules.required]"                                                                                                    
                                                    clearable                       
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col 
                                                cols="12"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.heading"
                                                    :label="$t('certificateTopHeader')"
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
                                                    v-model="editedItem.mainText"
                                                    :label="$t('certificateMainText')"                                                 
                                                    :rules="[rules.required]"
                                                    @drop="drop($event)"
                                                    @dragover="allowDrop($event)"
                                                    rows="5"                                                                                                    
                                                    clearable                       
                                                ></v-textarea>
                                            </v-col>
                                        </v-row>                                      
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-file-input
                                                    v-model="leftImageFile"
                                                    accept="image/*"
                                                    :label="$t('topLeftLogo')" 
                                                    prepend-icon="mdi-camera"
                                                    @change="onLeftImageSelected"                       
                                                    show-size
                                                >
                                                </v-file-input> 
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-img                       
                                                    :src="previewLeftImage"
                                                    max-height="100"
                                                    max-width="150"
                                                    contain                      
                                                >
                                                </v-img>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-file-input
                                                    v-model="rightImageFile"
                                                    accept="image/*"
                                                    :label="$t('topRightLogo')"
                                                    prepend-icon="mdi-camera"
                                                    @change="onRightImageSelected"                       
                                                    show-size
                                                >
                                                </v-file-input> 
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-img                       
                                                    :src="previewRightImage"
                                                    max-height="100"
                                                    max-width="150"
                                                    contain                      
                                                >
                                                </v-img>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-file-input
                                                    v-model="bottomImageFile"
                                                    accept="image/*"
                                                    :label="$t('bottomLogo')"
                                                    prepend-icon="mdi-camera"
                                                    @change="onBottomImageSelected"                       
                                                    show-size
                                                >
                                                </v-file-input> 
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-img                       
                                                    :src="previewBottomImage"
                                                    max-height="100"
                                                    max-width="150"
                                                    contain                      
                                                >
                                                </v-img>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.backgroundColor"
                                                    :label="$t('backgroundColor')"                                                                                                                                                      
                                                    readonly                       
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-color-picker
                                                v-model="colorBackgroundCode"                              
                                                dot-size="25"                                      
                                                swatches-max-height="200"
                                                mode="hexa"
                                                hide-mode-switch                    
                                                ></v-color-picker>
                                            </v-col>
                                                <!-- <v-col
                                                    cols="12"
                                                    sm="6"
                                                    md="3"
                                                >
                                                    <v-file-input
                                                        v-model="backGroundImageFile"
                                                        accept="image/*"
                                                        :label="$t('backGround')"
                                                        prepend-icon="mdi-camera"
                                                        @change="onBackGroundImageSelected"                       
                                                        show-size
                                                    >
                                                    </v-file-input> 
                                                </v-col>
                                                <v-col
                                                    cols="12"
                                                    sm="6"
                                                    md="3"
                                                >
                                                    <v-img                       
                                                        :src="previewBackGroundImage"
                                                        max-height="100"
                                                        max-width="150"
                                                        contain                      
                                                    >
                                                    </v-img>
                                                </v-col> -->
                                        </v-row>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-file-input
                                                    v-model="signatureLeftImage"
                                                    accept="image/*"
                                                    :label="$t('signatureLeft')"
                                                    prepend-icon="mdi-camera"
                                                    @change="onSignatureLeftSelected"                       
                                                    show-size
                                                >
                                                </v-file-input> 
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-img                       
                                                    :src="previewSignatureLeft"
                                                    max-height="100"
                                                    max-width="150"
                                                    contain                      
                                                >
                                                </v-img>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="6"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.leftSignatureText"
                                                    :label="$t('signatureLeftText')"                                                                                                                                                     
                                                    clearable                       
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-file-input
                                                    v-model="signatureRightImage"
                                                    accept="image/*"
                                                    :label="$t('signatureRight')"
                                                    prepend-icon="mdi-camera"
                                                    @change="onSignatureRightSelected"                       
                                                    show-size
                                                >
                                                </v-file-input> 
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="3"
                                            >
                                                <v-img                       
                                                    :src="previewSignatureRight"
                                                    max-height="100"
                                                    max-width="150"
                                                    contain                      
                                                >
                                                </v-img>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="6"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.rightSignatureText"
                                                    :label="$t('signatureRightText')"                                                                                                                                                      
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
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="viewCertificate(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            visibility
                        </v-icon>
                    </template>
                    <span>{{$t('view')}}</span>
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
                            class="mr-2"
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
import Loading from '../../components/common/Loading'
import config from '../../../public/config'

export default {
    name:'Certificates',
    components:{
      Message,
      Loading
    },
    data(){
        return{
            publishMenu:false,
            leftImageFile:null,
            previewLeftImage:null,
            selectedLeftImage:null,
            rightImageFile:null,
            previewRightImage:null,
            selectedRightImage:null,
            bottomImageFile:null,
            previewBottomImage:null,
            selectedBottomImage:null,
            backGroundImageFile:null,
            previewBackGroundImage:null,
            selectedBackGroundImage:null,
            signatureLeftImage:null,
            previewSignatureLeft:null,
            selectedSignatureLeftImage:null,
            signatureRightImage:null,
            previewSignatureRight:null,
            selectedSignatureRightImage:null,
            dialog:false,
            dialogDelete:false,
            colorBackgroundCode:'#FFFFFF',
            imgPath:'/Resources/CertificateImages/',
            rules:{
                required:value=>!!value||this.$t('required'),
            },
            headersTemplate:[
                {text:this.$t('title'),value:'title'},
                {text:this.$t('header'),value:'heading'},
                {text:this.$t('mainText'),value:'mainText'},
                {text:this.$t('actions'), value: 'actions', sortable: false},
            ],
            itemsTemplate:[],
            editedIndex:-1,
            editedItem:{
                certificateTemplateId:null,
                title:'',
                heading:'',
                mainText:'',
                publishDate:'',
                topLeftImagePath:'',
                topRightImagePath:'',
                bottomMiddleImagePath:'',                  
                backgroundImagePath:'',
                backgroundColor:'',
                leftSignatureImagePath:'',
                leftSignatureText:'',
                rightSignatureImagePath:'',
                rightSignatureText:'',
            },
            defaultItem:{
                certificateTemplateId:null,
                title:'',
                heading:'',
                mainText:'',
                publishDate:'',
                topLeftImagePath:'',
                topRightImagePath:'',
                bottomMiddleImagePath:'',
                backgroundImagePath:'',
                backgroundColor:'',
                leftSignatureImagePath:'',
                leftSignatureText:'',
                rightSignatureImagePath:'',
                rightSignatureText:'',              
            },
        }
    },
    methods:{
        onLeftImageSelected(e){
            if(e!=null){
                this.selectedLeftImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedLeftImage)
                reader.onload=e=>{
                    this.previewLeftImage=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedLeftImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{                
                    if(response.status==200){
                        this.editedItem.topLeftImagePath=response.data.fileName                     
                    }
                })
            }else{               
                this.selectedLeftImage=null
                this.previewLeftImage=null
                this.editedItem.topLeftImagePath=''
            }                      
        },
        onRightImageSelected(e){
            if(e!=null){
                this.selectedRightImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedRightImage)
                reader.onload=e=>{
                    this.previewRightImage=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedRightImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{
                    if(response.status==200){
                        this.editedItem.topRightImagePath=response.data.fileName                         
                    }
                })
            }else{               
                this.selectedRightImage=null
                this.previewRightImage=null
                this.editedItem.topRightImagePath=''
            }                      
        },
        onBottomImageSelected(e){
            if(e!=null){
                this.selectedBottomImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedBottomImage)
                reader.onload=e=>{
                    this.previewBottomImage=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedBottomImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{
                    if(response.status==200){
                        this.editedItem.bottomMiddleImagePath=response.data.fileName                         
                    }
                })
            }else{               
                this.selectedBottomImage=null
                this.previewBottomImage=null
                this.editedItem.bottomMiddleImagePath=''
            }                      
        },
        onBackGroundImageSelected(e){
            if(e!=null){
                this.selectedBackGroundImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedBackGroundImage)
                reader.onload=e=>{
                    this.previewBackGroundImage=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedBackGroundImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{
                    if(response.status==200){
                        this.editedItem.backgroundImagePath=response.data.fileName                          
                    }
                })
            }else{               
                this.selectedBackGroundImage=null
                this.previewBackGroundImage=null
                this.editedItem.backgroundImagePath=''
            }                      
        },
        onSignatureLeftSelected(e){
            if(e!=null){
                this.selectedSignatureLeftImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedSignatureLeftImage)
                reader.onload=e=>{
                    this.previewSignatureLeft=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedSignatureLeftImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{
                    if(response.status==200){
                        this.editedItem.leftSignatureImagePath=response.data.fileName                         
                    }
                })
            }else{               
                this.selectedSignatureLeftImage=null
                this.previewSignatureLeft=null
                this.editedItem.leftSignatureImagePath=''
            }                      
        },
        onSignatureRightSelected(e){
            if(e!=null){
                this.selectedSignatureRightImage=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedSignatureRightImage)
                reader.onload=e=>{
                    this.previewSignatureRight=e.target.result
                }
                let fd=new FormData()
                fd.append('image',this.selectedSignatureRightImage)
                this.$store.dispatch('quiz/uploadCertificateImage',fd)
                .then(response=>{
                    if(response.status==200){
                        this.editedItem.rightSignatureImagePath=response.data.fileName                           
                    }
                })
            }else{               
                this.selectedSignatureRightImage=null
                this.previewSignatureRight=null
                this.editedItem.rightSignatureImagePath=''
            }                      
        },
        initialize(id){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('quiz/fetchCertificates',id)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsTemplate=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        editItem(item){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('report/fetchCertificateData',item.certificateTemplateId)
            .then(response=>{
                if(response.status==200){
                    this.previewLeftImage=response.data.topLeftImagePath!=''?config.hostname+this.imgPath+response.data.topLeftImagePath:''
                    this.previewRightImage=response.data.topRightImagePath!=''?config.hostname+this.imgPath+response.data.topRightImagePath:''
                    this.previewBottomImage=response.data.bottomMiddleImagePath!=''?config.hostname+this.imgPath+response.data.bottomMiddleImagePath:''
                    this.previewBackGroundImage=response.data.backgroundImagePath!=''?config.hostname+this.imgPath+response.data.backgroundImagePath:''
                    this.previewSignatureLeft=response.data.leftSignatureImagePath!=''?config.hostname+this.imgPath+response.data.leftSignatureImagePath:''
                    this.previewSignatureRight=response.data.rightSignatureImagePath!=''?config.hostname+this.imgPath+response.data.rightSignatureImagePath:''
                    this.editedIndex=this.itemsTemplate.indexOf(item)          
                    this.editedItem=Object.assign({},response.data)
                    this.colorBackgroundCode=response.data.backgroundColor
                    this.$store.dispatch('dashboard/cancelLoading')
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',response.data.responseMsg)
                }
            })
            .catch(err=>{
                console.log(err)
            })
            this.dialog=true
        },
        viewCertificate(item){
            window.open(config.hostname+'/api/Quiz/CreateCertificate/'+item.certificateTemplateId)
            /* this.$store.dispatch('quiz/storeSingleTemplate',item)
            this.$router.push({name:'Template'}) */
        },
        deleteItem(item){
            this.editedItem = Object.assign({}, item)
            this.dialogDelete=true
        },
        deleteItemConfirm () {       
            this.$store.dispatch('quiz/deleteTemplate',this.editedItem.certificateTemplateId)
            .then(response=>{
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                    this.initialize(this.$store.getters['dashboard/userInfo'].userId)
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
        drag(event) {
            event.dataTransfer.setData("text", event.target.id)
        },
        drop(event) {
            event.target.value += event.dataTransfer.getData("text")
            this.editedItem.mainText=event.target.value
        },
        allowDrop(event) {
            event.preventDefault()
        },
        close(){
            this.dialog=false
            this.leftImageFile=null
            this.selectedLeftImage=null
            this.previewLeftImage=null
            this.rightImageFile=null
            this.selectedRightImage=null
            this.previewRightImage=null
            this.bottomImageFile=null
            this.selectedBottomImage=null
            this.previewBottomImage=null
            this.backGroundImageFile=null
            this.selectedBackGroundImage=null
            this.previewBackGroundImage=null
            this.signatureLeftImage=null
            this.selectedSignatureLeftImage=null
            this.previewSignatureLeft=null
            this.signatureRightImage=null
            this.selectedSignatureRightImage=null
            this.previewSignatureRight=null
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
        save(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('dashboard/applyLoading')
                const objCertificate={
                    title:this.editedItem.title.trim(),
                    heading:this.editedItem.heading.trim(),
                    mainText:this.editedItem.mainText.trim(),
                    publishDate:this.editedItem.publishDate==''?'':this.editedItem.publishDate.substr(0,10),
                    topLeftImagePath:this.editedItem.topLeftImagePath,
                    topRightImagePath:this.editedItem.topRightImagePath,
                    bottomMiddleImagePath:this.editedItem.bottomMiddleImagePath,
                    backgroundImagePath:this.editedItem.backgroundImagePath,
                    backgroundColor:this.colorBackgroundCode,
                    leftSignatureImagePath:this.editedItem.leftSignatureImagePath,
                    leftSignatureText:this.editedItem.leftSignatureText.trim(),
                    rightSignatureImagePath:this.editedItem.rightSignatureImagePath,
                    rightSignatureText:this.editedItem.rightSignatureText.trim(),
                    addedBy:parseInt(localStorage.getItem('loggedUserId')),
                }
                if (this.editedIndex > -1){
                    objCertificate.certificateTemplateId=this.editedItem.certificateTemplateId
                    objCertificate.lastUpdatedBy=parseInt(localStorage.getItem('loggedUserId'))

                    this.$store.dispatch('quiz/updateTemplate',objCertificate)
                    .then(response=>{
                    if(response.status==200){
                        this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                        this.initialize(this.$store.getters['dashboard/userInfo'].userId)
                        this.close()
                    }else if(response.status==202){
                            this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                        }
                    })
                    .catch(err=>{
                        this.$router.push({name:'NoInternet'})
                        console.log(err)
                    })

                }else{
                    this.$store.dispatch('quiz/createTemplate',objCertificate)
                    .then(response=>{
                    if(response.status==200){
                        this.$root.$emit('message_from_parent',this.$t('successfullySaved'))
                        this.initialize(this.$store.getters['dashboard/userInfo'].userId)
                        this.close()
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
        formTitle(){
            return this.editedIndex===-1?this.$t('newTemplate'):this.$t('editTemplate')
        },
        colorBackground(){
            return this.colorBackgroundCode
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
        this.initialize(this.$store.getters['dashboard/userInfo'].userId)
    }
}
</script>