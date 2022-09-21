<template>
    <Toast />
    <Dialog header="Scheduler" v-model:visible="schedule">
        <ScheduleForm @close="closedialog"></ScheduleForm>
    </Dialog>
    <div class="card">
        <div class="title">
            Name Of Output Table
        </div>
        <div class="field">
            <div class="grid">
                <div class="col-7">
                    <InputText id="tablename" type="text" v-model="newTableName" class="aligning" placeholder="Output Table Name"/>  
                </div>
                <div class="col-2">
                    <Button label="Template" icon="pi pi-save" iconPos="right" class="button" @click="savedraft"/> 
                </div>
                <div class="col-2">
                    <Button label="Schedule" icon="pi pi-clock" iconPos="right" class="button" @click="openschedule"/> 
                </div>
                   
            </div>
            
        </div>

    </div>
    
</template>

<script>
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { storeData } from "../store/data";
import axios from "../plugins/axios.js";
import isVarName from 'is-var-name';
import Dialog from 'primevue/dialog';
import ScheduleForm from './ScheduleForm.vue';
import Toast from 'primevue/toast';
export default {
    name: "TableName",
    components: {
    InputText,
    Card,
    Button,
    Dialog,
    ScheduleForm,
    Toast
},
    props:['submitted','filterCriteria','selectedColumn','isdraft'],
    emits:['outputTableName'],
    data() {
        return {
            newTableName:"",
            error:true,
            user_id:storeData.user.user_id,
            permission_id:storeData.user.permission_id,
            draft:null,
            schedule:false
        };
    },
    methods:{
        closedialog(value){
            this.schedule=value
        },
        openschedule(){
            this.schedule=true
        },
        validateInput(value){
            if (value ==="" && this.submitted===true){
                this.error=true
                this.message="Empty Name of Output Table. Please enter the name of Output"
            }
            else if((isVarName(value)===false || value.length>23)){
                this.error=true
                this.message="Invalid Name of Output Table. The name should not begin with number, shound not contain space, and must less than 23 characters."
            }
            else if ((isVarName(value)===true && value.length<23)){
                this.error=false
            }
        },
        savedraft(){
            axios({
                    method: "post",
                    url:
                        process.env.VUE_APP_BASE_URL +
                        "/draftlog/save/"+this.user_id,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: 
                    {filter:this.filterCriteria,
                    column:this.selectedColumn,
                    tableName:this.newTableName,
                    }
            })
              .then((response) => {
                  console.log(response)
                  this.$toast.add({severity:'success', summary: 'Template Saved', detail:'Please check the Template tab in the menu.', life: 3000});
              })
              .catch(function (error) {
                console.log(error);
                
            });

        }
    },
    watch:{
        newTableName: function (val) {
            this.validateInput(val)
            this.$emit('outputTableName',{newTableName:val, error:this.error, message:this.message})
            
        }, 
        // watch if the isdraft change value means the draft is load so change the value according to the value store in storedata
        isdraft: function(){
            this.newTableName=storeData.draft.tableName
        }  
    }
}
</script>

<style scoped>
.aligning{
    width:100%;
}
.title{
    padding-block-end: 5px;
    font-size: larger;
}
.field{
    width: 100%;
}
.card{
    padding-block-start: 5px;
    padding-inline-start: 20px;
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    background-color: #173542;
    border-radius: 20px;
    color: white;
    height: 8vh;
    /* width:92%; */
    
}
@media only screen and (max-width: 1600px) {
    .aligning{
        height:75%;
    }
    .button{
        height:75%;
    }
}
</style>
