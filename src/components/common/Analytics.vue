<template>
<!-- dashboard analytics start-->
    <v-container>
        <!-- payment bar chart start-->
        <v-row v-if="roleName=='SuperAdmin' || roleName=='Admin'">
            <v-col cols="12">
                <bar-chart v-if="loadPayment" :chartdata="paymentData" :options="barChartOptions"/>
            </v-col>
        </v-row>
        <!-- payment bar chart end-->
        <!-- date wise participation line chart start-->
        <v-row>
            <v-col cols="12">
                <line-chart v-if="loadQuiz" :chartdata="quizCountdata" :options="chartOptions"/>
            </v-col>
        </v-row>
        <!-- date wise participation line chart end-->
        <!-- topic wise participation bar chart start-->
        <v-row>
            <v-col cols="12">
                <bar-chart v-if="loadUser" :chartdata="quizUserCountdata" :options="barChartOptions"/>
            </v-col>
        </v-row>
        <!-- topic wise participation bar chart end-->
        <!-- different pie chart start-->
        <v-row>
            <v-col cols="12" md="4">
                <pie-chart v-if="loadMonth" :chartdata="monthdata" :options="chartOptions"/>
            </v-col>
            <v-col cols="12" md="4">
                <pie-chart v-if="loadBrowser" :chartdata="browserdata" :options="chartOptions"/>
            </v-col>
            <v-col cols="12" md="4">
                <pie-chart v-if="loadPlatform" :chartdata="platformdata" :options="chartOptions"/>
            </v-col>
        </v-row>
        <!-- different pie chart end-->
        <!-- date wise login line chart start-->
        <v-row>
            <v-col cols="12">
                <line-chart v-if="loadDate" :chartdata="datedata" :options="chartOptions"/>
            </v-col>
        </v-row>
        <!-- date wise login line chart end-->
    </v-container>
<!-- dashboard analytics end-->
</template>

<script>

import LineChart from '../../assets/chart/lineChart'
import BarChart from '../../assets/chart/barChart'
import PieChart from '../../assets/chart/pieChart'
export default {
    name:'Analytics',
    components:{
        LineChart,
        BarChart,
        PieChart
    },
    data(){
        return{       
            loadPayment:false,
            paymentData:null,    
            loadQuiz:false,
            quizCountdata:null,
            chartOptions:null,
            loadUser:false,
            quizUserCountdata:null,
            barChartOptions:null,
            loadMonth:false,
            monthdata:null,
            loadBrowser:false,
            browserdata:null,
            loadPlatform:false,
            platformdata:null,
            loadDate:false,
            datedata:null,
            userId:null,
            userInfo:{}
        }
    },
    mounted(){
        this.loadPayment=false
        this.loadQuiz=false
        this.loadUser=false
        this.loadMonth=false
        this.loadBrowser=false
        this.loadPlatform=false
        this.loadDate=false
        this.userId=this.userInfo.userId
        try {
            if(this.userInfo.roleName=='SuperAdmin' || this.userInfo.roleName=='Admin'){
                //date wise payment 
                this.$store.dispatch('dashboard/fetchPaymentCount',this.userId)
                .then((response)=>{
                    if(response.status==200){ 
                        this.paymentData={               
                            labels: response.data.map(x=>x.date.substr(0,10)),           
                            datasets: [
                                {
                                    label: this.$t('dashboardChart1'),
                                    backgroundColor: '#42424',
                                    data: response.data.map(x=>x.count)                       
                                }
                            ]           
                        }  
                        this.loadPayment=true               
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
            //date wise test participation
            this.$store.dispatch('dashboard/fetchQuizCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.quizCountdata={               
                        labels: response.data.map(x=>x.date.substr(0,10)),           
                        datasets: [
                            {
                                label: this.$t('dashboardChart2'),
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)                       
                            }
                        ]           
                    }  
                    this.loadQuiz=true               
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            //topic wise test participation
            this.$store.dispatch('dashboard/fetchQuizUserCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.quizUserCountdata= {
                        labels: response.data.map(x=>x.quizTitle),
                        datasets: [
                            {
                                label: this.$t('dashboardChart3'),
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)
                            }
                        ]
                    }     
                    this.loadUser=true 
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            //user login month wise
            this.$store.dispatch('dashboard/fetchMonthCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.monthdata= {
                        labels: response.data.map(x=>x.month),
                        datasets: [
                            {
                                label: 'Login(Month wise)',
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)
                            }
                        ]
                    }     
                    this.loadMonth=true 
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            //user login browser wise
            this.$store.dispatch('dashboard/fetchBrowserCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.browserdata= {
                        labels: response.data.map(x=>x.browser),
                        datasets: [
                            {
                                label: 'Login(Browser wise)',
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)
                            }
                        ]
                    }     
                    this.loadBrowser=true 
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            //user login operating system wise
            this.$store.dispatch('dashboard/fetchPlatformCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.platformdata= {
                        labels: response.data.map(x=>x.platform),
                        datasets: [
                            {
                                label: 'Login(Platform wise)',
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)
                            }
                        ]
                    }     
                    this.loadPlatform=true 
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            //login date wise
            this.$store.dispatch('dashboard/fetchDateCount',this.userId)
            .then((response)=>{
                if(response.status==200){ 
                    this.datedata= {
                        labels: response.data.map(x=>x.date.substr(0,10)),
                        datasets: [
                            {
                                label: this.$t('dashboardChart4'),
                                backgroundColor: '#42424',
                                data: response.data.map(x=>x.count)
                            }
                        ]
                    }     
                    this.loadDate=true 
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            this.chartOptions= {
                responsive: true,
                maintainAspectRatio: false
            }
            this.barChartOptions= {
                scales:{
                    yAxes: [{
						ticks: {
							beginAtZero: true
						},
						gridLines: {
							display: true
						}
					}],
                    xAxes: [{
						ticks: {
							beginAtZero: true
						},
						gridLines: {
							display: false
						}
					}]
                },
                responsive: true,
                maintainAspectRatio: false
            }
        } catch (error) {
            console.log(error)
        }
    },
    computed:{
        roleName(){
            return this.userInfo.roleName
        },
    },
    created(){
        this.userInfo=this.$store.getters['dashboard/userInfo']
    }
}
</script>