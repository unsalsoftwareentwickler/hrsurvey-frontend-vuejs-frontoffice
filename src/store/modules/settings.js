import axios from 'axios'
import config from '../../../public/config'

const state={
    faqs:[],
    confirmation:{},
    allSettings:{},
    adminSettings:{},
    appBarColor:'#363636',
    footerColor:'#FFFFFF',
    bgColor:'#F9F9F9',
    headerColor:'#F5F5F5',
    siteTitle:'Assess Hour',
    description:'',
    footerText:'© 2022 Copyright AssessHour',
    defaultEmail: '',
    logoPath:'',
    faviconPath:'',
    allowWelcomeEmail:true,
    allowFaq:true,
    endExam:false,
    logoOnExamPage:true,
    paidRegistration:true,
    refreshCount:0,
    currency:'',
    currencySymbol:'',
    stripeSecretKey:'',
    appVersion:1
};

const getters={
    faqs:state=>state.faqs,
    confirmation:state=>state.confirmation,
    allSettings:state=>state.allSettings,
    adminSettings:state=>state.adminSettings,
    appBarColor:state=>state.appBarColor,
    footerColor:state=>state.footerColor,
    bgColor:state=>state.bgColor,
    headerColor:state=>state.headerColor,
    siteTitle:state=>state.siteTitle,
    description:state=>state.description,
    footerText:state=>state.footerText,
    logoPath:state=>state.logoPath,
    faviconPath:state=>state.faviconPath,
    endExam:state=>state.endExam,
    logoOnExamPage:state=>state.logoOnExamPage,
    paidRegistration:state=>state.paidRegistration,
    refreshCount:state=>state.refreshCount,
    currency:state=>state.currency,
    currencySymbol:state=>state.currencySymbol,
    stripeSecretKey:state=>state.stripeSecretKey,
    appVersion:state=>state.appVersion,
};

