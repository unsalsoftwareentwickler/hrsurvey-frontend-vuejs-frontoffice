<template>
    <v-container>
      <v-row></v-row>
      <v-layout row wrap v-if="checkOnline==false">
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <div class="display-3 mt-5">{{$t('internetDisruption')}}</div>
            <div class="grey--text lighten-5">
                {{$t('noInternetMsg')}}
            </div>
            <div class="paragraph-text mt-2">
              <br />
              <br />{{$t('errorBackMsg')}} <router-link to="/signIn">{{$t('here')}}</router-link>.          
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <div class="display-3 mt-5">{{$t('backOnline')}}</div>
            <div class="grey--text lighten-5">
              {{$t('backOnlineMsg')}}
            </div>
            <div class="paragraph-text mt-2">
              <br />
              <br />{{$t('errorBackMsg')}} <router-link to="/signIn">{{$t('here')}}</router-link>.          
            </div>
          </v-card>
        </v-flex>
      </v-layout>    
    </v-container>  
</template>

<script>
export default {
  name:'NoInternet',
  data(){
    return{
      OnlineStatus:false,
      interval: null,
    }
  },
  methods:{
    getSettings(){
      this.$store.dispatch('settings/fetchSiteSettings')
      .then(response=>{
        if(response.status==200){
          this.OnlineStatus=true
        }
      })
      .catch(err=>{
        this.OnlineStatus=false
        console.log(err)
      })
    },
    periodicCheck(){
      this.interval=setInterval(()=>{
        this.getSettings()
      },30000)
    }
  },
  mounted(){
    this.periodicCheck()
  },
  computed:{
    checkOnline(){
      return this.OnlineStatus
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created(){
    this.$store.dispatch('dashboard/signOut')
  }
}
</script>
<style scoped>
  .paragraph-text {
    font-size: 18px;
  }
</style>