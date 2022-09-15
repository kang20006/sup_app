import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import VueClipboard from 'vue-clipboard2'
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import router from './router'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {faPersonRunning,faCopy,faCode,faTriangleExclamation,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import Tooltip from 'primevue/tooltip';


/* add icons to the library */
library.add(faPersonRunning,faCopy,faCode,faTriangleExclamation,faMagnifyingGlass)

createApp(App).use(router).use(PrimeVue).use(VueClipboard).use(router).use(VueLoading).component('font-awesome-icon', FontAwesomeIcon).directive('tooltip', Tooltip).mount('#app')