const actions={
    fetchSiteSettings({commit}) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+'/api/Settings/GetSiteSettings')
            .then((response)=>{
                commit('setSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateSettings',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateGeneralSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateGeneralSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateExamSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateExamSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updatePaymentSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdatePaymentSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateEmailSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateEmailSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateColorSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateColorSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateLandingSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateLandingSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateEmailTextSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateEmailTextSetting',objSettings)
            .then((response)=>{
                commit('editSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchSingleSettings({commit},userId) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+`/api/Settings/GetSiteSettingsByUserId/${userId}`)
            .then((response)=>{
                commit('setAdminSettings',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateStripeSettings({commit},objSettings) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateSettingsAdmin',objSettings)
            .then((response)=>{
                commit('setData',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateClientUrl({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateClientUrl',obj)
            .then((response)=>{
                commit('setData',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    uploadLogo({commit},objFormData) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/UploadLogo',objFormData)
            .then((response)=>{
                commit('logoUpload',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    uploadFavicon({commit},objFormData) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/UploadFavicon',objFormData)
            .then((response)=>{
                commit('faviconUpload',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchfaqs({commit}) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+'/api/Settings/GetFaqList')
            .then((response)=>{
                commit('setFaqs',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    createFaq({commit},objFaq) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/CreateFaq',objFaq)
            .then((response)=>{
                commit('newFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateFaq({commit},objFaq) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateFaq',objFaq)
            .then((response)=>{
                commit('editFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    deleteFaq({commit},id) {
        return new Promise((resolve,reject)=>{
            axios.delete(config.hostname+`/api/Settings/DeleteFaq/${id}`)
            .then((response)=>{
                commit('deleteSingleFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchInstructions({commit},quizId) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+`/api/Settings/GetInstructions/${quizId}`)
            .then((response)=>{
                commit('setFaqs',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    createInstruction({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/CreateInstruction',obj)
            .then((response)=>{
                commit('newFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateInstruction({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdateInstruction',obj)
            .then((response)=>{
                commit('editFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    deleteInstruction({commit},id) {
        return new Promise((resolve,reject)=>{
            axios.delete(config.hostname+`/api/Settings/DeleteInstruction/${id}`)
            .then((response)=>{
                commit('deleteSingleFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchBillingPlans({commit}) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+'/api/Settings/GetPlanList')
            .then((response)=>{
                commit('setBillingPlan',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    createBillingPlans({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/CreatePlan',obj)
            .then((response)=>{
                commit('newBillingPlans',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    updateBillingPlans({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.put(config.hostname+'/api/Settings/UpdatePlan',obj)
            .then((response)=>{
                commit('editBillingPlans',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    deleteBillingPlans({commit},id) {
        return new Promise((resolve,reject)=>{
            axios.delete(config.hostname+`/api/Settings/DeletePlan/${id}`)
            .then((response)=>{
                commit('deleteSingleBillingPlans',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    createRegistrationPayment({commit},obj) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/CreatePayment',obj)
            .then((response)=>{
                commit('newFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    createContacts({commit},objContact) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/CreateContacts',objContact)
            .then((response)=>{
                commit('newFaq',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchContacts({commit}) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+'/api/Settings/GetContacts')
            .then((response)=>{
                commit('setFaqs',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchPayment({commit}) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+'/api/Settings/GetBillingPaymentList')
            .then((response)=>{
                commit('setData',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    fetchQuizPayment({commit},adminId) {
        return new Promise((resolve,reject)=>{
            axios.get(config.hostname+`/api/Settings/GetQuizPaymentsByUserId/${adminId}`)
            .then((response)=>{
                commit('setData',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    passwordEmailSent({commit},objEmail) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/SendPasswordMail',objEmail)
            .then((response)=>{
                commit('receiveEmail',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    welcomeEmailSent({commit},objEmail) {
        return new Promise((resolve,reject)=>{
            axios.post(config.hostname+'/api/Settings/SendWelcomeMail',objEmail)
            .then((response)=>{
                commit('receiveEmail',response.data)
                resolve(response)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    },
    changeAppBarColor({commit},val){
        commit('setAppBarColor',val)
    },
    changeFooterColor({commit},val){
        commit('setFooterColor',val)
    },
    changeBgColor({commit},val){
        commit('setBgColor',val)
    },
    changeHeaderColor({commit},val){
        commit('setHeaderColor',val)
    },
    changeSiteTitle({commit},val){
        commit('setSiteTitle',val)
    },
    changeSiteDescription({commit},val){
        commit('setSiteDescription',val)
    },
    changeFooterText({commit},val){
        commit('setFooterText',val)
    },
    changeRefreshCount({commit}){
        commit('setRefreshCount')      
    },
    resetRefreshCount({commit}){
        commit('resetRefreshCount')
    },
    changeAppVersion({commit},val){
        commit('setAppVersion',val)
    },
};

const mutations ={
    setSettings:(state,allSettings)=>{
        state.allSettings=allSettings
        state.appBarColor=allSettings.appBarColor
        state.headerColor=allSettings.headerColor
        state.footerColor=allSettings.footerColor
        state.bgColor=allSettings.bodyColor
        state.siteTitle=allSettings.siteTitle
        state.description=allSettings.welComeMessage
        state.footerText=allSettings.copyRightText
        state.defaultEmail=allSettings.defaultEmail
        state.logoPath=allSettings.logoPath
        state.allowWelcomeEmail=allSettings.allowWelcomeEmail
        state.allowFaq=allSettings.allowFaq
        state.endExam=allSettings.endExam
        state.logoOnExamPage=allSettings.logoOnExamPage
        state.paidRegistration=allSettings.paidRegistration
        state.currency=allSettings.currency
        state.currencySymbol=allSettings.currencySymbol
        state.stripeSecretKey=allSettings.stripeSecretKey
    },
    editSettings:(state,allSettings)=>{
        state.allSettings=allSettings
    },
    setAdminSettings:(state,data)=>{
        state.adminSettings=data
    },
    setData:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    logoUpload:(state,data)=>{
        state.logoPath=data.dbPath
    },   
    faviconUpload:(state,data)=>{
        state.faviconPath=data.dbPath
    },   
    setFaqs:(state,faqs)=>{
        state.faqs=faqs
    },
    newFaq:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    editFaq:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    deleteSingleFaq:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    setBillingPlan:(state,plans)=>{
        state.faqs=plans
    },
    newBillingPlans:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    editBillingPlans:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    deleteSingleBillingPlans:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    receiveEmail:(state,confirmation)=>{
        state.confirmation=confirmation
    },
    setAppBarColor:(state,val)=>{
        state.appBarColor=val
    },
    setFooterColor:(state,val)=>{
        state.footerColor=val
    },
    setBgColor:(state,val)=>{
        state.bgColor=val
    },
    setHeaderColor:(state,val)=>{
        state.headerColor=val
    },
    setSiteTitle:(state,val)=>{
        state.siteTitle=val
    },
    setSiteDescription:(state,val)=>{
        state.description=val
    },
    setFooterText:(state,val)=>{
        state.footerText=val
    },
    setRefreshCount:(state)=>{
        state.refreshCount+=1
    },
    resetRefreshCount:(state)=>{
        state.refreshCount=0
    },
    setAppVersion:(state,val)=>{
        state.appVersion=val
    },
};

export default{
    namespaced:true,
    state,
    getters,
    actions,
    mutations
}