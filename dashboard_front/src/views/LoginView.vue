<template>
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">Sign in</h2>
          <p class="login-subtitle">Enter your user informations</p>
        </div>
        <form class="login-form" @submit.prevent="signIn">
          <div class="form-group">
            <label class="form-label" for="email">E-mail</label>
            <input class="form-input" type="email"
            placeholder="exemple@gmail.com" name="email" v-model="input.email" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input class="form-input" type="password"
            placeholder="*****" name="password" v-model="input.password" required>
          </div>
          <h3 v-if="resCode" class="error-login"> {{ this.errorMessage }}</h3>
          <button class="btn-primary" type="submit">Sign in</button>
        </form>
        <p>Not register yet ? <a href="/register">Sign up</a></p>
        <GoogleLogin :callback="GoogleSignIn" style="margin-left: 12%"/>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import axios from 'axios';
import { decodeCredential } from 'vue3-google-login';
import { googleAuthCodeLogin } from "vue3-google-login"

export default defineComponent({
  name: "LoginForm",
  data() {
    return {
      isLogin: this.$store.state.Connected,
      bearer: this.$store.state.Bearer,
      id: this.$store.state.Id,
      role: this.$store.state.Role,
      resCode: 0,
      errorMessage: "",
      input: {
          email: "",
          password: "",
      },
    };
  },
  methods: {
    async signIn() {
      this.resCode = 0;
      await axios.post("http://localhost:8080/api/auth/login", {
        password: this.input.password,
        email: this.input.email,
      }, {
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => {
        this.resCode = 200;
        this.$store.commit("setConnected", true);
        this.$store.commit("setBearer", res.data.token);
        this.$store.commit("setId", res.data.userId);
        this.$store.commit("setRole", res.data.role);
        this.isLogin = this.$store.state.Connected;
        this.bearer = this.$store.state.Bearer;
        this.role = this.$store.state.Role;
        this.id = this.$store.state.Id;
        //this.$router.push("/dashboard");
      }).catch((err) => {
        if (err.response.status === 401) {
          this.resCode = 401;
          this.errorMessage = "Identifiants incorrects";
        }
        if (err.response.status === 404) {
          this.resCode = 404;
          this.errorMessage = "Veuillez remplir tous les champs";
        }
        console.log(err);
      });
      this.$router.push("/dashboard");
    },
    async GoogleSignIn(res) {
      this.resCode = 0;
      const userData = decodeCredential(res.credential)
      await axios.post("http://localhost:8080/api/auth/login", {
        email: userData.email,
        password: userData.sub,
      }, {
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => {
        this.resCode = 200;
        this.$store.commit("setConnected", true);
        this.$store.commit("setBearer", res.data.token);
        this.$store.commit("setId", res.data.userId);
        this.$store.commit("setRole", res.data.role);
        this.isLogin = this.$store.state.Connected;
        this.bearer = this.$store.state.Bearer;
        this.id = this.$store.state.Id;
        this.role = this.$store.state.Role;
      }).catch((err) => {
        if (err.response.status === 401) {
          this.resCode = 401;
          this.errorMessage = "Identifiants incorrects";
        }
        if (err.response.status === 404) {
          this.resCode = 404;
          this.errorMessage = "Veuillez remplir tous les champs";
        }
        console.log(err);
      });
      this.$router.push('/dashboard');
    },
  },
});

</script>

<style scoped>

.login-page {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: auto;
}

.login-card {
  max-width: 600px;
  padding: 70px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px #0f2e42;
  background-color: #ffffff;
}

.login-header {
  text-align: center;
  margin-bottom: 60px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 16px;
  color: #999999;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form .form-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.login-form .form-input {
  align-items: center;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 20px;
  background-color: #f4f4f4;
}

.login-form .form-input:focus {
  outline: none;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.login-form .btn-primary {
  border: none;
  border-radius: 5px;
  margin-bottom: 10%;
  margin-top: 10%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #007bff;
  color: #ffffff;
  transition: all 0.3s;
}

.login-form .btn-primary:hover {
  background-color: #0062cc;
}

.login-form .form-input:invalid {
  border: 2px solid red;
}

p {
  text-align: center;
}

.error-login {
  color: red;
  text-align: center;
  font-weight: bold;
  font-size: small;
}

</style>