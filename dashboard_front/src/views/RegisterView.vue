<template>
    <div class="register-page">
      <div class="register-card">
        <div class="register-header">
          <h2 class="register-title">Sign up</h2>
          <p class="register-subtitle">Create an account</p>
        </div>
        <form class="register-form" @submit.prevent="signUp">
          <div class="form-group">
            <label class="form-label" for="lastname">Lastname</label>
            <input class="form-input" type="text"
            placeholder="Smith" name="lastname" v-model="input.lastname" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="firstname">Firstname</label>
            <input class="form-input" type="text"
            placeholder="John" name="firstname" v-model="input.firstname" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="email">E-mail</label>
            <input class="form-input" type="email"
            placeholder="exemple@gmail.com" name="email" v-model="input.email" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Passwrd</label>
            <input id="repeat-password" class="form-input" type="password"
            placeholder="*****" name="password" v-model="input.password" required>
            <span v-if="input.password.length < 5" class="error-message">Password must be at leat 5 characters !</span>
          </div>
          <h3 v-if="resCode" class="error-register"> {{  this.errorMessage }}</h3>
          <button class="btn-primary" type="submit">Sign up</button>
        </form>
        <p>Already registered ? <a href="/login">Sign in</a></p>
        <GoogleLogin :callback="GoogleSignUp" style="margin-left: 12%"/>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { decodeCredential } from 'vue3-google-login';

export default defineComponent({
  name: 'registerForm',
  data() {
    return {
      resCode: 0,
      errorMessage: '',
      input: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    signUp() {
      if (this.input.email === '' || this.input.password === '' || this.input.firstname === '' || this.input.lastname === '') {
        return;
      }
      axios.post('http://localhost:8080/api/auth/register', {
        firstname: this.input.firstname,
        lastname: this.input.lastname,
        email: this.input.email,
        password: this.input.password,
    }).then((res) => {
        this.resCode = 200;
        this.$router.push('/login');
      }).catch((err) => {
        if (err.status === 401) {
          this.errorMessage = 'Adresse email déjà utilisé !';
        }
        if (err.status === 400) {
          this.errorMessage = 'Veuillez remplir tous les champs !';
        }
        if (err.status === 500) {
          this.errorMessage = 'Erreur serveur !';
        }
        console.log(err);
      });
    },
    GoogleSignUp(res) {
      const userData = decodeCredential(res.credential)
      axios.post('http://localhost:8080/api/auth/register', {
        firstname: userData.given_name,
        lastname: userData.family_name,
        email: userData.email,
        password: userData.sub,
      }).then((res) => {
        this.resCode = 200;
        this.$router.push('/login');
      }).catch((err) => {
        if (err.status === 401) {
          this.errorMessage = 'Adresse email déjà utilisé !';
        }
        if (err.status === 400) {
          this.errorMessage = 'Veuillez remplir tous les champs !';
        }
        if (err.status === 500) {
          this.errorMessage = 'Erreur serveur !';
        }
        console.log(err);
      });
    },
  },
});

</script>

<style scoped>

.register-page {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: auto;
}

.register-card {
  max-width: 500px;
  padding: 60px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px #0f2e42;
  background-color: #ffffff;
}

.register-header {
  text-align: center;
  margin-bottom: 60px;
}

.register-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.register-subtitle {
  font-size: 16px;
  color: #999999;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form .form-group {
  margin-bottom: 20px;
}

.register-form .form-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.register-form .form-input {
  align-items: center;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 20px;
  background-color: #f4f4f4;
}

.register-form .form-input:focus {
  outline: none;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.register-form .btn-primary {
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

.register-form .btn-primary:hover {
  background-color: #0062cc;
}

.register-form .form-input:invalid {
  border: 2px solid red;
}

p {
    text-align: center;
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    font-weight: bold;
    display: block;
}

.error-register {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    font-weight: bold;
    display: block;
    text-align: center;
}
</style>