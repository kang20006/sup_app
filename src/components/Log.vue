<template>
  <TreeTable
    :value="log"
    :filters="filters2"
    filterMode="strict"
    :paginator="true" :rows="10"
  >
    <template #header>
      <div class="text-right">
        <div class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText
            v-model="filters2['global']"
            placeholder="Global Search"
            size="50"
          />
        </div>
      </div>
    </template>
    <Column field="id" header="ID" :expander="true">
      <template #filter>
        <InputText
          type="text"
          v-model="filters2['id']"
          class="p-column-filter"
          placeholder="Filter by id"
        />
      </template>
    </Column>
    <Column field="activity" header="Activity">
      <template #filter>
        <InputText
          type="text"
          v-model="filters2['activity']"
          class="p-column-filter"
          placeholder="Filter by activity"
        />
      </template>
    </Column>
    <Column field="user_name" header="User Name">
      <template #filter>
        <InputText
          type="text"
          v-model="filters2['user_name']"
          class="p-column-filter"
          placeholder="Filter by user name"
        />
      </template>
    </Column>
    <Column field="name" header="Name">
      <template #filter>
        <InputText
          type="text"
          v-model="filters2['name']"
          class="p-column-filter"
          placeholder="Filter by name"
        />
      </template>
    </Column>
    <Column field="datetime" header="Date Time">
      <template #filter>
        <InputText
          type="text"
          v-model="filters2['datetime']"
          class="p-column-filter"
          placeholder="Filter by date time"
        />
      </template>
    </Column>
    <Column field="criteria" header="Criteria"></Column>
    <template #footer>
      <div style="text-align: left">
        <Button icon="pi pi-refresh" />
      </div>
    </template>
  </TreeTable>
</template>

<script>
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import axios from "../plugins/axios.js";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
export default {
  name: "log",
  components: {
    TreeTable,
    Column,
    Button,
    InputText
  },
  data() {
    return {
      log: [],
      filters2: {},
    };
  },
  mounted() {
    axios
      .get("/draftlog/getlog")
      .then((res) => {
        this.log = res.data.root;
      })
      .catch((err) => console.log(err.message));
  },
  methods: {
    refresh() {
      axios
        .get("/draftlog/getlog")
        .then((res) => {
          this.draft = res.data.root;
        })
        .catch((err) => console.log(err.message));
    },
  },
};
</script>

<style>
</style>
