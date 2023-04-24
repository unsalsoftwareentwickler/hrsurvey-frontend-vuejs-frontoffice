<template>
    <nav>
        <v-app-bar app light :color="getAppHeaderColor">
            <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-btn v-if="iconVisible==true" @click="applyLock" icon>
                <v-icon>lock</v-icon>
            </v-btn>
            <v-btn v-if="iconVisible==true" @click="toggle" icon>
                <v-icon>fullscreen</v-icon>
            </v-btn>      
            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <v-btn text v-on="on" color="grey">
                        <v-icon left>expand_more</v-icon>
                        <span class="text-capitalize">{{$t('language')}}</span>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="entry in languages" :key="entry.title" @click="changeLocale(entry.language)">
                        <v-list-item-title><flag :iso="entry.flag" v-bind:squared=false /> {{entry.title}}</v-list-item-title>
                    </v-list-item>                  
                </v-list>
            </v-menu>
            
            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <v-btn text v-on="on" color="grey">
                        <v-icon left>expand_more</v-icon>
                        <span class="text-capitalize">{{$t('personalize')}}</span>
                    </v-btn>
                </template>
                <v-list v-if="getUserRole=='SuperAdmin'">
                    <v-list-item v-for="link in linksAdmin" :key="link.text" :to="link.route">
                        <v-list-item-title>{{$t(link.text)}}</v-list-item-title>
                    </v-list-item>                  
                </v-list> 
                <v-list v-else>
                    <v-list-item v-for="link in linksOthers" :key="link.text" :to="link.route">
                        <v-list-item-title>{{$t(link.text)}}</v-list-item-title>
                    </v-list-item>                  
                </v-list>
            </v-menu>          
            <v-btn @click.stop="dialog=true" icon>
                <v-icon>logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-dialog v-model="dialog" max-width="290" dark persistent>
            <v-card>
                <v-card-title class="headline">{{$t('leaveHeader')}}</v-card-title>
                <v-card-text>{{$t('leaveConfirm')}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog=false">{{$t('stay')}}</v-btn>
                    <v-btn color="dark" text @click="signOut">{{$t('signOut')}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-navigation-drawer 
            v-model="drawer"
            app
            dark
            :color="getAppBarColor">
             
            <v-list>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img :src=getSrc>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="text-capitalize">{{getFullName}}</v-list-item-title>
                        <v-list-item-subtitle v-if="getUserRole=='Admin'"><span class="primary--text">{{getBillingPlan}}</span></v-list-item-subtitle>
                        <v-list-item-subtitle v-else><span class="grey--text">{{getUserRoleDisplay}}</span></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="item in menus" :key="item.appMenuId" :to="item.url">
                    <v-list-item-icon><v-icon>{{item.iconClass}}</v-icon></v-list-item-icon>
                    <!-- <v-list-item-content v-text="item.menuTitle"></v-list-item-content> -->
                    <v-list-item-content>{{$t(item.menuTitle)}}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import config from '../../../public/config'
import i18n from '@/plugins/i18n'

export default {
    name:'Navbar',
    data(){
        return{
            fullscreen:false,
            val:'',
            drawer:true,
            linksAdmin: [
                { text: 'Profile', route: '/user/profile'},
                { text: 'Password', route: '/user/password'},
                { text: 'Browsing', route: '/user/browseList'},
            ],
            linksOthers: [
                { text: 'Profile', route: '/user/profile'},
                { text: 'Password', route: '/user/password' },
            ],
            languages: [
                { flag: 'us', language: 'en', title: 'English' },
                { flag: 'es', language: 'es', title: 'Español' },
                { flag: 'it', language: 'it', title: 'Italiano' },
                { flag: 'in', language: 'in', title: 'हिन्दी' },
                { flag: 'bd', language: 'bn', title: 'বাংলা' },             
            ],
            dialog:false,
            userInfo:null,
            roleId:null,
            token:null,
            menus:[],
            defaultProfileUrl:window.location.origin+'/upload/profile.png',
        }
    },
    methods:{
        changeLocale(locale){
            localStorage.setItem('language', locale)
            i18n.locale = localStorage.getItem('language')
            location.reload()
            //location.replace(window.location.href)
            //i18n.locale=locale
        },
        applyLock(){
            this.$store.dispatch('dashboard/applyOverlay')
        },
        toggle () {
            this.$fullscreen.toggle()
        },
        signOut:function(){
            this.$store.dispatch('dashboard/switchLanding',true)
            this.$store.dispatch('dashboard/signOut')
            .then(()=>{
                this.$router.push('/')
            })
            .catch((err)=>{
                console.log(err)
                this.$router.push({name:'SignIn'})
            })
        },
        getAppMenu(){
            const info={
                roleId:this.$store.getters['dashboard/userInfo'].userRoleId
            }
            this.$store.dispatch('dashboard/fetchMenu',info)
            .then((response)=>{
                if(response.status==200){
                    this.menus=response.data
                }
            })
            .catch((err)=>console.log(err))
        },
    },
    computed:{
        getSrc:function(){
            return (this.$store.getters['dashboard/userInfo'].imagePath==null || this.$store.getters['dashboard/userInfo'].imagePath=='')?this.defaultProfileUrl:config.hostname+this.$store.getters['dashboard/userInfo'].imagePath
        },
        getFullName:function(){
            return this.$store.getters['dashboard/userInfo'].fullName
        },
        getAppBarColor:function(){
            return this.$store.getters['settings/appBarColor']
        },
        getAppHeaderColor:function(){
            return this.$store.getters['settings/headerColor']
        },
        getUserRole:function(){
            return this.$store.getters['dashboard/userInfo'].roleName
        },
        getUserRoleDisplay:function(){
            return this.$store.getters['dashboard/userInfo'].displayName
        },
        getBillingPlan:function(){
            return this.$store.getters['dashboard/userInfo'].planName
        },
        iconVisible(){
            return window.innerWidth>=960?true:false
        }
    },
    created(){
        i18n.locale=(localStorage.getItem('language')==null || localStorage.getItem('language')=='')?'en':localStorage.getItem('language')
        if(this.$store.getters['settings/allSettings'].allowFaq==true){
            this.linksOthers.push({ text: 'FAQ', route: '/settings/faq' })
        }
        this.getAppMenu()
    }
}
</script>