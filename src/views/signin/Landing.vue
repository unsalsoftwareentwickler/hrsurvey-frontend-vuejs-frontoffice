<template>
    <v-app>
        <nav>
            <v-navigation-drawer
                v-model="drawer"
                app
                dark
                temporary
            >
                <v-list-item class="pb-2">
                    <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{this.siteName}}
                    </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list dense>
                    <v-list-item
                        v-for="([icon, text, link], i) in itemsXs"
                        :key="i"
                        link
                        @click="$vuetify.goTo(link)"
                    >
                        <v-list-item-icon class="justify-center">
                            <v-icon>{{ icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="subtitile-1">
                            {{text}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                    <v-list-item @click="switchSignIn">
                        <v-list-item-icon class="justify-center">
                            <v-icon>login</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="subtitile-1">
                            {{$t('signIn')}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list> 
            </v-navigation-drawer>
            <v-app-bar app elevation="14">  
                <v-toolbar-title><v-img :src="this.logoPath" max-height="50" max-width="150" contain /></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-app-bar-nav-icon v-if="isXs==true" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <div v-else>
                    <v-btn text @click="$vuetify.goTo('#home')"><span class="text-capitalize">{{$t('home')}}</span></v-btn>
                    <v-btn v-if="this.itemsPlan.length>0" text @click="$vuetify.goTo('#pricing')"><span class="text-capitalize">{{$t('pricing')}}</span></v-btn>
                    <v-btn text @click="$vuetify.goTo('#features')"><span class="text-capitalize">{{$t('features')}}</span></v-btn>
                    <v-btn text @click="$vuetify.goTo('#contact')"><span class="text-capitalize">{{$t('contact')}}</span></v-btn>
                </div>
                <v-spacer v-if="isXs==false"></v-spacer>
                <v-btn v-if="isXs==false" outlined @click="switchSignIn" class="text-capitalize">{{$t('signIn')}}</v-btn>                              
            </v-app-bar>
        </nav>
        <v-main>
            <Message/>
            <section id="home">            
                <v-row justify="center" class="homeMargin">
                    <v-col cols="10">
                        <v-row>
                            <v-col cols="12" md="6" align-self="center">
                                <h1 class="header">{{this.settingsObj.homeHeader1}}</h1>
                                <div class="bodyText">{{this.settingsObj.homeDetail1}}</div>
                                <v-btn outlined @click="$vuetify.goTo('#pricing')" class="text-capitalize">{{$t('getRegister')}}</v-btn>
                            </v-col>
                            <v-col cols="12" md="6" align-self="start">
                                <v-img :src="this.homeImg"></v-img>
                            </v-col>
                        </v-row>
                        
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="10" md="7">
                        <h1 class="header text-center">{{this.settingsObj.homeHeader2}}</h1>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="10" md="10">
                        <p class="bodyText text-center">{{this.settingsObj.homeDetail2}}</p>
                    </v-col>
                </v-row>
                <v-row justify="center" class="mt-16 mb-16">
                    <v-col cols="10">
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-card shaped elevation="16" min-height="185px">
                                    <v-card-title class="grey darken-3 white--text"><v-row justify="center">{{this.settingsObj.homeBox1Header}}</v-row></v-card-title>
                                    <v-card-text>{{this.settingsObj.homeBox1Detail}}</v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-card shaped elevation="16" min-height="185px">
                                    <v-card-title class="grey darken-3 white--text"><v-row justify="center">{{this.settingsObj.homeBox2Header}}</v-row></v-card-title>
                                    <v-card-text>{{this.settingsObj.homeBox2Detail}}</v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-card shaped elevation="16" min-height="185px">
                                    <v-card-title class="grey darken-3 white--text"><v-row justify="center">{{this.settingsObj.homeBox3Header}}</v-row></v-card-title>
                                    <v-card-text>{{this.settingsObj.homeBox3Detail}}</v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-card shaped elevation="16" min-height="185px">
                                    <v-card-title class="grey darken-3 white--text"><v-row justify="center">{{this.settingsObj.homeBox4Header}}</v-row></v-card-title>
                                    <v-card-text>{{this.settingsObj.homeBox4Detail}}</v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </section>

            <section id="pricing" class="mt-16 mb-16">
                <v-row justify="center">
                    <v-col cols="10">
                        <v-row>
                            <v-col cols="12" sm="6" md="4" v-for="item in itemsPlan" :key="item.billingPlanId">
                                <v-card hover shaped outlined class="cardBorder">
                                    <v-card-title class="pt-12"><v-row justify="center">{{item.title}}</v-row></v-card-title>
                                    <v-card-subtitle class="text-center">{{$t(item.interval)}}</v-card-subtitle>
                                    <v-card-subtitle class="text-center"><v-avatar color="grey darken-1" size="70"><span class="lime--text text-h5">${{item.price}}</span></v-avatar></v-card-subtitle>
                                    <v-card-text class="py-8">
                                        <v-row justify="center" class="black--text">{{item.assessmentCount}} {{$t('assessments')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.questionPerAssessmentCount}} {{$t('questionsOnEachAssessment')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.responsePerAssessmentCount}} {{$t('responsesForEachAssessment')}}</v-row>
                                        <v-divider></v-divider>
                                        <v-row justify="center" class="black--text">{{item.additionalText}}</v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-row justify="center" v-if="item.price>0">
                                            <form v-bind:action="stripePostUrl" method="POST">
                                                <input type="hidden" name="billingId" v-bind:value="item.billingPlanId">
                                                <v-btn type="submit" @click="saveBillingPlan(item)" class="text-capitalize" outlined>{{$t('subscribe')}}</v-btn>
                                            </form>
                                        </v-row>   
                                        <v-row justify="center" v-else><v-btn @click="saveBillingPlan(item)" class="text-capitalize" outlined>{{$t('subscribe')}}</v-btn></v-row>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </section>


            <section id="features" class="mt-16 mb-16">
                <v-row justify="center">
                    <v-col cols="10">
                        <v-row>
                            <v-col cols="12" md="6" align-self="center" order="1">
                                <v-card flat>
                                    <v-card-title><h3 class="headerFeature">{{this.settingsObj.feature1Header}}</h3></v-card-title>
                                    <v-card-subtitle>
                                        {{this.settingsObj.feature1Detail}}
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6" order="2">
                                <v-img max-width="500" max-height="500" :src="this.feature1" contain></v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" order="2" order-md="1">
                                <v-img max-width="500" max-height="500" :src="this.feature2"></v-img>
                            </v-col>
                            <v-col cols="12" md="6" align-self="center" order="1" order-md="2">
                                <v-card flat>
                                    <v-card-title><h3 class="headerFeature">{{this.settingsObj.feature2Header}}</h3></v-card-title>
                                    <v-card-subtitle>
                                        {{this.settingsObj.feature2Detail}}
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" align-self="center" order="1">
                                <v-card flat>
                                    <v-card-title><h3 class="headerFeature">{{this.settingsObj.feature3Header}}</h3></v-card-title>
                                    <v-card-subtitle>
                                        {{this.settingsObj.feature3Detail}}
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6" order="2">
                                <v-img max-width="500" max-height="500" :src="this.feature3"></v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" order="2" order-md="1">
                                <v-img max-width="500" max-height="500" :src="this.feature4"></v-img>
                            </v-col>
                            <v-col cols="12" md="6" align-self="center" order="1" order-md="2">
                                <v-card flat>
                                    <v-card-title><h3 class="headerFeature">{{this.settingsObj.feature4Header}}</h3></v-card-title>
                                    <v-card-subtitle>
                                        {{this.settingsObj.feature4Detail}}
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </section>

            <section id="register" class="mt-16 mb-16">
                <v-card class="white--text text-center" dark>
                    <v-card-text class="pt-10">{{this.settingsObj.registrationText}}</v-card-text>
                    <v-row class="pb-10" justify="center"><v-card-actions><v-btn @click="$vuetify.goTo('#pricing')" class="text-capitalize" outlined>{{$t('registerNow')}}</v-btn></v-card-actions></v-row>
                </v-card>
            </section>

            <section id="contact" class="mt-16 mb-16">
                <v-row justify="center">
                    <v-col cols="10">
                        <v-row>
                             <v-col cols="12" sm="5">
                                <h1>{{$t('contactUs')}}</h1>
                                <h4 class="font-weight-light mt-3">
                                    {{this.settingsObj.contactUsText}}
                                </h4>
                                <!-- <h4 class="font-weight-light mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing.
                                </h4> -->
                                <h4 class="font-weight-light mt-3">
                                    {{$t('telephone')}}: {{this.settingsObj.contactUsTelephone}}
                                </h4>
                                <h4 class="font-weight-light">
                                    {{$t('email')}}: {{this.settingsObj.contactUsEmail}}
                                </h4>
                            </v-col>
                            <v-col cols="12" sm="7">
                                <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                                    <v-text-field
                                        v-model="name"
                                        :rules="nameRules"
                                        :label="$t('name')"
                                        required
                                    ></v-text-field>

                                    <v-text-field
                                        v-model="email"
                                        :rules="emailRules"
                                        :label="$t('email')"
                                        required
                                    ></v-text-field>

                                    <v-textarea
                                        v-model="textArea"
                                        :rules="textAreaRules"
                                        :label="$t('message')"
                                        required
                                    />

                                    <v-btn
                                        :disabled="!valid"
                                        color="primary"
                                        :dark="valid"
                                        rounded
                                        block
                                        class="mt-3"
                                        @click="submit"
                                    >
                                    {{$t('submit')}}
                                    </v-btn>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </section>
        </v-main>
        <v-footer
            dark
            padless
        >
            <v-card
            flat
            tile
            width="100%"
            class="text-center"
            >
            <v-card-text>
                <v-btn
                v-for="icon in icons"
                :key="icon.img"
                :href="icon.route"
                class="mx-4 white--text"
                icon
                >
                <v-icon size="24px">
                    {{ icon.img }}
                </v-icon>
                </v-btn>
            </v-card-text>

            <v-card-text class="pt-0">
                {{this.settingsObj.footerText}}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text class="white--text">
                {{ new Date().getFullYear() }} — <strong>{{this.siteName}}</strong>
            </v-card-text>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script>
import config from '../../../public/config'
import Message from '../../components/common/Message'
import i18n from '@/plugins/i18n'

export default{
    name: "Landing",
    components: { Message },
    data() {
        return {
            drawer: null,
            isXs: false,
            itemsPlan:[],
            items: [
                ["mdi-home-outline", "Home", "#home"],
                ["monetization_on", "Pricing", "#pricing"],
                ["featured_play_list", "Features", "#features"],
                ["contact_support", "Contact", "#contact"],
            ],
            itemsPriceLess: [
                ["mdi-home-outline", "Home", "#home"],
                ["featured_play_list", "Features", "#features"],
                ["contact_support", "Contact", "#contact"],
            ],
            icons: [
                { img:'mdi-facebook',text: 'facebook', route: ''},
                { img:'mdi-twitter',text: 'youtube', route: ''},
                { img:'mdi-linkedin',text: 'linkedin', route: ''},
                { img:'mdi-instagram',text: 'instagram', route: ''},
            ],
            logoPath: "",
            homeImg: window.location.origin + "/upload/home.webp",
            feature1: window.location.origin + "/upload/feature1.webp",
            feature2: window.location.origin + "/upload/feature2.webp",
            feature3: window.location.origin + "/upload/feature3.webp",
            feature4: window.location.origin + "/upload/feature4.webp",
            siteName: "",
            defaultLogoUrl: window.location.origin + "/upload/logo-assess-hour.png",
            valid: true,
            name: "",
            nameRules: [
                (v) => !!v || this.$t('nameEmptyRuleLanding'),
                (v) => (v && v.length >= 6) || this.$t('nameCharacterRuleLanding'),
            ],
            email: "",
            emailRules: [
                (v) => !!v || this.$t('emailEmptyRuleLanding'),
                (v) => /.+@.+\..+/.test(v) || this.$t('emailWrongRuleLanding'),
            ],
            textArea: "",
            textAreaRules: [
                (v) => !!v || this.$t('messageEmptyRuleLanding'),
                (v) => (v && v.length >= 10) || this.$t('messageCharacterRuleLanding'),
            ],
            lazy: false,
            settingsObj:{}
        };
    },
    methods: {
        onResize() {
            this.isXs = window.innerWidth < 850;
        },
        switchSignIn() {
            this.$router.push({ name: "SignIn" });
        },
        initializePlan(){
            this.$store.dispatch('settings/fetchBillingPlans')
            .then((response)=>{
                this.itemsPlan=response.data       
            })
            .catch((err)=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        initializeText(){
            this.$store.dispatch('settings/fetchSiteSettings')
            .then((response)=>{
                this.settingsObj=response.data
                this.icons[0].route=this.settingsObj.footerFacebook
                this.icons[1].route=this.settingsObj.footerTwitter
                this.icons[2].route=this.settingsObj.footerLinkedin
                this.icons[3].route=this.settingsObj.footerInstagram        
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        submit() {
            if (this.$refs.form.validate()) {
                const obj = {
                    name: this.name,
                    email: this.email,
                    message: this.textArea
                };
                this.$store.dispatch('settings/createContacts', obj)
                    .then(response => {
                    if (response.status == 200) {
                        this.$root.$emit("message_from_parent", this.$t(response.data.responseMsg));
                    }
                    else if (response.status == 202) {
                        this.$root.$emit("message_from_parent_long", response.data.responseMsg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            }
        },
        saveBillingPlan(item){
            localStorage.setItem('billingPlanId', item.billingPlanId)
            localStorage.setItem('billingPlanPrice', item.price)
            if(item.price==0){
                this.$router.push({name:'SignIn'}) 
            }
        },
        updateClientUrl(){
            const obj={
                displayName:window.location.origin
            }
            this.$store.dispatch('settings/updateClientUrl',obj)
        }
    },
    watch: {
        isXs(value) {
            if (!value) {
                if (this.drawer) {
                    this.drawer = false;
                }
            }
        },
    },
    computed:{
        stripePostUrl(){
            return config.hostname+'/create-checkout-session-plan'
        },
        itemsXs(){
            return this.itemsPlan.length>0?this.items:this.itemsPriceLess
        }   
    },
    mounted() {
        this.onResize();
        window.addEventListener("resize", this.onResize, { passive: true });
    },
    created() {
        i18n.locale=(localStorage.getItem('language')==null || localStorage.getItem('language')=='')?'en':localStorage.getItem('language')
        this.$store.dispatch('dashboard/signOut')
        this.logoPath = this.$store.getters["settings/logoPath"] == "" ? this.defaultLogoUrl : config.hostname + this.$store.getters["settings/logoPath"];
        this.siteName = this.$store.getters["settings/siteTitle"] == "" ? "Assess" : this.$store.getters["settings/siteTitle"];
        this.initializePlan()
        this.initializeText()
        this.updateClientUrl()
        //console.log(this.$store.getters["dashboard/switchToRegister"])
    },
}
</script>
<style scoped>
    .header{
        font-size: 45px;
        margin-bottom: 20px;
    }
    .headerFeature{
        white-space:pre-wrap;
        word-break:break-word;
    }
    .homeMargin{
        margin-bottom: 150px;
    }
    .bodyText{
        font-size: 14px;
        font-weight: 300;
        margin-bottom: 35px;
    }
    .cardBorder{
        border-color: black;
        border-radius: 1px;
    }
</style>