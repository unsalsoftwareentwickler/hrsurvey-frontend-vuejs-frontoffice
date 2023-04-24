<template>
    <v-container>
        <Message/>
        <v-expansion-panels popout focusable>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('generalSettings')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formGeneral">
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('siteTitle')" v-model="title" :rules="[rules.required]" v-on:keyup="setTitle"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('welcomeMessage')" v-model="description" :rules="[rules.required]" v-on:keyup="setDescription"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('copyrightText')" v-model="footerText" :rules="[rules.required]" v-on:keyup="setFooterText"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>                              
                            <v-col cols="12" sm="2">
                                <v-checkbox :label="$t('allowWelcomeEmail')" v-model="allowEmail"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-checkbox :label="$t('allowFAQ')" v-model="allowFaq"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-file-input :label="$t('siteLogo')" accept="image/*" prepend-icon="mdi-camera" @change="onLogoSelected" show-size></v-file-input>                    
                            </v-col>
                            <v-col cols="12" sm="4">                   
                                <v-img :src="previewLogo" max-height="100" max-width="150" contain></v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('appVersion')" type="number" v-model="appVersion" :rules="numberRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-file-input :label="$t('siteFavicon')" accept="image/*" prepend-icon="mdi-camera" @change="onFaviconSelected" show-size></v-file-input>                    
                            </v-col>
                            <v-col cols="12" sm="4">                   
                                <v-img :src="previewFavicon" max-height="100" max-width="150" contain></v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveGeneral">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('examSettings')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formExam">
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-checkbox :label="$t('browserrefreshendtheexam')" v-model="endExam"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-checkbox :label="$t('sitelogoonexampage')" v-model="examPageLogo"></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveExam">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('paymentSettings')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="12" sm="4"><h4>{{$t('stripe')}}</h4></v-col>
                    </v-row>
                    <v-form ref="formPayment">
                        <v-row>
                            <v-col cols="12" sm="2">
                                <v-text-field :label="$t('currency')" v-model="currency" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field :label="$t('currencySymbol')" v-model="currencySymbol" readonly></v-text-field>
                            </v-col>  
                            <v-col cols="12" sm="8">
                                <v-text-field :label="$t('stripeSecretkey')" v-model="stripeSecretKey"></v-text-field>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="savePayment">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('emailSettings')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formEmail">
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('email')" v-model="email" :rules="[rules.emailRules]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('password')" v-model="emailPassword" :type="'password'"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field :label="$t('port')" type="number" v-model="emailPort" :rules="numberRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field :label="$t('hostSmtp')"  v-model="emailHost"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveEmail">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('colorSettings')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formColor">
                        <!-- <v-row>
                            <v-col cols="12" sm="4">
                                <v-select
                                    v-model="appBarColorSelect"
                                    :items="colors"
                                    :label="$t('appBar')"
                                    dense
                                    clearable                      
                                    v-on:change="setAppBarColor"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-select
                                    v-model="footerColorSelect"
                                    :items="colors"
                                    :label="$t('footer')"
                                    dense
                                    clearable                     
                                    v-on:change="setFooterColor"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-select
                                    v-model="bodyColorSelect"
                                    :items="bodyColors"
                                    :label="$t('body')"
                                    dense
                                    clearable                     
                                    v-on:change="setBodyColor"
                                >
                                </v-select>
                            </v-col>
                        </v-row> -->
                        <v-row>
                            <v-col cols="12" sm="3">
                                <v-color-picker
                                v-model="appBarPicker"                              
                                dot-size="25"
                                mode="hexa"
                                swatches-max-height="200"
                                hide-mode-switch                              
                                ></v-color-picker>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-color-picker
                                v-model="headerPicker"                               
                                dot-size="25"
                                mode="hexa"
                                swatches-max-height="200"
                                hide-mode-switch
                                ></v-color-picker>
                            </v-col> 
                            <v-col cols="12" sm="3">
                                <v-color-picker
                                v-model="bodyPicker"                               
                                dot-size="25"
                                mode="hexa"
                                swatches-max-height="200"
                                hide-mode-switch
                                ></v-color-picker>
                            </v-col> 
                            <v-col cols="12" sm="3">
                                <v-color-picker
                                v-model="footerPicker"                               
                                dot-size="25"
                                mode="hexa"
                                swatches-max-height="200"
                                hide-mode-switch
                                ></v-color-picker>
                            </v-col>                                                
                        </v-row>
                        <v-row v-show="false">
                            <v-col cols="12" sm="3">
                                <span>{{ colorAppBar }}</span>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <span>{{colorHeader}}</span>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <span>{{colorBody}}</span>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <span>{{colorFooter}}</span>
                            </v-col>
                                                      
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveColor">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>    
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('landingPage')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formLanding">
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeHeaderTop')" v-model="homeHeader1" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeDetailTop')" v-model="homeDetail1" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeHeaderBottom')" v-model="homeHeader2" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeDetailBottom')" v-model="homeDetail2" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeBox1Header')" v-model="homeBox1Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeBox1Detail')" v-model="homeBox1Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeBox2Header')" v-model="homeBox2Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeBox2Detail')" v-model="homeBox2Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeBox3Header')" v-model="homeBox3Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeBox3Detail')" v-model="homeBox3Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('homeBox4Header')" v-model="homeBox4Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('homeBox4Detail')" v-model="homeBox4Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('feature1Header')" v-model="feature1Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('feature1Detail')" v-model="feature1Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('feature2Header')" v-model="feature2Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('feature2Detail')" v-model="feature2Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('feature3Header')" v-model="feature3Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('feature3Detail')" v-model="feature3Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('feature4Header')" v-model="feature4Header" :rules="[rules.required]"></v-text-field>
                            </v-col> 
                            <v-col cols="12" sm="8">
                                <v-textarea :label="$t('feature4Detail')" v-model="feature4Detail" :rules="[rules.required]"></v-textarea>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea :label="$t('registrationText')" v-model="registrationText" :rules="[rules.required]"></v-textarea>
                            </v-col>             
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-textarea :label="$t('conactusText')" v-model="contactUsText" :rules="[rules.required]"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('conactusTelephone')" v-model="contactUsTelephone" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('conactusEmail')" v-model="contactUsEmail" :rules="[rules.required]"></v-text-field>
                            </v-col>             
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea :label="$t('landingFooterText')" v-model="footerTextLanding" :rules="[rules.required]"></v-textarea>
                            </v-col>             
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <v-text-field :label="$t('footerFacebook')" v-model="footerFacebook"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field :label="$t('footerTwitter')" v-model="footerTwitter"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field :label="$t('footerLinkedIn')" v-model="footerLinkedin"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field :label="$t('footerInstagram')" v-model="footerInstagram"></v-text-field>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveLanding">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{$t('emailText')}}</b>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="formEmailText">
                        <v-row>
                            <v-col cols="12" sm="4"><h4>{{$t('forgetPasswordEmail')}}</h4></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('subject')" v-model="forgetPasswordEmailSubject" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('header')" v-model="forgetPasswordEmailHeader" :rules="[rules.required]"></v-text-field>
                            </v-col>  
                            <v-col cols="12" sm="4">
                                <v-textarea :label="$t('body')" v-model="forgetPasswordEmailBody" :rules="[rules.required]" hint="[siteTitle]=Name of this site, [password]=User Password"></v-textarea>
                            </v-col>           
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4"><h4>{{$t('welcomeEmail')}}</h4></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('subject')" v-model="welcomeEmailSubject" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('header')" v-model="welcomeEmailHeader" :rules="[rules.required]"></v-text-field>
                            </v-col>  
                            <v-col cols="12" sm="4">
                                <v-textarea :label="$t('body')" v-model="welcomeEmailBody" :rules="[rules.required]" hint="[siteTitle]=Name of this site, [password]=User Password, [email]=User Email"></v-textarea>
                            </v-col>           
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4"><h4>{{$t('invitationEmail')}}</h4></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('subject')" v-model="invitationEmailSubject" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('header')" v-model="invitationEmailHeader" :rules="[rules.required]"></v-text-field>
                            </v-col>  
                            <v-col cols="12" sm="4">
                                <v-textarea :label="$t('body')" v-model="invitationEmailBody" :rules="[rules.required]" hint="[siteTitle]=Name of this site"></v-textarea>
                            </v-col>           
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4"><h4>{{$t('reportEmail')}}</h4></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('subject')" v-model="reportEmailSubject" :rules="[rules.required]" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field :label="$t('header')" v-model="reportEmailHeader" :rules="[rules.required]"></v-text-field>
                            </v-col>  
                            <v-col cols="12" sm="4">
                                <v-textarea :label="$t('body')" v-model="reportEmailBody" :rules="[rules.required]" readonly></v-textarea>
                            </v-col>           
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="primary" @click="saveEmailText">{{$t('save')}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
import Message from '../../components/common/Message'
import config from '../../../public/config'

export default {
    name:'AppSettings',
    components:{
        Message
    },
    data(){
        return{
            rules:{
                required:value=>!!value||this.$t('required'),
                emailRules:v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('emailInvalid'),            
            },
            numberRules: [
                v => String(v).length > 0 || this.$t('thisFieldMaynotbeEmpty'),
                v => Number.isInteger(Number(v)) || this.$t('theValueMustbeanIntegerNumber'),
                v => v > 0 || this.$t('theValueMustBeGreaterThanZero')
            ],
            colors:['blue-grey darken-1','blue-grey darken-2','blue-grey darken-3','blue-grey darken-4','grey darken-3'],
            bodyColors:['grey lighten-1','grey lighten-2','grey lighten-3','grey lighten-4','grey lighten-5'],
            appBarColorSelect:null,
            footerColorSelect:null,
            bodyColorSelect:null,
            title:'',
            description:'',
            footerText:'',
            appVersion:1,
            endExam:false,
            examPageLogo:false,
            paidRegistration:false,
            email:'',
            emailPassword:'',
            emailPort:'',
            emailHost:'',
            currency:'',
            currencySymbol:'',
            registrationPrice:0,
            stripePubKey:'',
            stripeSecretKey:'',
            allowEmail:null,
            allowFaq:null,
            previewLogo:null,
            selectedLogoFile:null,
            logoPath:'',
            previewFavicon:null,
            selectedFaviconFile:null,
            faviconPath:'',
            homeHeader1:'',
            homeDetail1:'',
            homeHeader2:'',
            homeDetail2:'',
            homeBox1Header:'',
            homeBox1Detail:'',
            homeBox2Header:'',
            homeBox2Detail:'',
            homeBox3Header:'',
            homeBox3Detail:'',
            homeBox4Header:'',
            homeBox4Detail:'',
            feature1Header:'',
            feature1Detail:'',
            feature2Header:'',
            feature2Detail:'',
            feature3Header:'',
            feature3Detail:'',
            feature4Header:'',
            feature4Detail:'',
            registrationText:'',
            contactUsText:'',
            contactUsTelephone:'',
            contactUsEmail:'',
            footerTextLanding:'',
            footerFacebook:'',
            footerTwitter:'',
            footerLinkedin:'',
            footerInstagram:'',
            forgetPasswordEmailSubject:'',
            forgetPasswordEmailHeader:'',
            forgetPasswordEmailBody:'',
            welcomeEmailSubject:'',
            welcomeEmailHeader:'',
            welcomeEmailBody:'',
            invitationEmailSubject:'',
            invitationEmailHeader:'',
            invitationEmailBody:'',
            reportEmailSubject:'',
            reportEmailHeader:'',
            reportEmailBody:'',
            settings:{},
            appBarPicker:'',
            footerPicker:'',
            bodyPicker:'',
            headerPicker:''
        }
    },
    methods:{
        onLogoSelected(e){           
            if(e!=null){
                this.selectedLogoFile=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedLogoFile)
                reader.onload=e=>{
                    this.previewLogo=e.target.result
                }

                let fd=new FormData()
                fd.append('image',this.selectedLogoFile)
                this.$store.dispatch('settings/uploadLogo',fd)
                .then(response=>{
                    //console.log(response)
                    if(response.status==200){ 
                        this.logoPath='/'+response.data.dbPath                                                                      
                    }
                })
            }else{               
                this.selectedLogoFile=null
                this.previewLogo=null
                this.logoPath=''
            }                      
        },
        onFaviconSelected(e){           
            if(e!=null){
                this.selectedFaviconFile=e
                const reader=new FileReader()
                reader.readAsDataURL(this.selectedFaviconFile)
                reader.onload=e=>{
                    this.previewFavicon=e.target.result
                }

                let fd=new FormData()
                fd.append('image',this.selectedFaviconFile)
                this.$store.dispatch('settings/uploadFavicon',fd)
                .then(response=>{
                    //console.log(response)
                    if(response.status==200){ 
                        this.faviconPath='/'+response.data.dbPath                                                                      
                    }
                })
            }else{               
                this.selectedFaviconFile=null
                this.previewFavicon=null
                this.faviconPath=''
            }                      
        },
        /* setAppBarColor(val){
            this.$store.dispatch('settings/changeAppBarColor',val) 
        },
        setFooterColor(val){
            this.$store.dispatch('settings/changeFooterColor',val) 
        },
        setBodyColor(val){          
            if(val==null){
                val='grey lighten-3'
            }
            this.$store.dispatch('settings/changeBgColor',val) 
        }, */
        setTitle(){            
            this.$store.dispatch('settings/changeSiteTitle',this.title) 
        },
        setDescription(){            
            this.$store.dispatch('settings/changeSiteDescription',this.description) 
        },
        setFooterText(){            
            this.$store.dispatch('settings/changeFooterText',this.footerText) 
        },
        initialize(){
            this.$store.dispatch('dashboard/applyLoading')       
            this.$store.dispatch('settings/fetchSiteSettings')
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading')
                this.settings=response.data
                this.title=this.settings.siteTitle
                this.description=this.settings.welComeMessage
                this.footerText=this.settings.copyRightText
                this.appVersion=this.settings.version
                this.endExam=this.settings.endExam
                this.examPageLogo=this.settings.logoOnExamPage
                this.paidRegistration=this.settings.paidRegistration
                this.registrationPrice=this.settings.registrationPrice
                this.currency=this.settings.currency
                this.currencySymbol=this.settings.currencySymbol
                this.stripePubKey=this.settings.stripePubKey
                this.stripeSecretKey=this.settings.stripeSecretKey
                this.email=this.settings.defaultEmail
                this.emailPassword=this.settings.password
                this.emailPort=this.settings.port
                this.emailHost=this.settings.host
                this.allowEmail=this.settings.allowWelcomeEmail
                this.allowFaq=this.settings.allowFaq
                this.previewLogo=this.settings.logoPath!=''?config.hostname+this.settings.logoPath:''
                this.logoPath=this.settings.logoPath!=''?this.settings.logoPath:''
                this.previewFavicon=this.settings.faviconPath!=''?config.hostname+this.settings.faviconPath:''
                this.faviconPath=this.settings.faviconPath!=''?this.settings.faviconPath:''
                //this.appBarColorSelect=this.settings.appBarColor
                //this.footerColorSelect=this.settings.footerColor
                //this.bodyColorSelect=this.settings.bodyColor
                this.appBarPicker=this.settings.appBarColor
                this.footerPicker=this.settings.footerColor
                this.bodyPicker=this.settings.bodyColor
                this.headerPicker=this.settings.headerColor
                this.homeHeader1=this.settings.homeHeader1
                this.homeDetail1=this.settings.homeDetail1
                this.homeHeader2=this.settings.homeHeader2
                this.homeDetail2=this.settings.homeDetail2
                this.homeBox1Header=this.settings.homeBox1Header
                this.homeBox1Detail=this.settings.homeBox1Detail
                this.homeBox2Header=this.settings.homeBox2Header
                this.homeBox2Detail=this.settings.homeBox2Detail
                this.homeBox3Header=this.settings.homeBox3Header
                this.homeBox3Detail=this.settings.homeBox3Detail
                this.homeBox4Header=this.settings.homeBox4Header
                this.homeBox4Detail=this.settings.homeBox4Detail
                this.feature1Header=this.settings.feature1Header
                this.feature1Detail=this.settings.feature1Detail
                this.feature2Header=this.settings.feature2Header
                this.feature2Detail=this.settings.feature2Detail
                this.feature3Header=this.settings.feature3Header
                this.feature3Detail=this.settings.feature3Detail
                this.feature4Header=this.settings.feature4Header
                this.feature4Detail=this.settings.feature4Detail
                this.registrationText=this.settings.registrationText
                this.contactUsText=this.settings.contactUsText
                this.contactUsTelephone=this.settings.contactUsTelephone
                this.contactUsEmail=this.settings.contactUsEmail
                this.footerTextLanding=this.settings.footerText
                this.footerFacebook=this.settings.footerFacebook
                this.footerTwitter=this.settings.footerTwitter
                this.footerLinkedin=this.settings.footerLinkedin
                this.footerInstagram=this.settings.footerInstagram
                this.forgetPasswordEmailSubject=this.settings.forgetPasswordEmailSubject
                this.forgetPasswordEmailHeader=this.settings.forgetPasswordEmailHeader
                this.forgetPasswordEmailBody=this.settings.forgetPasswordEmailBody
                this.welcomeEmailSubject=this.settings.welcomeEmailSubject
                this.welcomeEmailHeader=this.settings.welcomeEmailHeader
                this.welcomeEmailBody=this.settings.welcomeEmailBody
                this.invitationEmailSubject=this.settings.invitationEmailSubject
                this.invitationEmailHeader=this.settings.invitationEmailHeader
                this.invitationEmailBody=this.settings.invitationEmailBody
                this.reportEmailSubject=this.settings.reportEmailSubject
                this.reportEmailHeader=this.settings.reportEmailHeader
                this.reportEmailBody=this.settings.reportEmailBody
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        /* updateSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                siteTitle:this.title,
                welComeMessage:this.description,
                copyRightText:this.footerText,
                version:this.appVersion,
                endExam:this.endExam,
                logoOnExamPage:this.examPageLogo,
                paidRegistration:this.paidRegistration,
                registrationPrice:this.registrationPrice==''?0:this.registrationPrice,
                currency:this.currency,
                currencySymbol:this.currencySymbol,
                stripePubKey:this.stripePubKey,
                stripeSecretKey:this.stripeSecretKey,
                defaultEmail:this.email,
                password:this.emailPassword,
                host:this.emailHost,
                port:this.emailPort==''?0:this.emailPort,
                logoPath:this.logoPath,
                faviconPath:this.faviconPath,
                appBarColor:this.appBarColorSelect,
                footerColor:this.footerColorSelect,
                bodyColor:this.bodyColorSelect,
                allowWelcomeEmail:this.allowEmail,
                allowFaq:this.allowFaq,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent','Successfully updated')
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',response.data.responseMsg)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }, */
        updateGeneralSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                siteTitle:this.title,
                welComeMessage:this.description,
                copyRightText:this.footerText,
                version:this.appVersion,
                logoPath:this.logoPath,
                faviconPath:this.faviconPath,
                allowWelcomeEmail:this.allowEmail,
                allowFaq:this.allowFaq,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateGeneralSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',response.data.responseMsg)
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateExamSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                endExam:this.endExam,
                logoOnExamPage:this.examPageLogo,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateExamSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updatePaymentSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                paidRegistration:this.paidRegistration,
                registrationPrice:this.registrationPrice==''?0:this.registrationPrice,
                currency:this.currency,
                currencySymbol:this.currencySymbol,
                stripePubKey:this.stripePubKey,
                stripeSecretKey:this.stripeSecretKey,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updatePaymentSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateEmailSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                defaultEmail:this.email,
                password:this.emailPassword,
                host:this.emailHost,
                port:this.emailPort==''?0:this.emailPort,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateEmailSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateColorSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                //appBarColor:this.appBarColorSelect,
                //footerColor:this.footerColorSelect,
                //bodyColor:this.bodyColorSelect,
                appBarColor:this.appBarPicker,
                footerColor:this.footerPicker,
                bodyColor:this.bodyPicker,
                headerColor:this.headerPicker,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateColorSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateLandingSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                homeHeader1:this.homeHeader1,
                homeDetail1:this.homeDetail1,
                homeHeader2:this.homeHeader2,
                homeDetail2:this.homeDetail2,
                homeBox1Header:this.homeBox1Header,
                homeBox1Detail:this.homeBox1Detail,
                homeBox2Header:this.homeBox2Header,
                homeBox2Detail:this.homeBox2Detail,
                homeBox3Header:this.homeBox3Header,
                homeBox3Detail:this.homeBox3Detail,
                homeBox4Header:this.homeBox4Header,
                homeBox4Detail:this.homeBox4Detail,
                feature1Header:this.feature1Header,
                feature1Detail:this.feature1Detail,
                feature2Header:this.feature2Header,
                feature2Detail:this.feature2Detail,
                feature3Header:this.feature3Header,
                feature3Detail:this.feature3Detail,
                feature4Header:this.feature4Header,
                feature4Detail:this.feature4Detail,
                registrationText:this.registrationText,
                contactUsText:this.contactUsText,
                contactUsTelephone:this.contactUsTelephone,
                contactUsEmail:this.contactUsEmail,
                footerText:this.footerTextLanding,
                footerFacebook:this.footerFacebook,
                footerTwitter:this.footerTwitter,
                footerLinkedin:this.footerLinkedin,
                footerInstagram:this.footerInstagram,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateLandingSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        updateEmailTextSettings(){
            this.$store.dispatch('dashboard/applyLoading') 
            const objSettings={
                siteSettingsId:this.settings.siteSettingsId,
                forgetPasswordEmailSubject:this.forgetPasswordEmailSubject,
                forgetPasswordEmailHeader:this.forgetPasswordEmailHeader,
                forgetPasswordEmailBody:this.forgetPasswordEmailBody,
                welcomeEmailSubject:this.welcomeEmailSubject,
                welcomeEmailHeader:this.welcomeEmailHeader,
                welcomeEmailBody:this.welcomeEmailBody,
                invitationEmailSubject:this.invitationEmailSubject,
                invitationEmailHeader:this.invitationEmailHeader,
                invitationEmailBody:this.invitationEmailBody,
                reportEmailSubject:this.reportEmailSubject,
                reportEmailHeader:this.reportEmailHeader,
                reportEmailBody:this.reportEmailBody,
                lastUpdatedBy:parseInt(localStorage.getItem('loggedUserId')),
            }
            this.$store.dispatch('settings/updateEmailTextSettings',objSettings)
            .then(response=>{
                this.$store.dispatch('dashboard/cancelLoading') 
                if(response.status==200){
                    this.$root.$emit('message_from_parent',this.$t('successfullyUpdated'))
                }else if(response.status==202){
                    this.$root.$emit('message_from_parent_long',this.$t(response.data.responseMsg))
                }
            })
            .catch(err=>{
                this.$router.push({name:'NoInternet'})
                console.log(err)
            })
        },
        saveGeneral(){
            if(this.$refs.formGeneral.validate()){
                this.updateGeneralSettings()              
            }
        },
        saveExam(){
            if(this.$refs.formExam.validate()){
                this.updateExamSettings()              
            }
        },
        savePayment(){
            if(this.$refs.formPayment.validate()){
                this.updatePaymentSettings()              
            }
        },
        saveEmail(){
            if(this.$refs.formEmail.validate()){
                this.updateEmailSettings()              
            }
        },
        saveColor(){
            if(this.$refs.formColor.validate()){
                this.updateColorSettings()              
            }
        },
        saveLanding(){
            if(this.$refs.formLanding.validate()){
                this.updateLandingSettings()              
            }
        },
        saveEmailText(){
            if(this.$refs.formEmailText.validate()){
                this.updateEmailTextSettings()              
            }
        },
    },
    computed:{
        colorAppBar(){
            return this.$store.dispatch('settings/changeAppBarColor',this.appBarPicker)
        },
        colorFooter(){
            return this.$store.dispatch('settings/changeFooterColor',this.footerPicker)
        },
        colorBody(){
            return this.$store.dispatch('settings/changeBgColor',this.bodyPicker)
        },
        colorHeader(){
            return this.$store.dispatch('settings/changeHeaderColor',this.headerPicker)
        }
    },
    created(){
        this.initialize()
    }
}
</script>