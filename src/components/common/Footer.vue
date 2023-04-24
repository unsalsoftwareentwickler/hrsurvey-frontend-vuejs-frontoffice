<template>
    <div>
        <PlanRenew/>
        <VersionMsg/>
        <v-footer padless light :color="getFooterColor">
            <v-col class="text-right font-weight-regular">
                {{footerText}}
            </v-col>
        </v-footer>
    </div>
</template>

<script>
import VersionMsg from './VersionMsg'
import PlanRenew from './PlanRenew.vue'
export default {
    name:'Footer',
    components:{
        VersionMsg,
        PlanRenew
    },
    computed:{
        getFooterColor:function(){
            return this.$store.getters['settings/footerColor']
        },
        footerText:function(){
            return this.$store.getters['settings/footerText']
        }
    }
}
</script>