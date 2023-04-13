<template>
  <div>
    <button class="modal-button" @click="showModal = true">Add a widget</button>
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal" @click.stop>
        <h2 v-if="this.service == 0">Choose your service and add a widget !</h2>
        <div class="options" v-if="this.service == 0">
          <button class="service-button" @click="chooseWeather">Weather</button>
          <button class="service-button" @click="chooseYoutube">Youtube</button>
          <button class="service-button" @click="chooseReddit">Reddit</button>
          <button class="service-button" @click="closeModal">Cancel</button>
        </div>
        <div v-if="this.service == 1">
          <h1>Weather Service</h1>
          <div>
            <input class="input" type="text" id="city" v-model="newCity" placeholder="Paris, Bordeaux ...">
            <button class="service-button" @click="sendWeather">Add a city</button>
          </div>
          <button class="service-button" @click="closeModal">Cancel</button>
        </div>
        <div v-if="this.service == 2">
          <h1>Youtube - Service</h1>
          <div>
            <input class="input" type="text" id="videoId" v-model="newVideo" placeholder="XdwaASKJGxo">
            <button class="service-button" @click="sendYoutubeID">Add a video</button>
          </div>
          <button class="service-button" @click="closeModal">Cancel</button>
        </div>
        <div v-if="this.service == 3">
          <h1>Reddit - Service</h1>
          <div>
            <input class="input" type="text" id="subreddit" v-model="newReddit" placeholder="Javascript, funny...">
            <input class="input" type="number" id="nbr-Post" v-model="lastNPost" placeholder="How much post ?">
            <button class="service-button" @click="sendReddit">Add Subreddit</button>
          </div>
          <button class="service-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ModalButton',
  data() {
    return {
      showModal: false,
      service: 0,
      newCity: '',
      newVideo: '',
      newReddit: '',
      lastNPost: 0,
    };
  },
  methods: {
    closeModal() {
      this.service = 0;
      this.showModal = false;
    },
    chooseWeather() {
      this.service = 1;
    },
    chooseYoutube() {
      this.service = 2;
    },
    chooseReddit() {
      this.service = 3;
    },
    sendWeather() {
      this.$emit('city-choosed', this.newCity);
      this.newCity = '';
      this.closeModal();
    },
    sendYoutubeID() {
      this.$emit('youtube-id', this.newVideo);
      this.newVideo = '';
      this.closeModal();
    },
    sendReddit() {
      this.$emit('subreddit', this.newReddit, this.lastNPost);
      this.newReddit = '';
      this.lastNPost = 0;
      this.closeModal();
    },
  },
};
</script>

<style scoped>

.modal-overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #00000068;
}

.modal {
  text-align: center;
  align-items: center;
  background: linear-gradient(0deg,#389466,#42b883);
  width: 500px;
  height: 450px;
  margin-top: 10%;
  padding: 50px 0;
  border-radius: 20px;
  color: white;
}
h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

.service-button {
  background: #212529;
  width: 150px;
  height: 40px;
  color: white;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  margin: auto;
  margin-top: 50px;
  display: grid;
  border: none;
  cursor: pointer;
}

.service-button:hover {
  background: #343a40;
}

.input {
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  margin: 10px;
  background-color: #ffffff;
  color: #212529;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 8px 0 rgba(102, 175, 233, 0.6);
}

.options {
  margin-bottom: 15%;
}
.modal-button {
  width: 10%;
  height: 5%;
  font-size: 18px;
  border: 0px;
  border-radius: 10px;
  color: white;
  background: linear-gradient(0deg,#389466,#42b883);
  position: absolute;
  top: 20%;
  left: 50%;
}
</style>
