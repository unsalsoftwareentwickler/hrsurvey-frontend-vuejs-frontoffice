import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '../views/signin/Landing.vue'
import SignIn from '../views/signin/SignIn.vue'
import Unauthorized from '../views/error/Unauthorized.vue'
import Forbidden from '../views/error/Forbidden.vue'
import NotFound from '../views/error/NotFound.vue'
import NoInternet from '../views/error/NoInternet.vue'
import Dashboard from '../views/dashboard/DashBoard.vue'
import Users from '../views/user/users.vue'
import Menus from '../views/menu/menus.vue'
import Roles from '../views/user/roles.vue'
import Profile from '../views/user/profile.vue'
import Password from '../views/user/password.vue'
import AppSettings from '../views/settings/appSettings.vue'
import BrowseList from '../views/user/browseList.vue'
import Faq from '../views/settings/faq.vue'
import Instruction from '../views/quiz/instructions.vue'
import Contacts from '../views/settings/contacts.vue'
import Payments from '../views/settings/payments.vue'
import Plan from '../views/settings/plans.vue'
import Category from '../views/question/category.vue'
import QuizTopics from '../views/quiz/quizTopics.vue'
import StartQuiz from '../views/quiz/startQuiz.vue'
import QuizResult from '../views/quiz/quizResult.vue'
import QuizQuestions from '../views/question/quizQuestions.vue'
import Quizes from '../views/question/quizes.vue'
import Admin from '../views/report/admin.vue'
import Students from '../views/report/students.vue'
import Certificates from '../views/report/certificates.vue'
import Template from '../views/report/template.vue'
import Analytics from '../views/report/analysis.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store/index'
import goTo from 'vuetify/lib/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'Landing',
    component:Landing,
    meta:{title: 'Landing | '+store.getters['settings/siteTitle']}
  },
  {
    path:'/signIn',
    name:'SignIn',
    component:SignIn,
    meta:{title: 'Sign In | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta:{title: 'Token Expired | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: Forbidden,
    meta:{title: 'No Access | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/notFound',
    name: 'NotFound',
    component: NotFound,
    meta:{title: '404 | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/noInternet',
    name: 'NoInternet',
    component: NoInternet,
    meta:{title: 'No Internet | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta:{title: 'Dashboard | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/menu/menus',
    name: 'Menus',
    component: Menus,
    meta:{title: 'Menus | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/user/roles',
    name: 'Roles',
    component: Roles,
    meta:{title: 'Roles | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/user/users',
    name: 'Users',
    component: Users,
    meta:{title: 'Users | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/user/profile',
    name: 'Profile',
    component: Profile,
    meta:{title: 'Profile | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/user/password',
    name: 'Password',
    component: Password,
    meta:{title: 'Change Password | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/settings/appSettings',
    name: 'AppSettings',
    component: AppSettings,
    meta:{title: 'Settings | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/user/browseList',
    name: 'BrowseList',
    component: BrowseList,
    meta:{title: 'Browse History | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/settings/faq',
    name: 'Faq',
    component: Faq,
    meta:{title: 'FAQ | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/quiz/instruction',
    name: 'Instruction',
    component: Instruction,
    meta:{title: 'Instruction | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/settings/contacts',
    name: 'Contacts',
    component: Contacts,
    meta:{title: 'Contacts | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/settings/payments',
    name: 'Payments',
    component: Payments,
    meta:{title: 'Payments | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/settings/plans',
    name: 'Plan',
    component: Plan,
    meta:{title: 'Plan | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/question/category',
    name: 'Category',
    component: Category,
    meta:{title: 'Question Category | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/quiz/topics',
    name: 'QuizTopics',
    component: QuizTopics,
    meta:{title: 'Manage Assessments | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/quiz/startQuiz',
    name: 'StartQuiz',
    component: StartQuiz,
    meta:{title: 'Start Assessment | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/quiz/result',
    name: 'QuizResult',
    component: QuizResult,
    meta:{title: 'Assessment Result | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/question/quizes',
    name: 'Quizes',
    component: Quizes,
    meta:{title: 'All Assessments | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/question/quizQuestions',
    name: 'QuizQuestions',
    component: QuizQuestions,
    meta:{title: 'Questions | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/report/admin',
    name: 'Admin',
    component: Admin,
    meta:{title: 'Examine & Reports | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/report/students',
    name: 'Students',
    component: Students,
    meta:{title: 'Reports | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/report/certificates',
    name: 'Certificates',
    component: Certificates,
    meta:{title: 'Certificates | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/report/template',
    name: 'Template',
    component: Template,
    meta:{title: 'Certificate Template | '+store.getters['settings/siteTitle']}
  },
  {
    path: '/report/analysis',
    name: 'Analytics',
    component: Analytics,
    meta:{title: 'Analytics | '+store.getters['settings/siteTitle']}
  },
]

const DEFAULT_TITLE = store.getters['settings/siteTitle'];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if(store.getters['dashboard/switchToRegister']==true && from.name=='SignIn' && to.name=='Landing'){
      return goTo('#contact')
    }
    else if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  NProgress.inc(0.1)
  //console.log(from.name+'-'+to.name)

  if(to.name==null){
    next({name:'NotFound'})
  }
  else{
    next()
  }
})
router.afterEach((to) => {
  Vue.nextTick(() => {
      document.title = to.meta.title || DEFAULT_TITLE;
  });
  setTimeout(() => NProgress.done(), 500)
})

export default router
