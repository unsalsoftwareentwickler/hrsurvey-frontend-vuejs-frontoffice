<template>
    <v-container class="px-0">
        <v-btn @click="generatePdf" small outlined>{{$t('pdf')}}</v-btn>
        <vue-excel-xlsx class="btnExcel" :data="itemsContacts" :columns="excelColumnsBrowser" :filename="'contacts-table'" :sheetname="'contacts'">{{$t('excel')}}</vue-excel-xlsx>
        <v-data-table
            :headers="headersContacts"
            :items="itemsContacts"
            class="elevation-1"
        >
        </v-data-table>
    </v-container>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
    name:'Contacts',
    data(){
        return{
            headersContacts:[
                {text:this.$t('name'),value:'name'},
                {text:this.$t('email'),value:'email'},
                {text:this.$t('message'),value:'message'},
                {text:this.$t('dateTime'),value:'dateAdded'}
            ],
            itemsContacts:[],
            excelColumnsBrowser : [
                {label:'Name',field:'name'},
                {label:'Email',field:'email'},
                {label:'Message',field:'message'},
                {label:'Date-Time',field:'dateAdded'}           
           ],
        }
    },
    methods:{
        generatePdf(){
            const doc = new jsPDF()
            doc.autoTable({
                margin: { top: 10,left:2,right:1 },
                body: this.itemsContacts,
                columns: [
                    {header:'Name',dataKey:'name'},
                    {header:'Email',dataKey:'email'},
                    {header:'Message',dataKey:'message'},
                    {header:'Date-Time',dataKey:'dateAdded'} 
                ],
            })
            doc.save('Contacts-table.pdf')
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')
            this.$store.dispatch('settings/fetchContacts')
            .then((response)=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.itemsContacts=response.data
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
    },
    created(){
        this.initialize()
    }
}
</script>