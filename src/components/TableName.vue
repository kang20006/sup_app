<template>
    <div class="card">
        <div class="title">
            Name Of Output Table
        </div>
        <div>
            <div class="grid">
                <div class="col-10">
                    <InputText id="tablename" type="text" v-model="newTableName" class="aligning" placeholder="Output Table Name"/>  
                </div>
                <div class="col-2">
                    <Button label="Template" icon="pi pi-save" iconPos="right" class="button" @click="savedraft"/> 
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
export default {
    name: "TableName",
    components: {
        InputText,
        Card,
        Button
    },
    props:['submitted','filterCriteria','selectedColumn','isdraft'],
    emits:['outputTableName'],
    data() {
        return {
            newTableName:"",
            error:true,
            user_id:storeData.user.user_id,
            permission_id:storeData.user.permission_id,
            draft:null
           
        };
    },
    methods:{
        validateInput(value){
            if (value ==="" && this.submitted===true){
                this.error=true
            }
            else{
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
              })
              .catch(function (error) {
                console.log(error);
                
            });

        }
    },
    watch:{
        newTableName: function (val) {
            this.validateInput(val)
            this.$emit('outputTableName',{newTableName:val, error:this.error})
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
