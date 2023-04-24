<template>
    <v-container class="px-0">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-select
                    :label="$t('selectonetofilter')"
                    :items="quizes"
                    item-text="quizTitle"
                    item-value="quizTopicId"
                    v-on:change="filterResult"
                    prepend-icon="emoji_objects"
                    menu-props="auto"
                    return-object
                    clearable
                >
                </v-select>
            </v-col>
        </v-row>
        <v-row justify="end">        
            <v-col cols="12" sm="4" md="4">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :label="$t('search')"
                    single-line
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>
        
        <v-data-table
            :headers="headersResults"
            :items="itemsResults"
            :search="search"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-dialog
                    v-model="dialog"
                    max-width="1000"
                >
                    <v-card>
                        <Loading/>
                        <v-card-text>
                            <v-container class="px-0"> 
                                <v-row justify="center">
                                    <v-col cols="6" sm="2" class="font-weight-black"><h3>{{$t('resultSheet')}}</h3></v-col>
                                </v-row>                                  
                                <v-row>
                                    <v-col cols="12" sm="1">
                                        <span class="font-weight-medium">{{$t('name')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <span>{{participantName}}</span>                                          
                                    </v-col>
                                    <v-col cols="12" sm="1">
                                        <span class="font-weight-medium">{{$t('email')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <span>{{participantEmail}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="1">
                                        <span class="font-weight-medium">{{$t('title')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <span>{{quizName}}</span>
                                    </v-col>
                                </v-row>                                                                  
                                <v-row>
                                    <v-col cols="12" sm="1">
                                        <span class="font-weight-medium">{{$t('timeTakenMin')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <span>{{quizAssignTime}} min</span>
                                    </v-col>
                                    <v-col cols="12" sm="1">
                                        <span class="font-weight-medium">{{$t('marks')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <span>{{quizAssignMarks}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="2">
                                        <span class="font-weight-medium">{{$t('marksObtained')}}</span>
                                    </v-col>
                                    <v-col cols="12" sm="2">
                                        <span>{{userObtainedMarks}}</span>
                                    </v-col>
                                </v-row>
                                <v-data-table
                                    :headers="headersSingleResult"
                                    :items="itemsSingleResult"
                                    disable-pagination
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.isAnswerSkipped`]="{item}">
                                        <span>{{formatAnswerSkipped(item)}}</span> 
                                    </template>
                                    <template v-slot:[`item.questionMark`]="{item}">
                                        <span>{{formatQuestionMarks(item)}}</span> 
                                    </template>
                                    <template v-slot:[`item.userObtainedQuestionMark`]="{item}">
                                        <span>{{formatUserMarks(item)}}</span> 
                                    </template>
                                    <template v-slot:[`item.correctAnswer`]="{item}">
                                        <span>{{formatCorrectAnswer(item)}}</span> 
                                    </template>
                                </v-data-table>
                            </v-container>                           
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </template>
            <template v-slot:[`item.actions`]="{item}">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            class="mr-2"
                            small
                            @click="getDetailResult(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            description
                        </v-icon>
                    </template>                   
                    <span>{{$t('resultSheet')}}</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            v-if="chkCertificateVisibility(item)"
                            @click="getCertificate(item)"
                            v-bind="attrs"
                            v-on="on"
                        >
                            card_giftcard
                        </v-icon>
                    </template>                   
                    <span>{{$t('certificate')}}</span>
                </v-tooltip>
            </template>
            <template v-slot:[`item.quizMark`]="{item}">
                <span>{{formatQuizMarks(item)}}</span> 
            </template>
            <template v-slot:[`item.userObtainedQuizMark`]="{item}">
                <span>{{formatObtainedMarks(item)}}</span> 
            </template>
            <template v-slot:[`item.isExamined`]="{item}">
                <span>{{formatStatus(item)}}</span> 
            </template>
            <template v-slot:[`item.quizTime`]="{item}">
                <span>{{formatQuizTime(item)}}</span> 
            </template>
            <template v-slot:[`item.dateAdded`]="{item}">
                <span>{{formatDateTime(item)}}</span> 
            </template>
        </v-data-table>
    </v-container>
</template>

<script>

import Loading from '../../components/common/Loading'
import config from '../../../public/config'
export default {
    name: 'Students',
    components:{
      Loading
    },
    data() {
        return {
            search: "",
            dialog: false,
            userInfo: {},
            quizes: [],
            itemsResults: [],
            filteredItemsResults: [],
            /* headersResults: [
                { text: "Name", value: "fullName" },
                { text: "Email", value: "email" },
                { text: "Title", value: "quizTitle" },
                { text: "Time(min)", value: "quizTime" },
                { text: "Time taken(min)", value: "timeTaken" },
                { text: "Marks", value: "quizMark" },
                { text: "Marks Obtained", value: "userObtainedQuizMark" },
                { text: "Status", value: "isExamined" },
                { text: "Attempt Number", value: "attemptCount" },
                { text: "Attempt Date-Time", value: "dateAdded" },
                { text: "Actions", value: "actions", sortable: false },
            ], */
            headersResults:[
                {text:this.$t('name'),value:'fullName'},
                {text:this.$t('email'),value:'email'},
                {text:this.$t('title'),value:'quizTitle'},
                {text:this.$t('timeMin'),value:'quizTime'},
                {text:this.$t('timeTakenMin'),value:'timeTaken'},
                {text:this.$t('marks'),value:'quizMark'},
                {text:this.$t('marksObtained'),value:'userObtainedQuizMark'},
                {text:this.$t('status'),value:'isExamined'},               
                {text:this.$t('attemptNumber'),value:'attemptCount'},
                {text:this.$t('attemptDateTime'),value:'dateAdded'},
                {text:this.$t('actions'), value:'actions', sortable: false },
            ],
            itemsSingleResult: [],
            /* headersFiltered: [
                { text: "Question", value: "questionDetail" },
                { text: "Your Answer", value: "userAnswer" },
                { text: "Correct Answer", value: "correctAnswer" },
                { text: "Skipped?", value: "isAnswerSkipped" },
                { text: "Explanation", value: "answerExplanation" },
                { text: "Question Marks", value: "questionMark" },
                { text: "Your Marks", value: "userObtainedQuestionMark" },
            ], */
            headersFiltered:[
                {text:this.$t('question'),value:'questionDetail'},
                {text:this.$t('answerInput'),value:'userAnswer'},
                //{text:this.$t('correctAnswer'),value:'correctAnswer'},
                {text:'Correct Answer',value:'correctAnswer'},
                {text:this.$t('skipped'),value:'isAnswerSkipped'},
                {text:this.$t('answerExplanation'),value:'answerExplanation'},
                {text:this.$t('questionMark'),value:'questionMark'},
                {text:this.$t('yourMarks'),value:'userObtainedQuestionMark'},
            ],
            allowCorrectOption: null,
            name: "",
            email: "",
            quizTitle: "",
            timeTaken: "",
            quizMarks: "",
            marksObtained: ""
        };
    },
    methods: {
        getQuizesFiltered(id) {
            this.$store.dispatch("dashboard/applyLoading");
            this.$store.dispatch("report/fetchQuizesFiltered", id)
            .then((response) => {
                this.quizes = response.data;
                this.$store.dispatch("dashboard/cancelLoading");
            })
            .catch((err) => {
                this.$router.push({name:'NoInternet'})
                console.log(err);
            });
        },
        quizResultsFiltered(id) {
            this.$store.dispatch("dashboard/applyLoading");
            this.$store.dispatch("report/fetchResultsFiltered", id)
            .then((response) => {
                this.$store.dispatch("dashboard/cancelLoading");
                this.itemsResults = response.data;
                this.filteredItemsResults = this.itemsResults;
            })
            .catch((err) => {
                this.$router.push({name:'NoInternet'})
                console.log(err);
            });
        },
        filterResult(obj) {
            if (obj == null) {
                this.itemsResults = this.filteredItemsResults;
            }
            else {
                this.itemsResults = this.filteredItemsResults.filter(function (item) {
                    return item.quizTopicId == obj.quizTopicId;
                });
            }
        },
        quizResult(id) {
            this.$store.dispatch("dashboard/applyLoading");
            this.$store.dispatch("dashboard/fetchFinishedExamResult", id)
            .then((response) => {
                this.$store.dispatch("dashboard/cancelLoading");
                this.itemsSingleResult = response.data;
                this.allowCorrectOption = this.itemsSingleResult[0].allowCorrectOption;
                this.name = this.itemsSingleResult[0].fullName;
                this.email = this.itemsSingleResult[0].email;
                this.quizTitle = this.itemsSingleResult[0].quizTitle;
                this.timeTaken = this.itemsSingleResult[0].timeTaken;
                this.quizMarks = this.itemsSingleResult[0].quizMark == 0 ? "n/a" : this.itemsSingleResult[0].quizMark;
                this.marksObtained = this.itemsSingleResult[0].quizMark == 0 ? "n/a" : (this.itemsSingleResult[0].userObtainedQuizMark > this.itemsSingleResult[0].quizMark ? this.itemsSingleResult[0].quizMark : this.itemsSingleResult[0].userObtainedQuizMark);
            })
            .catch((err) => {
                this.$router.push({name:'NoInternet'})
                console.log(err);
            });
        },
        getDetailResult(item) {
            this.dialog = true;
            this.quizResult(item.quizResponseInitialId);
        },
        chkCertificateVisibility(item) {
            if (this.userInfo.roleName == "Admin") {
                return false;
            }
            else if (item.certificateTemplateId != null && item.quizPassMarks == 0) {
                return true;
            }
            else if (item.certificateTemplateId != null && item.quizPassMarks != 0 && item.userObtainedQuizMark >= item.quizPassMarks) {
                return true;
            }
            else {
                return false;
            }
        },
        getCertificate(item) {
            /* this.$store.dispatch("report/storeCertificateInfo", item);
            this.$router.push({ name: "Template" }); */
            window.open(config.hostname+'/api/Quiz/ShowCertificate/'+item.certificateTemplateId+'/'+item.userId+'/'+item.quizResponseInitialId)
        },
        formatQuizTime(item) {
            return item.quizTime == 0 ? "n/a" : item.quizTime;
        },
        formatQuizMarks(item) {
            return item.quizMark == 0 ? "n/a" : item.quizMark;
        },
        formatObtainedMarks(item) {
            return item.isExamined == false ? "" : (item.quizMark == 0 ? "n/a" : item.userObtainedQuizMark);
        },
        formatStatus(item) {
            return ((item.isExamined == true && item.quizMark > 0) && (item.userObtainedQuizMark >= item.quizPassMarks)) ? "Passed" : (item.quizMark == 0 ? "n/a" : (item.isExamined == false ? "Pending" : "Failed"));
        },
        formatAnswerSkipped(item) {
            return item.isAnswerSkipped == true ? "yes" : "no";
        },
        formatQuestionMarks(item) {
            return item.questionMark == 0 ? "n/a" : item.questionMark;
        },
        formatUserMarks(item) {
            return item.questionMark == 0 ? "n/a" : item.userObtainedQuestionMark;
        },
        formatDateTime(item) {
            return item.dateAdded.replace("T", " ").substring(0, 19);
        },
        formatCorrectAnswer(item) {
            return item.correctAnswer != null ? item.correctAnswer.replace(/#####/g, ",") : "";
        },
    },
    computed: {
        participantName: function () {
            return this.name;
        },
        participantEmail: function () {
            return this.email;
        },
        quizName: function () {
            return this.quizTitle;
        },
        quizAssignTime: function () {
            return this.timeTaken;
        },
        quizAssignMarks: function () {
            return this.quizMarks;
        },
        userObtainedMarks: function () {
            return this.marksObtained;
        },
        headersSingleResult: function () {
            return this.userInfo.roleName == "Admin" ? this.headersFiltered :
                (this.userInfo.roleName == "Student" && this.allowCorrectOption == true ? this.headersFiltered : this.headersFiltered.filter(function (item) {
                    //return item.text != this.$t('correctAnswer');
                    return item.text != 'Correct Answer';
                }));
        }
    },
    created() {
        this.userInfo = this.$store.getters["dashboard/userInfo"];
        if (this.userInfo.roleName == "Student") {
            this.quizResultsFiltered(this.userInfo.userId);
            this.getQuizesFiltered(this.userInfo.userId);
        }
    }
}
</script>