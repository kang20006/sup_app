<template>
  <Dialog header="Template Record" v-model:visible="display">
    <Draft @yesDraft="yesdraft" />
  </Dialog>
  <Dialog header="Log Record" v-model:visible="displayL">
    <Log />
  </Dialog>
  <Dialog header="History Files" v-model:visible="displayF">
    <File />
  </Dialog>
  <Dialog header="Scheduler List" v-model:visible="displayS">
    <ScheduleList/>
  </Dialog>
  <div class="grid">
    <div class="col-7">
      <div class="grid">
        <div class="col-2">
          <Avatar
            icon="pi pi-user"
            class="mr-2"
            size="xlarge"
            style="background-color: #2196f3; color: #ffffff"
            shape="circle"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <!-- <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/> -->

          <Menu
            id="overlay_menu"
            ref="menu"
            :model="items"
            :popup="true"
            v-if="role === 'admin'"
          />
          <Menu
            id="overlay_menu"
            ref="menu"
            :model="items2"
            :popup="true"
            v-else
          />
        </div>
        <div class="col-10">
          <TableName
            @outputTableName="transfer5"
            :submitted="submitted"
            :filterCriteria="filterCriteria"
            :selectedColumn="selectColumn"
            :isdraft="isdraft"
          />
        </div>
      </div>
      <!-- <div class="grid">
        <div class="col-7">
          <SelectColumn @outputColumn="transfer4" :isdraft="isdraft" />
        </div>
        <div class="col-4">
          <SelectFilter
            :selectedFilter="selectFilter"
            :isdraft="isdraft"
            @output="transfer"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col">
          <FilterList
            :selectedFilter="selectFilter"
            @output2="transfer2"
            @outputFilter="transfer3"
            :isdraft="isdraft"
          />
        </div>
      </div> -->
      <div class="card2">
        <ScrollPanel style="width: 100%; height: 100%">
        <Accordion>
          <AccordionTab>
            <template #header>
              <i class="pi pi-check"></i>
              <span>Include</span>
            </template>
            <SelectColumn @outputColumn="transfer4" :isdraft="isdraft" />
          </AccordionTab>
          <AccordionTab>
            <template #header>
              <i class="pi pi-filter"></i>
              <span>Filter</span>
            </template>
            <SelectFilter
              :selectedFilter="selectFilter"
              @output="transfer"
              @yesFile="yesfile"
            />
            <FilterList
              :selectedFilter="selectFilter"
              @output2="transfer2"
              @outputFilter="transfer3"
              :isdraft="isdraft"
              :isfile="isfile"
            />
          </AccordionTab>
        </Accordion>
      </ScrollPanel>
      </div>
      
    </div>
    <div class="col-5">
      <Code
        :filterCriteria="filterCriteria"
        :selectedColumn="selectColumn"
        :newTableName="newTableName"
        @warn="transfer6"
      />
    </div>
  </div>
</template>

<script>
import SelectColumn from "../components/SelectColumn.vue";
import SelectFilter from "../components/SelectFilter.vue";
import FilterList from "../components/FilterList.vue";
import Code from "../components/Code.vue";
import TableName from "../components/TableName.vue";
import Draft from "../components/Draft.vue";
import SpeedDial from "primevue/speeddial";
import Avatar from "primevue/avatar";
import { storeData } from "../store/data";
import Menu from "primevue/menu";
import router from "../router";
import Dialog from "primevue/dialog";
import Log from "@/components/Log.vue";
import File from "@/components/File.vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import ScrollPanel from "primevue/scrollpanel";
import ScheduleList from "@/components/ScheduleList.vue";
import Toast from "primevue/toast";
export default {
  name: "SasGen",
  components: {
    SelectColumn,
    SelectFilter,
    FilterList,
    Code,
    TableName,
    SpeedDial,
    Avatar,
    Menu,
    Dialog,
    Draft,
    Log,
    File,
    Accordion,
    AccordionTab,
    ScrollPanel,
    ScheduleList,
    Toast
  },
  data() {
    return {
      selectFilter: [],
      display: false,
      role: storeData.user.user_role,
      filterCriteria: [],
      selectColumn: [],
      newTableName: null,
      submitted: false,
      isdraft: false,
      isfile:false,
      displayL: false,
      displayF: false,
      displayS: false,
      items: [
        {
          label: storeData.user.name,
          icon: "pi pi-user",
          command: () => {},
        },
        {
          label: "Template",
          icon: "pi pi-folder-open",
          command: () => {
            this.display = true;
          },
        },
        {
          label: "Log",
          icon: "pi pi-file",
          command: () => {
            this.displayL = true;
          },
        },
        {
          label: "History Files",
          icon: "pi pi-history",
          command: () => {
            this.displayF = true;
          },
        },
        {
          label: "Scheduler List",
          icon: "pi pi-clock",
          command: () => {
            this.displayS = true;
          },

        },

        {
          label: "Sign-Out",
          icon: "pi pi-sign-out",
          command: () => {
            router.push({ name: "login" });
          },
        },
      ],
      items2: [
        {
          label: storeData.user.name,
          icon: "pi pi-user",
          command: () => {},
        },
        {
          label: "Template",
          icon: "pi pi-folder-open",
          command: () => {
            this.display = true;
          },
        },
        {
          label: "History Files",
          icon: "pi pi-history",
          command: () => {
            this.displayF = true;
          },
        },
        {
          label: "Scheduler List",
          icon: "pi pi-clock",
          command: () => {
            this.displayS = true;
          },

        },
        {
          label: "Sign-Out",
          icon: "pi pi-sign-out",
          command: () => {
            router.push({ name: "login" });
          },
        },
        
      ],
    };
  },
  methods: {
    // transfer output which is the selectedFilter to the FilterList (the valaue of column filter)
    transfer(value) {
      if (this.selectFilter.indexOf(value) !== -1) {
        this.selectFilter = this.selectFilter.filter(function (val) {
          return val !== value;
        });
      } else {
        this.selectFilter.push(value);
      }
    },
    // from Filter list to SelectFilter
    transfer2(value) {
      if (this.selectFilter.indexOf(value) !== -1) {
        this.selectFilter = this.selectFilter.filter(function (val) {
          return val !== value;
        });
      } else {
        this.selectFilter.push(value);
      }
    },
    // transfer filter criteria to code
    transfer3(value) {
      this.filterCriteria = value;
    },
    transfer4(value) {
      this.selectColumn = value;
    },
    transfer5(value) {
      this.newTableName = value;
    },
    transfer6(value) {
      this.submitted = value;
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    yesdraft(value) {
      this.display = false;
      this.selectFilter = storeData.draft.selectedFilter_simple;
      this.isdraft = !this.isdraft;
    },
    yesfile(value) {
      this.selectFilter = storeData.draft.selectedFilter_simple;
      this.isfile=!this.isfile;
    },

  },
};
</script>
<style scoped>
  .card2 {
  margin-block-start: 20px;
  padding-block-start: 20px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  padding-block-end: 20px;
  background-color: #173542;
  border-radius: 20px;
  height: 82vh;
  width: 100%;
}
</style>

