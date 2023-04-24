<template>
    <v-container class="px-0">
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsBrowse" :columns="excelColumnsBrowser" :filename="'browse-table'" :sheetname="'browse'">{{$t('excel')}}</vue-excel-xlsx>
        <v-data-table
            :headers="headersBrowse"
            :items="itemsBrowse"
            class="elevation-1"
        >
        <template v-slot:[`item.logInTime`]="{item}">
            <span>{{formatLoginTime(item)}}</span> 
        </template>
        <template v-slot:[`item.logOutTime`]="{item}">
            <span>{{formatLogoutTime(item)}}</span> 
        </template>
        </v-data-table>
    </v-container>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
    name:'BrowseList',
    data(){
        return{
            headersBrowse:[
                {text:this.$t('name'),value:'fullName'},
                {text:this.$t('email'),value:'email'},
                {text:this.$t('logInTime'),value:'logInTime'},
                {text:this.$t('logOutTime'),value:'logOutTime'},
                {text:this.$t('ip'),value:'ip'},
                {text:this.$t('browser'),value:'browser'},
                {text:this.$t('browserVersion'),value:'browserVersion'},
                {text:this.$t('platform'),value:'platform'}
            ],
            itemsBrowse:[],
            excelColumnsBrowser : [
                {label:'Name',field:'fullName'},
                {label:'Email',field:'email'},
                {label:'LogIn Time',field:'logInTime'},
                {label:'LogOut Time',field:'logOutTime'},
                {label:'IP',field:'ip'},
                {label:'Browser',field:'browser'},
                {label:'Browser Version',field:'browserVersion'},
                {label:'OS',field:'platform'}           
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsBrowse,
                columns: [
                    {header:'Name',dataKey:'fullName'},
                    {header:'Email',dataKey:'email'},
                    {header:'LogIn',dataKey:'logInTime'},
                    {header:'LogOut',dataKey:'logOutTime'},
                    {header:'IP',dataKey:'ip'},
                    {header:'Browser',dataKey:'browser'},
                    {header:'Version',dataKey:'browserVersion'},
                    {header:'OS',dataKey:'platform'}
                ],
            })
            doc.save('browse-table.pdf')
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('user/fetchBrowseList')
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsBrowse=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        formatLoginTime(item){
            return item.logInTime.replace('T',' ').substring(0,19)
        },
        formatLogoutTime(item){
            return item.logOutTime!=null?item.logOutTime.replace('T',' ').substring(0,19):''
        }
    },
    created(){
        this.initialize()
    }
}
</script>