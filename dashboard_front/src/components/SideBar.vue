<template>
    <div class="sidebar" :style="{ width: sideBarWidth}">
      <h1>
        <span v-if="this.$store.state.Connected == false">
          Welcome
        </span>
        <!-- <span v-else>Welcome {{ getFirstname() }}</span> -->
        <span v-else>Welcome</span>
        <div class="separater"></div>
      </h1>
      <div class="sidebar-container">
          <SideBarLink to="/">Home</SideBarLink>
          <SideBarLink to="/about">About</SideBarLink>
          <SideBarLink v-if="this.$store.state.Connected == false" to="/weather">Méteo</SideBarLink>
          <SideBarLink v-if="this.$store.state.Connected == true" to="/dashboard">Dashboard</SideBarLink>
          <SideBarLink v-if="this.$store.state.role === 'admin' && this.$store.state.Connected == true" to="/admin">Admin</SideBarLink>
          <SideBarLink v-if="this.$store.state.Connected == false" to="/login">login</SideBarLink>
          <span class="logout" v-if="this.$store.state.Connected == true" @click="logout()">logout</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { collapsed, toggleSideBar, sideBarWidth } from './states';
import SideBarLink from './SideBarLink.vue';
import axios from 'axios';

export default defineComponent({
  name: 'SideBar',
  props: {},
  components: {
    SideBarLink,
  },
  setup() {
    return {
      collapsed,
      toggleSideBar,
      sideBarWidth,
    };
  },
  data() {
    return {
      firstname: '',
      id: this.$store.state.Id,
      role: this.$store.state.Role,
      connected: this.$store.state.Connected,
    };
  },
  methods: {
    getFirstname() {
      axios.get(`http://localhost:8080/api/user/${this.id}`, {
        headers: {
          Authorization: `${this.$store.state.Bearer}`,
        },
      }).then((res) => {
        this.firstname = res.data.firstname;
      }).catch((err) => {
        console.log(err);
      });
      return this.firstname;
    },
    logout() {
      this.$store.commit('setLogout');
      this.$store.commit('setConnected', false);
      this.$store.commit('setBearer', '');
      this.$store.commit('setId', 0);
      this.$store.commit('setRole', '');
      localStorage.clear();
      this.$router.push('/login');
    }
  },
  mounted() {
    if (this.$store.state.Connected == true) {
      this.getFirstname();
    }
  }
});
</script>

<style>
:root {
  --sidebar-bg-color: #212529;
  --sidebar-text-color: #E7ECEF;
  --sidebar-text-color-hover: #0f2e42;
}
</style>

<style scoped>

.sidebar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30%;
  height: 100%;
  font-size: 115%;
}
.sidebar {
  color: white;
  align-items: center;
  justify-content: center;
  background: linear-gradient(0deg,#389466,#42b883);
  float: left;
  text-align: center;
  border-radius: 15px;
  height: 90%;
  margin-top: 20px;
  display: block;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 10px rgba(183, 179, 179, 0.766);
}

h1 {
  font-size: 1.5em;
  margin: 0.5em 0;
  color: var(--sidebar-text-color);
}

.logout {
  padding: 10%;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
  cursor: pointer;
  border-radius: 0.25em;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.separater {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.7);
    margin: 0.9em 0;
}

</style>

