<template>
    <Toast/>
    <Dialog v-model:visible="error_submit">
        <template #header>
            <h3>
                <font-awesome-icon icon="fa-solid fa-triangle-exclamation" /> {{message.header}}
            </h3>
        </template>

        {{message.body}}
    </Dialog>
    <h2>Template</h2>
    <Dropdown
      v-model="selectedDraft"
      :options="draftname"
      optionLabel="tablename"
      placeholder="Select a Saved Template "
      :filter="true"
      filterPlaceholder="Find Template"
      @change="changename"
    />
    <h2>Interval</h2>
    <Dropdown
      v-model="selectedInterval"
      :options="optioninterval"
      placeholder="Select an Interval"
      @change="changeinterval"
    />
    <div v-if="selectedInterval">
      <div v-if="selectedInterval === 'week'">
        <h2>Weekday</h2>
        <Dropdown
          v-model="selectedweek"
          :options="optionweek"
          optionLabel="day"
          placeholder="Select a Weekday"
        />
      </div>
      <div v-if="selectedInterval === 'month'">
        <h2>Day of Month</h2>
        <Calendar v-model="day" dateFormat="d" placeholder="Select a Day" />
      </div>
      <h2>Time</h2>
      <InputNumber
        v-model="hour"
        showButtons
        buttonLayout="vertical"
        decrementButtonClass="p-button-secondary"
        incrementButtonClass="p-button-secondary"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
        :min="0"
        :max="23"
        suffix="Hour"
        :step="1"
      />
      <InputNumber
        v-model="minute"
        showButtons
        buttonLayout="vertical"
        decrementButtonClass="p-button-secondary"
        incrementButtonClass="p-button-secondary"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
        :min="0"
        :max="59"
        suffix="Minute"
        :step="1"
      />
    </div>
    <hr/>
    <div>
        <Button label="Schedule" icon="pi pi-check" autofocus @click="submit" />
    </div>
    
   
</template>

<script>
import Dropdown from "primevue/dropdown";
import axios from "../plugins/axios.js";
import { storeData } from "../store/data";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Toast from "primevue/toast";
export default {
  name: "ScheduleForm",
  emits:["close"],
  components: {
    Dropdown,
    Calendar,
    InputNumber,
    Dialog,
    Button,
    Toast
  },
  data() {
    return {
      user_id: storeData.user.user_id,
      selectedDraft: null,
      draftname: [],
      selectedInterval: null,
      optioninterval: ["day", "week", "month"],
      optionweek: [
        { no: 1, day: "Monday" },
        { no: 2, day: "Tuesday" },
        { no: 3, day: "Wednesday" },
        { no: 4, day: "Thursday" },
        { no: 5, day: "Friday" },
        { no: 6, day: "Saturday" },
        { no: 7, day: "Sunday" },
      ],
      hour: 0,
      minute: 0,
      selectedweek: {no:null,day:null},
      day: null,
      error_submit:false,
      message:{
        header:null,
        body:null
      },
      outday:null
    };
  },
  methods: {
    changename() {
      console.log(this.selectedDraft);
    },
    changeinterval() {
      console.log(this.selectedInterval);
    },
    submit(){
        if (this.selectedInterval==='day' || this.selectedInterval==='week'){
              this.day=new Date();
              this.outday = this.day.getUTCDate()+1
        }
        else if (this.selectedInterval==='month'){
            this.outday=this.day.getUTCDate()+1
        }
        if (this.selectedInterval===null || this.selectedDraft===null || this.day===null){
            this.error_submit=true
            this.message.header="Empty fields in the scheduler"
            this.message.body="Please fill in all the info needed"
        }
        else{
            
            let data={
                        interval: this.selectedInterval,
                        version: 1,
                        draft_id: this.selectedDraft['draft_id'],
                        day: this.outday,
                        hour: this.hour,
                        minute: this.minute,
                        week:this.selectedweek['no'],
                        path:storeData.user.file_path
                    }
                    axios({
                    method: "post",
                    url:
                        process.env.VUE_APP_BASE_URL +
                        "/schedule/" +
                        this.user_id ,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: data,
                    })
                    .then((response) => {
                        console.log(response)
                        this.$toast.add({severity:'success', summary: 'Schedule Successfully', detail:'The template is added into schedule list.', life: 3000});
                    })
                    .catch(error => {
                        console.log(error)
                        this.$toast.add({severity:'error', summary: 'Fail to Schedule', detail:'An error has occurred', life: 3000});
                    });
                    this.$emit("close", false);
                }
        }
        
  },
  mounted() {
    axios
      .get("/draftlog/getdraftname/" + this.user_id)
      .then((res) => {
        this.draftname = eval(res.data);
      })
      .catch((err) => console.log(err.message));
  },
};
</script>

<style>
</style>