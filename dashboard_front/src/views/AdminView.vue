<template>
    <link href='https://unpkg.com/css.gg@2.0.0/icons/css/trash.css' rel='stylesheet'>
    <h1>Admin Dashboard</h1>
    <div class="panel-container">
        <div class="panel">
          <h1>Users list</h1>
          <table>
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Role</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td>{{ user.firstname }}</td>
                <td>{{ user.lastname }}</td>
                <td>{{ user.email }}</td>
                <td>
                    <select v-model="user.role" @change="updateRole(user)">
                        <option v-for="(role, index) in roles" :value="role" :key="index"> {{ role }}</option>
                    </select>
                </td>
                <td class="test">
                    <i class="gg-trash" aria-hidden="true" style="cursor: pointer" @click="deleteUser(index)"></i>
                </td>
              </tr>
            </tbody>
            <div v-if="message" class="message-container">
                <p class="message">
                    {{ message }}
                </p>
            </div>
          </table>
        </div>
    </div>
  </template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminView',
  data() {
      return {
        roles: ['admin', 'user'],
        id: this.$store.state.Id,
        role: this.$store.state.Role,
        users: [],
        message: '',
    };
  },
  methods: {
    async getUsers() {
        try {
            await axios.get(`http://localhost:8080/api/user/all`, {
                data: {
                  role: this.role,
                },
                headers: {
                  Authorization: `${this.$store.state.Bearer}`,
                },
            }).then((res) => {
                this.users = res.data;
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    },
    updateRole(user) {
        axios.put(`http://localhost:8080/api/user/${user._id}`, {
            role: user.role
        }, {
            headers: {
                Authorization: `${this.$store.state.Bearer}`,
            },
        }).then((res) => {
            this.message = res.data.message;
            location.reload();
        }).catch((err) => {
            this.message = err.response.data.message;
            console.log(err);
        });
        this.message = '';
    },
    deleteUser(index) {
        axios.delete(`http://localhost:8080/api/user/${this.users[index]._id}`, {
            headers: {
                Authorization: `${this.$store.state.Bearer}`,
            },
        }).then((res) => {
            this.message = res.data.message;
            location.reload();
        }).catch((err) => {
            this.message = err.response.data.message;
            console.log(err);
        });
        this.message = '';
    }
  },
  mounted() {
    this.getUsers();
  }
});
</script>

<style scoped>

.panel-container {
    height: 65vh;
    padding-top: 100px;
    margin: auto;
    width: 90%;
    justify-content: start;
    border-radius: 15px;
    border : 5px solid #42b883;
}

.panel {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 15px;
  background-color:  #42b883;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #42b883;
}

th {
  background-color: #42b883;
}

.separator {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.7);
    margin: 0.9em 0;
}

select {
  padding: 0.4em;
  border-radius: 5px;
  background-color: none;
}

.test {
    display: flex;
    justify-content: center;
}

.message {
    font-weight: bold;
    font-size: large;
    justify-content: right;
}

.message-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>