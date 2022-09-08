import {reactive} from 'vue'
import {useStorage} from '@vueuse/core'

export const storeData = reactive({
    user: useStorage('user', {}),
    updateUser: (data) => {
        storeData.user = data
    },
    draft: useStorage('draft', {
        
    }),
    updateDraft:(data)=>{
        storeData.draft=data
    }

})