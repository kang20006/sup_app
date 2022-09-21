<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="true"
    :on-cancel="onCancel"
    :is-full-page="true"
  />
  <section id="home" class="d-flex align-items-center position-relative vh-100">
    <div class="container-fluid container-fluid-max">
      <div class="row">
        <h1
          class="text-white"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 350%;
            font-weight: bold;
          "
        >
          Login
          <br />SLM Analytics
        </h1>
      </div>
      <br />
      <div class="container">
        <div class="row" style="width: 500px; margin: auto">
          <form
            @submit.prevent="handleSubmit"
            class="box"
            style="font-weight: bold"
          >
            <h1>Login</h1>
            <p class="custom">Please enter your login and password</p>
            <input
              type="text"
              name
              placeholder="Username"
              v-model="input.username"
              style="font-weight: bold"
            />
            <input
              type="password"
              name
              placeholder="Password"
              v-model="input.password"
              style="font-weight: bold"
            />
            <input
              type="submit"
              name
              value="Login"
              href="#"
              style="font-weight: bold"
            />
            <span v-if="this.errored"
              ><small class="p-error" style="font-weight: bold"
                >The username and / or password is incorrect.</small
              ></span
            >
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
import axios from "axios";
import Loading from 'vue-loading-overlay';
import router from "../router";
import { storeData } from "../store/data";
export default {
  name: "Login",
  components: {
    Loading
  },
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      errored: false,
      user: null,
      isLoading: false,
      // mockAccount: {
      //     username: "jamesCZJ",
      //     password: "sunlifeintern"
      // }
    };
  },
  mounted() {},
  methods: {
    onCancel(){
            console.log("cancelled")
        },
    async handleSubmit() {
      this.isLoading = true;
      var data = JSON.stringify({
        username: this.input.username,
        password: this.input.password,
      });
      var config = {
        method: "post",
        url: process.env.VUE_APP_BASE_URL + "/login1/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async (res) => {
          if (res.status == 200) {
            this.isLoading = false;
            storeData.updateUser(res.data);
            console.log(storeData.user);
            console.log("Login");
            router.push({ name: "sasgen" });
            console.log(router);
            this.errored = false;
          } else {
            this.isLoading = false;
            console.log("The username and / or password is incorrect.");
          }
        })

        .catch((error) => {
          this.errored = true;
          this.isLoading=false;
          console.log(error);
          console.log(this.errored);
        });
    },
  },
};
</script>
  
  <style scoped>
/* .container-fluid-max {
  max-width: 1440px;
} */

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
.box {
  width: 500px;
  padding: 40px;
  /* position: absolute; */
  top: 50%;
  left: 50%;
  background: white;
  text-align: center;
  transition: 0.25s;
  border-radius: 24px;
  /* opacity: 0.85; */
  /* margin-top: 100px */
}
.box input[type="text"],
.box input[type="password"] {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #10c6ba;
  padding: 10px 10px;
  width: 250px;
  outline: none;
  color: #033e44;
  border-radius: 24px;
  transition: 0.25s;
}
.box h1 {
  color: #033e44;
  text-transform: uppercase;
  font-weight: bold;
}
.box input[type="text"]:focus,
.box input[type="password"]:focus {
  width: 300px;
  border-color: #033e44;
  box-shadow: 5px 10px;
}
.box input[type="submit"] {
  border: 0;
  background: #10c6ba;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #10c6ba;
  padding: 14px 40px;
  outline: none;
  color: #033e44;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}
.box input[type="submit"]:hover {
  background: #033e44;
  border: #033e44;
  color: #10c6ba;
  box-shadow: 5px 10px;
  /* box-shadow: 5px 10px #033e44 */
}
::placeholder {
  color: #033e44;
}
input:focus::placeholder {
  color: transparent;
}
.custom {
  color: #033e44;
}
</style>