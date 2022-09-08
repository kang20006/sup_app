<template>
    <div class="card">
    <div class="title">Filter Field</div>
    <ScrollPanel style="width: 100%; height: 30vh">
        <Accordion>
            <AccordionTab v-for="(tab, index) in selectedFullData" :key="index">
                <template #header>
                    <div class="header">
                        <span>{{tab.display}}</span>
                        <i class="pi pi-times" @click="deleteFilter(tab.name)"></i>
                    </div>
                </template>
                <div v-if="tab.type === 'multi-select'">
                    <MultiSelect v-model="filterData[tab.name]" :filter="true" :options="tab.criteria2" optionLabel="label" placeholder="Select Specific Criteria" display="chip" class="multiselect"/>
                </div>
                <div v-else-if="tab.type === 'date'">
                    <div class="grid">
                        <div class="field col-6">
                            <label for="startDate">Start Date</label>
                            <Calendar id="startDate" v-model="filterData[tab.name][0]"  :showIcon="true" dateFormat="ddMyy" @change="updateValue(index,)"/>
                        </div>
                        <div class="field col-6">
                            <label for="endDate">End Date</label>
                            <Calendar id="endDate" v-model="filterData[tab.name][1]" :showIcon="true" dateFormat="ddMyy" @change="updateValue(index,)"/>
                        </div>      
                    </div>

                </div>
                <div v-else-if="tab.type === 'multi-input'">
                        <div class="grid">
                            <div class="input-group col" id="project">
                                <div class="input-item" id="project-name">
                                    <span class="p-float-label">
                                        <InputText id="multiinput" type="text" v-model="inputItem" class="p-inputtext-lg"/>
                                        <label for="multiinput">Search Criteria</label>
                                    </span>
                                    <span>
                                        <Button icon="pi pi-plus" class="p-button-rounded p-button-success" @click.prevent="addNewInput(tab.name)"/>
                                    </span>
                                    
                                </div>
                            </div>
                            <ScrollPanel class="col scroll">
                            <div class="added-projects">
                                <div
                                    class="project-labels"
                                    v-show="filterData[tab.name].length>0"
                                >
                                    <label id="label-name">Input</label>
                                </div>
                                <div
                                    v-for="(item, index2) in filterData[tab.name]"
                                    :key="index2"
                                    class="added-projects-info"
                                >
                                    <div class="added-project-name">{{ item }}</div>
                                    <div class="">
                                    <svg
                                        class="project-delete"
                                        color="hsl(232, 23%, 61%)"
                                        viewBox="0 0 1024 1024"
                                        style="stroke: currentcolor; fill: currentcolor"
                                        @click="deleteInput(tab.name,index2)"
                                    >
                                        <path
                                        d="M837.312 227.584v682.624c0 62.848-50.88 113.792-113.728 113.792h-455.168c-62.81 0-113.728-50.918-113.728-113.728 0-0.023 0-0.045 0-0.068l-0 0.004v-682.624h682.624zM638.272 0l56.832 56.896h199.104v113.792h-796.416v-113.792h199.040l57.024-56.896h284.416z"
                                        ></path>
                                    </svg>
                                    </div>
                                </div>
                            </div>
                            </ScrollPanel>
                        </div>   
                </div>
                <div v-else-if="tab.type === 'range'">
                    <div class="grid">
                        <div class="field col-6">
                            <label for="startNum">Range From</label>
                            <InputNumber id="startNum" v-model="filterData[tab.name][0]" />
                        </div>
                        <div class="field col-6">
                            <label for="endNum">Range To</label>
                            <InputNumber id="endNum" v-model="filterData[tab.name][1]"/>
                        </div>      
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
    </ScrollPanel>
    </div>
</template>

