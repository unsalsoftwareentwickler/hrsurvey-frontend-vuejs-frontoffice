<template>
    <v-container class="px-0">
        <Message/>
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsTopics" :columns="excelColumnsTopics" :filename="'topics-table'" :sheetname="'quiz'">{{$t('excel')}}</vue-excel-xlsx>
        <v-btn small outlined><download-csv :data="itemsTopics" name= "topics-table.csv">{{$t('csv')}}</download-csv></v-btn>
        <v-data-table
        :headers="headersTopics"
        :items="itemsTopics"
        class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >         
                    <v-dialog
                        v-model="dialog"
                        max-width="950"
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
                            {{$t('newAssessment')}}
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
                                                    v-model="editedItem.quizTitle"
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
                                                <v-select
                                                    v-model="markOptionSelect"
                                                    :label="$t('markOption')"
                                                    :items="markOptionItems"
                                                    item-text="quizMarkOptionName"
                                                    item-value="quizMarkOptionId"
                                                    :rules="[rules.required]"   
                                                    v-on:change="chkMarkOptions"                                                    
                                                    clearable
                                                    return-object                       
                                                ></v-select>                                         
                                            </v-col>                                                            
                                        </v-row>
                                        <v-row>                       
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowMultipleAttempt"
                                                    :label="$t('allowMultipleAttempt')"
                                                >
                                                </v-checkbox>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                                v-if="chkMultipleInputVisibility==true"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowMultipleInputByUser"
                                                    :label="$t('allowMultipleInput')"                                                  
                                                >
                                                </v-checkbox>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                                v-if="chkMultipleAnswerVisibility==true"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowMultipleAnswer"                                                    
                                                    :label="$t('allowMultipleAnswer')"                                    
                                                >
                                                </v-checkbox>
                                            </v-col> 
                                        </v-row>
                                        <v-row v-if="chkMarksVisibility==true">                                
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                                v-if="chkQuestionWiseSetVisibility==true"
                                            >
                                                <v-text-field
                                                    v-model="editedItem.quizTotalMarks"                                       
                                                    :label="$t('marks')"
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
                                                    v-model="editedItem.quizTime"
                                                    type="number"                                       
                                                    :label="$t('reqTimeInMin')"
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
                                                    v-model="editedItem.quizPassMarks"
                                                    :label="$t('passMarks')"
                                                    type="number"
                                                    :rules="[rules.passVal]"                                      
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
                                                <v-menu
                                                    v-model="startTime"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="auto"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.quizscheduleStartTime"
                                                            :label="$t('scheduleStartDate')"
                                                            prepend-icon="mdi-calendar"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            clearable                                                         
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        v-model="editedItem.quizscheduleStartTime"
                                                        @input="startTime = false"
                                                    ></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-menu
                                                    v-model="endTime"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="auto"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.quizscheduleEndTime"
                                                            :label="$t('scheduleEndDate')"
                                                            prepend-icon="mdi-calendar"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            clearable                       
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        v-model="editedItem.quizscheduleEndTime"
                                                        @input="endTime = false"
                                                    ></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >                     
                                                <v-select
                                                    v-model="templateOptionSelect"
                                                    :label="$t('certificateTemplate')"
                                                    :items="templateOptionItems"
                                                    item-text="title"
                                                    item-value="certificateTemplateId" 
                                                    v-on:change="chkTemplateOptions"                                                  
                                                    clearable
                                                    return-object                       
                                                ></v-select>                                         
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowQuizStop"
                                                    :label="$t('displayStopOption')"
                                                >
                                                </v-checkbox>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowQuizSkip"
                                                    :label="$t('displaySkipOption')"
                                                >
                                                </v-checkbox>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowQuestionSuffle"
                                                    :label="$t('questionSuffle')"
                                                >
                                                </v-checkbox>
                                            </v-col>
                                        </v-row>
                                        <v-row>   
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >
                                                <v-checkbox
                                                    v-model="editedItem.allowCorrectOption"
                                                    :label="$t('correctAnswerDisplay')"
                                                >
                                                </v-checkbox>
                                            </v-col>                                                                                       
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                            >                     
                                                <v-select
                                                    v-model="participantOptionSelect"
                                                    :label="$t('participantOption')"
                                                    :items="participantOptionItems"
                                                    item-text="quizParticipantOptionName"
                                                    item-value="quizParticipantOptionId"
                                                    :rules="[rules.required]" 
                                                    v-on:change="chkParticipantOptions"                                                      
                                                    clearable
                                                    return-object                       
                                                ></v-select>                                         
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                                v-if="chkParticipantsEmail==true"
                                            >
                                                <v-checkbox
                                                    v-model="emailInvitationToEmail"
                                                    :label="$t('sentInvitationtoEmail')"
                                                >
                                                </v-checkbox>
                                            </v-col>                           
                                        </v-row>
                                        <v-row>                          
                                            <v-col
                                                v-if="chkParticipantsEmail==true"
                                                cols="12"
                                                md="10"                                   
                                            >
                                                <v-textarea
                                                    v-model="participantsEmail"
                                                    :label="$t('participantsEmail')"
                                                    hint="sangibruse@gmail.com,shuvo4958@gmail.com,shuvo4958@hotmail.com"                                       
                                                    :rules="[rules.required]"
                                                    rows="3"
                                                    auto-grow
                                                    clearable
                                                ></v-textarea>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                md="2"
                                            >                                              
                                                <v-text-field
                                                    v-model="editedItem.quizPrice"
                                                    :label="$t('priceUsd')"
                                                    type="number"
                                                    :rules="[rules.passVal]"
                                                    :prefix="getCurrency"                                                                                         
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
                    <v-dialog v-model="dialogDelete" max-width="590px">
                        <v-card>
                            <v-card-title class="headline">{{$t('deleteConfirmMessage')}}</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDialog">{{$t('cancel')}}</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{$t('ok')}}</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogStartQuiz" max-width="620px">
                        <v-card>
                            <v-card-title class="headline">{{$t('sentLive')}}</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDialog">{{$t('cancel')}}</v-btn>
                                <v-btn color="blue darken-1" text @click="startQuizConfirm">{{$t('ok')}}</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogStopQuiz" max-width="570px">
                        <v-card>
                            <v-card-title class="headline">{{$t('stopFromLive')}}</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDialog">{{$t('cancel')}}</v-btn>
                                <v-btn color="blue darken-1" text @click="stopQuizConfirm">{{$t('ok')}}</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.publish`]="{item}"> 
                <v-tooltip v-if="item.isRunning==false" top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small                                         
                            @click="startQuiz(item)" 
                            v-bind="attrs"
                            v-on="on"               
                        >
                            play_arrow
                        </v-icon>
                    </template>
                    <span>{{$t('goLive')}}</span>
                </v-tooltip> 
                <v-tooltip v-if="item.isRunning==true" top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small               
                            @click="stopQuiz(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            block
                        </v-icon>
                    </template>
                    <span>{{$t('stopLive')}}</span>
                </v-tooltip>    
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
                            class="mr-2"
                            @click="addQuestions(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            add_circle
                        </v-icon>
                    </template>                   
                    <span>{{$t('addQuestions')}}</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="addInstructions(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            add_comment
                        </v-icon>
                    </template>                   
                    <span>{{$t('addInstructions')}}</span>
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
            <template v-slot:[`item.allowMultipleInputByUser`]="{item}">
                <span>{{formatMultipleInput(item)}}</span> 
            </template>
            <template v-slot:[`item.allowMultipleAnswer`]="{item}">
                <span>{{formatMultipleAnswer(item)}}</span> 
            </template>
            <template v-slot:[`item.allowMultipleAttempt`]="{item}">
                <span>{{formatMultipleAttempt(item)}}</span> 
            </template>
            <template v-slot:[`item.quizscheduleStartTime`]="{item}">
                <span>{{formatStartTime(item)}}</span> 
            </template>
            <template v-slot:[`item.quizscheduleEndTime`]="{item}">
                <span>{{formatEndTime(item)}}</span> 
            </template>
            <template v-slot:[`item.quizTime`]="{item}">
                <span>{{formatQuizTime(item)}}</span> 
            </template>
            <template v-slot:[`item.quizTotalMarks`]="{item}">
                <span>{{formatQuizMarks(item)}}</span> 
            </template>
            <template v-slot:[`item.isRunning`]="{item}">
                <v-chip text-color="primary" outlined dark>{{formatRunning(item)}}</v-chip> 
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import config from '../../../public/config'
import Message from '../../components/common/Message'
import Loading from '../../components/common/Loading'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
    name:'Topics',
    components:{
      Message,
      Loading
    },
    data(){
        return{
            allSettings:{},
            adminSettings:{},
            isEmailAllowed:false,
            isPaymentAllowed:false,
            emailInvitationToEmail:false,
            topicId:null,
            isParticipantsEmailVisible:false,
            isSetMarksVisible:false,
            isMarksVisible:false,
            isMultipleInputVisible:false,
            isMultipleAnswerVisible:false,
            startTime:false,
            endTime:false,
            participantsEmail:'',
            markOptionSelect: null,
            markOptionItems:[],
            participantOptionSelect: null,
            participantOptionItems:[],
            templateOptionSelect: null,
            templateOptionItems:[],
            quizStartDate:null,
            rules:{
                required:value=>!!value||this.$t('required'),
                minimumVal:value=>value>0,
                passVal:value=>value>=0
            },
            dialog:false,
            dialogDelete:false,
            dialogStartQuiz:false,
            dialogStopQuiz:false,
            headersTopics:[
                {text:this.$t('title'),value:'quizTitle'},
                {text:this.$t('numberofQuestions'),value:'questionsCount'},
                {text:this.$t('timeMin'),value:'quizTime'},
                {text:this.$t('marks'),value:'quizTotalMarks'},
                {text:this.$t('multipleInput'),value:'allowMultipleInputByUser'},
                {text:this.$t('multipleAnswer'),value:'allowMultipleAnswer'},
                {text:this.$t('multitleAttempt'),value:'allowMultipleAttempt'},
                {text:this.$t('scheduleStartDate'),value:'quizscheduleStartTime'},
                {text:this.$t('scheduleEndDate'),value:'quizscheduleEndTime'},
                {text:this.$t('status'),value:'isRunning'},
                {text:this.$t('goLive'), value: 'publish', sortable: false},
                {text:this.$t('actions'), value: 'actions', sortable: false},
            ],
            itemsTopics:[],
            editedIndex:-1,
            editedItem:{
                quizTopicId:null,
                quizTitle:'',
                quizTime:0,
                quizMarkOptionId:null,
                quizParticipantOptionId:null,
                certificateTemplateId:null,
                quizTotalMarks:0,
                quizPassMarks:0,
                allowMultipleInputByUser:false,
                allowMultipleAnswer:false,
                allowMultipleAttempt:false,
                allowCorrectOption:false,
                allowQuizStop:false,
                allowQuizSkip:false,
                allowQuestionSuffle:false,
                quizscheduleStartTime:null,
                quizscheduleEndTime:null,
                quizPrice:0                
            },
            defaultItem:{
                quizTopicId:null,
                quizTitle:'',
                quizTime:0,
                quizMarkOptionId:null,
                quizParticipantOptionId:null,
                certificateTemplateId:null,
                quizTotalMarks:0,
                quizPassMarks:0,
                allowMultipleInputByUser:false,
                allowMultipleAnswer:false,
                allowMultipleAttempt:false,
                allowCorrectOption:false,
                allowQuizStop:false,
                allowQuizSkip:false,
                allowQuestionSuffle:false,
                quizscheduleStartTime:null,
                quizscheduleEndTime:null,
                quizPrice:0              
            },
            excelColumnsTopics : [
                {label:'Title',field:'quizTitle'},
                {label:'Number of Questions',field:'questionsCount'},
                {label:'Time(min)',field:'quizTime'},
                {label:'Marks',field:'quizTotalMarks'},
                {label:'Multiple Input',field:'allowMultipleInputByUser'},
                {label:'Multiple Answer',field:'allowMultipleAnswer'},
                {label:'Multiple Attempt',field:'allowMultipleAttempt'},
                {label:'Schedule Start Time',field:'quizscheduleStartTime'},
                {label:'Schedule End Time',field:'quizscheduleEndTime'}         
           ],
           defaultLogoUrl:window.location.origin+'/upload/logo-quick-test-black.png'
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsTopics,
                columns: [
                    {header:'Title',dataKey:'quizTitle'},
                    {header:'Number of Questions',dataKey:'questionsCount'},
                    {header:'Time(min)',dataKey:'quizTime'},
                    {header:'Marks',dataKey:'quizTotalMarks'},
                    {header:'Multiple Input',dataKey:'allowMultipleInputByUser'},
                    {header:'Multiple Answer',dataKey:'allowMultipleAnswer'},
                    {header:'Multiple Attempt',dataKey:'allowMultipleAttempt'},
                    {header:'Schedule Start Time',dataKey:'quizscheduleStartTime'},
                    {header:'Schedule End Time',dataKey:'quizscheduleEndTime'}                    
                ],
            })
            doc.save('topics-table.pdf')
        },
        chkParticipantOptions(obj){           
            this.participantsEmail=''
            this.emailInvitationToEmail=false
            if(obj==null){
                this.isParticipantsEmailVisible=false
            }else if(obj.quizParticipantOptionId==2){
                this.isParticipantsEmailVisible=true
            }else{
                this.isParticipantsEmailVisible=false
            }
        },
        chkMarkOptions(obj){
            this.editedItem.allowMultipleInputByUser=false
            this.editedItem.allowMultipleAnswer=false
            this.editedItem.quizTime=0
            this.editedItem.quizTotalMarks=0
            this.editedItem.quizPassMarks=0
            if(obj==null){
                this.isMarksVisible=false
                this.isMultipleInputVisible=false
                this.isMultipleAnswerVisible=false
            }
            else if(obj.quizMarkOptionId==1){
                this.isMarksVisible=true
                this.isSetMarksVisible=true
                this.isMultipleInputVisible=true
                this.isMultipleAnswerVisible=true
            }
            else if(obj.quizMarkOptionId==2){
                this.isMarksVisible=false
                this.isMultipleInputVisible=true
                this.isMultipleAnswerVisible=false
            }else if(obj.quizMarkOptionId==3){
                this.isMarksVisible=true
                this.isSetMarksVisible=false
                this.isMultipleInputVisible=true
                this.isMultipleAnswerVisible=true
            }
        },
        chkTemplateOptions(obj){
            if(obj==null){
                this.editedItem.certificateTemplateId=null
            }else{
                this.editedItem.certificateTemplateId=obj.certificateTemplateId
            }
        },
        formatMultipleInput(item){
            return item.allowMultipleInputByUser==true?'yes':'no'
        },
        formatMultipleAnswer(item){
            return item.allowMultipleAnswer==true?'yes':'no'
        },
        formatMultipleAttempt(item){
            return item.allowMultipleAttempt==true?'yes':'no'
        },
        formatStartTime(item){
            return item.quizscheduleStartTime==null?null:item.quizscheduleStartTime.substring(0,10)
        },
        formatEndTime(item){
            return item.quizscheduleEndTime==null?null:item.quizscheduleEndTime.substring(0,10)
        },
        formatQuizTime(item){
            return item.quizMarkOptionId==1 || item.quizMarkOptionId==3?item.quizTime:'n/a'
        },  
        formatQuizMarks(item){
            return item.quizMarkOptionId==1 || item.quizMarkOptionId==3?item.quizTotalMarks:'n/a'
        },
        formatRunning(item){
            if(item.isRunning){
                if(item.quizscheduleStartTime!=null && item.quizscheduleEndTime==null){
                    if(new Date().toJSON().slice(0,10)>=new Date(item.quizscheduleStartTime).toJSON().slice(0,10)){
                        return 'On-live'
                    }else{
                        return ''
                    }
                }else if(item.quizscheduleStartTime!=null && item.quizscheduleEndTime!=null){
                    if(new Date().toJSON().slice(0,10)>=new Date(item.quizscheduleStartTime).toJSON().slice(0,10) && new Date().toJSON().slice(0,10)<=new Date(item.quizscheduleEndTime).toJSON().slice(0,10)){
                        return 'On-live'
                    }else{
                        return ''
                    }
                }else{
                    return 'On-live'
                }
            }else{
                return ''
            }
        },
        getMarkOptions(){
            this.$store.dispatch('quiz/fetchMarkOptions')
            .then((response)=>{
                this.markOptionItems=response.data
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        getParticipantOptions(){
            this.$store.dispatch('quiz/fetchParticipantOptions')
            .then((response)=>{
                this.participantOptionItems=response.data
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        getTemplates(id){
            this.$store.dispatch('quiz/fetchCertificates',id)
            .then((response)=>{
                this.templateOptionItems=response.data
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        initialize(id){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('quiz/fetchQuizTopics',id)
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsTopics=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        editItem(item){
            item.quizscheduleStartTime=item.quizscheduleStartTime==null?null:item.quizscheduleStartTime.substr(0,10)
            item.quizscheduleEndTime=item.quizscheduleEndTime==null?null:item.quizscheduleEndTime.substr(0,10)
            this.markOptionSelect={quizMarkOptionId:item.quizMarkOptionId}
            this.chkMarkOptions(this.markOptionSelect)
            this.participantOptionSelect={quizParticipantOptionId:item.quizParticipantOptionId}
            this.chkParticipantOptions(this.participantOptionSelect)

            this.templateOptionSelect={certificateTemplateId:item.certificateTemplateId}

            this.editedIndex=this.itemsTopics.indexOf(item)
            this.editedItem=Object.assign({},item)
            if(item.quizParticipantOptionId==2){
                this.$store.dispatch('dashboard/applyLoading')
                this.$store.dispatch('quiz/fetchParticipantsEmail',item.quizTopicId)
                .then((response)=>{
                    this.participantsEmail=response.data
                    this.$store.dispatch('dashboard/cancelLoading')
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
            this.dialog=true
        },
        addQuestions(item){
            this.$store.dispatch('question/fetchSingleQuizTopic',item.quizTopicId)
            .then(response=>{
                if(response.status==200){
                    this.$router.push({name:'QuizQuestions'})
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',response.data.responseMsg)
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        addInstructions(item){
            //console.log(item)
            this.$store.dispatch('question/storeSingleQuiz',item)
            this.$router.push({name:'Instruction'})
        },
        startQuiz(item){
            this.editedItem = Object.assign({}, item)
            this.dialogStartQuiz=true
        },
        startQuizConfirm(){
            this.$store.dispatch('dashboard/applyLoading')
            this.quizStartDate=this.editedItem.quizscheduleStartTime
            this.$store.dispatch('quiz/startQuiz',this.editedItem)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')
                if(response.status==200){
                    if(this.quizStartDate!=null){
                        this.$root.$emit('message_from_parent_long',this.$t('thisAssessmentWilllive'))
                    }else{
                        this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                    }
                    this.quizStartDate=null                   
                    this.initialize(this.userInfo.userId)
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
            this.closeDialog()
        },
        stopQuiz(item){
            //console.log(item)
            this.editedItem = Object.assign({}, item)
            this.dialogStopQuiz=true
        },
        stopQuizConfirm(){
            this.$store.dispatch('quiz/stopQuiz',this.editedItem)
            .then(response=>{
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))                 
                    this.initialize(this.userInfo.userId)
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
            this.closeDialog()
        },
        deleteItem(item){
            this.editedItem = Object.assign({}, item)
            this.dialogDelete=true
        },
        deleteItemConfirm () {        
            this.$store.dispatch('quiz/deleteQuizTopic',this.editedItem.quizTopicId)
            .then(response=>{
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t(response.data.responseMsg))
                    this.$store.dispatch('quiz/fetchQuizTopics',this.userInfo.userId)
                    .then((response)=>{
                        this.itemsTopics=response.data                  
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
            this.closeDialog()
        },
        close(){
            this.dialog=false
            this.$nextTick(()=>{   
                this.markOptionSelect=null
                this.participantOptionSelect=null 
                this.templateOptionSelect=null    
                this.participantsEmail=''     
                this.editedItem=Object.assign({},this.defaultItem)
                this.editedIndex=-1
            })
        },
        closeDialog () {
            this.dialogDelete = false
            this.dialogStartQuiz=false
            this.dialogStopQuiz=false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        saveParticipantsEmail(){
            var inputEmails=this.participantsEmail.trim().split(',')
            var sendEmails=[]
            for(var i=0;i<inputEmails.length;i++){
                if(inputEmails[i].length>5){
                    sendEmails.push({'quizTopicId':this.topicId,'email':inputEmails[i].trim(),'addedBy':this.userInfo.userId})
                }           
            }
            this.$store.dispatch('quiz/InsertParticipantsEmail',sendEmails)
            .then(response=>{
                if(response.status==200){
                    if(this.emailInvitationToEmail==true){
                        var logoPath=config.hostname+(this.$store.getters['settings/logoPath']==''?this.defaultLogoUrl:this.$store.getters['settings/logoPath'].replace(/\\/g, '/'))
                        var siteUrl=window.location.origin
                        var registrationLink=siteUrl+'/signIn?ad='+this.userInfo.userId
                        var siteTitle=this.$store.getters['settings/siteTitle']

                        var invitationEmails=[]
                        for(var i=0;i<inputEmails.length;i++){
                            if(inputEmails[i].length>5){
                                invitationEmails.push({'siteTitle':siteTitle,'email':inputEmails[i].trim(),'registrationLink':registrationLink,'logoPath':logoPath,'siteUrl':siteUrl})
                            }           
                        }
                        this.$store.dispatch('quiz/InviteParticipantsByEmail',invitationEmails)
                    }
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        chkEmailAllowed(){
            if(this.allSettings.defaultEmail=='' || this.allSettings.password=='' || this.allSettings.port==0 || this.allSettings.host==''){
                this.isEmailAllowed=false
            }else{
                this.isEmailAllowed=true
            }
        },
        chkPaymentAllowed(){
            this.$store.dispatch('settings/fetchSingleSettings',this.userInfo.userId)
            .then(response=>{
                if(response.status==200){
                    this.adminSettings=response.data
                    if(this.adminSettings.currency=='' || this.adminSettings.currencySymbol=='' || this.adminSettings.stripeSecretKey==null){           
                        this.isPaymentAllowed=false
                    }else{
                        this.isPaymentAllowed=true
                    }
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        save (){
            if(this.$refs.form.validate()){
                const objTopic={
                    quizTitle:this.editedItem.quizTitle.trim(),
                    quizTime:this.editedItem.quizTime,
                    quizTotalMarks:this.editedItem.quizTotalMarks,
                    quizPassMarks:(this.editedItem.quizPassMarks=='' || this.editedItem.quizPassMarks==null)?0:this.editedItem.quizPassMarks,
                    quizMarkOptionId:this.markOptionSelect.quizMarkOptionId,
                    quizParticipantOptionId:this.participantOptionSelect.quizParticipantOptionId,
                    certificateTemplateId:this.editedItem.certificateTemplateId,
                    allowMultipleInputByUser:this.editedItem.allowMultipleInputByUser,
                    allowMultipleAnswer:this.editedItem.allowMultipleAnswer,
                    allowMultipleAttempt:this.editedItem.allowMultipleAttempt,
                    allowCorrectOption:this.editedItem.allowCorrectOption,
                    allowQuizStop:this.editedItem.allowQuizStop,
                    allowQuizSkip:this.editedItem.allowQuizSkip,
                    allowQuestionSuffle:this.editedItem.allowQuestionSuffle,
                    quizscheduleStartTime:this.editedItem.quizscheduleStartTime,
                    quizscheduleEndTime:this.editedItem.quizscheduleEndTime,
                    quizPrice:this.editedItem.quizPrice=='' || this.editedItem.quizPrice==null?0:this.editedItem.quizPrice,
                    addedBy:parseInt(localStorage.getItem('loggedUserId')),
                }
                //console.log(objTopic)
                if(objTopic.quizPrice>0 && this.isPaymentAllowed==false){
                    this.$root.$emit('message_from_parent_long',this.$t('paymentSettingsNotDone'))
                }else if(this.emailInvitationToEmail==true && this.isEmailAllowed==false){
                    this.$root.$emit('message_from_parent_long',this.$t('emailSettingsNotDone'))
                }else if(this.editedItem.quizscheduleStartTime==null && this.editedItem.quizscheduleEndTime!=null){
                    this.$root.$emit('message_from_parent_long',this.$t('noScheduleStartDate'))
                }else if(this.editedItem.quizscheduleStartTime!=null && this.editedItem.quizscheduleEndTime!=null&&new Date(this.editedItem.quizscheduleStartTime)>new Date(this.editedItem.quizscheduleEndTime)){
                    this.$root.$emit('message_from_parent_long',this.$t('scheduleStartDateShouldGreater'))
                }else if(objTopic.quizParticipantOptionId==2 && this.participantsEmail.search(',')==-1){
                    this.$root.$emit('message_from_parent_long',this.$t('noCommaSeperatedEmail'))
                }else if(objTopic.quizMarkOptionId==1 && (Number(objTopic.quizTotalMarks)<Number(objTopic.quizPassMarks))){
                    this.$root.$emit('message_from_parent_long',this.$t('passMarksshouldnotgreaterthanAssessmentMarks'))
                }
                else{   
                    this.$store.dispatch('dashboard/applyLoading')                
                    if (this.editedIndex > -1){
                        objTopic.quizTopicId=this.editedItem.quizTopicId
                        objTopic.lastUpdatedBy=parseInt(localStorage.getItem('loggedUserId'))
                        
                        this.$store.dispatch('quiz/updateQuizTopic',objTopic)
                        .then(response=>{
                        this.$store.dispatch('dashboard/cancelLoading')
                        if(response.status==200){
                            this.topicId=this.editedItem.quizTopicId
                            this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                            this.$store.dispatch('quiz/fetchQuizTopics',this.userInfo.userId)
                            .then((response)=>{                              
                                this.close()
                                this.itemsTopics=response.data
                                if(objTopic.quizParticipantOptionId==2){
                                    this.saveParticipantsEmail()
                                }
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
                        this.$store.dispatch('quiz/createQuizTopic',objTopic)
                        .then(response=>{
                        this.$store.dispatch('dashboard/cancelLoading')
                        if(response.status==200){
                            this.topicId=response.data.quizTopicId
                            this.$root.$emit('message_from_parent_long',this.$t('successfullySaved'))
                            this.$store.dispatch('quiz/fetchQuizTopics',this.userInfo.userId)
                            .then((response)=>{                              
                                this.close()
                                this.itemsTopics=response.data
                                if(objTopic.quizParticipantOptionId==2){
                                    this.saveParticipantsEmail()
                                }
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                        }else if(response.status==202){
                                if(response.data.status=='limitExpired'){
                                    this.close()
                                    this.$root.$emit('message_for_renew_plan',this.$t('limitExpired'))
                                }else if(response.data.status=='dateExpired'){
                                    this.close()
                                    this.$root.$emit('message_for_renew_plan',this.$t('dateExpired'))
                                }else{
                                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                                }
                                
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
    },
    computed:{
        formTitle(){
            return this.editedIndex===-1?this.$t('newAssessment'):this.$t('editAssessment')
        },
        chkMarksVisibility(){
            return this.isMarksVisible
        },
        chkMultipleInputVisibility(){
            return this.isMultipleInputVisible
        },        
        chkMultipleAnswerVisibility(){
            return this.isMultipleAnswerVisible
        },
        chkParticipantsEmail(){
            return this.isParticipantsEmailVisible
        },
        chkQuestionWiseSetVisibility(){
            return this.isSetMarksVisible
        },
        getCurrency(){
            return this.$store.getters['settings/currencySymbol']
        }
    },
    watch:{
        dialog (val) {         
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDialog()
        },
        dialogStartQuiz(val){
            val || this.closeDialog()
        },
        dialogStopQuiz(val){
            val || this.closeDialog()
        },
    },
    created(){
        this.allSettings=this.$store.getters['settings/allSettings']
        this.userInfo=this.$store.getters['dashboard/userInfo']
        this.initialize(this.userInfo.userId)
        this.getMarkOptions()
        this.getParticipantOptions()
        this.getTemplates(this.userInfo.userId)
        this.chkEmailAllowed()
        this.chkPaymentAllowed()
    }
}
</script>