<template>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <div class="display-3 mt-5">{{$t('entryRestricted')}}</div>
            <div class="grey--text lighten-5">
              {{$t('forbiddenMsg')}} 
            </div>
            <div class="paragraph-text mt-2">
              <br />
              <br />{{$t('errorBackMsg')}} <router-link to="/">{{$t('here')}}</router-link>.                        
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>  
</template>

<script>
export default {
    name:'Forbidden',
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