<script>
import ScrollPanel from 'primevue/scrollpanel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import axios from "../plugins/axios.js";
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { throwStatement } from '@babel/types';
import { storeData } from "../store/data";
export default {
    name: "FilterList",
    components:{
        Accordion,
        AccordionTab,
        ScrollPanel,
        MultiSelect,
        Calendar,
        InputText,
        Button,
        InputNumber
    },
    props: ['selectedFilter','isdraft'],
    emits:['output2','outputFilter'],
    data() {
		return {
            newSelectedFilter:[],
            fullData:[],
            selectedFullData:[],
            multi:[],
            startDate:null,
            endDate:null,
            inputs:[],
            inputItem:null,
            startNum:null,
            endNum:null,
            filterData:{},
            user_id:storeData.user.user_id,
            permission_id:storeData.user.permission_id
		}
	},
    watch:{
        'selectedFilter':{
            handler: function (val) {
            this.oldSelectedFilter=this.newSelectedFilter
            // new selected filter the column name is in value
            this.newSelectedFilter=val
            // if deletion happen then remove the filter criteria
            if (this.newSelectedFilter.length < this.oldSelectedFilter.length){
                let intersection = this.oldSelectedFilter.filter(x => this.newSelectedFilter.includes(x));
                for (var i in intersection){
                    this.filterData[intersection[i]]=[]
                }
            }
            this.selectedFullData=[]
            for (var i in val){
                let index = this.fullData.findIndex(e => e.name === val[i]);
                if (index !== -1) {
                    var k= this.fullData[index]
                };
                this.selectedFullData.push(k)
            }},
            deep:true

        },
        'isdraft':
            function(val){
                console.log(this.filterData)
                this.filterData=storeData.draft.selectedFilter
            }
        ,
        'filterData':{
            handler: function () {
                this.$emit('outputFilter',this.filterData)
            },
            deep: true
        }
        
    },
    methods: {
        deleteFilter(val) {
            this.newSelectedFilter=this.newSelectedFilter.filter(
                (item)=>{
                return val !== item
                });
            // let index = this.selectedFullData.findIndex(e => e.name === val);
            // if (index !== -1) {
            //     this.selectedFullData.slice(index)
            // };
            this.filterData[val]=[]
            this.$emit('output2',val);
        },
        addNewInput(name) {
            let newInput =this.inputItem;
            this.filterData[name].push(newInput);
            this.inputItem =null;
        },
        deleteInput(index,index2) {
            this.filterData[index].splice(index2, 1);
        },
        updateValue(index,val){
            console.log(this.filterData[index])
        }
    },
    mounted(){
        axios
        .get("/columndata/"+ this.user_id+"/"+this.permission_id)
        .then((res) => {
            this.fullData=eval(res.data)
            // open new criteria2 which in form of {label:criteria} for search purposes
            for (var i in this.fullData){
                this.fullData[i]['criteria2']=[]
                for (var j in this.fullData[i].criteria){
                    this.fullData[i].criteria2.push({label:this.fullData[i].criteria[j]})
                }
            }
            // create empty object {colname1:[],colname2:[],...}
            for (var i in this.fullData){
                this.filterData[this.fullData[i].name]=[]
            }
        })
        .catch((err) => console.log(err.message));  
    },
    created() {
       
    },

}
</script>

<style scoped>
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-item {
  display: flex;
  
}
.input-group > .input-item {
  width: 50%;
}
.header{
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.multiselect{
    width: 500px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
}  
.added-projects {
  margin-bottom: 20px;
}
.project-labels,
.added-projects-info {
  display: flex;
  gap: 15px;
}
.added-projects-info {
  margin-bottom: 10px;
}
#label-name,
.added-project-name {
  flex-basis: 35%;
}
.added-project-name{
  display: flex;
  align-items: center;
  padding: 14px 13px 14px 20px;
  border-radius: 4px;
  background-color: #8dd0ff;
  font-weight: 500;
  color: black;

}
#project {
  gap: 16px;
}
#project-name input{
  width: 100%;
}
.project-delete {
  width: 20px;
  padding-top: 14px;
  cursor: pointer;
}
.project-delete:hover {
  color: rgb(255, 86, 86);
}
.card{
    margin-block-start: 20px;
    padding-block-start: 20px;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
    padding-block-end: 20px;
    background-color: #173542;
    border-radius: 20px;
    height: 40vh;
}   
.card .title{
    display: flex;
    align-items: center;
    padding-inline-start: 20px;
    margin-inline-start: -15px;
    margin-inline-end: -15px;
    margin-block-end: 10px;
    background-color: #799fab;
    border-radius: 20px;
    color: white;
    height:4.5vh;
    font-size: x-large;
    font-weight: bold;
}
.scroll{
    width: 100%; 
    height: 200px;
    background-color: #0000004d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
} 

</style>