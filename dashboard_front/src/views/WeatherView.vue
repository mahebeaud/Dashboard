<template>
    <div>
      <h1>Weather Service</h1>
      <div class="dashboard-weather">
        <div class="input-weather">
          <input type="text" id="city" v-model="newCity" placeholder="Paris, Bordeaux...">
          <button class="weather-button" @click="addCity">Add a city</button>
        </div>
        <div class="weather-widget" v-for="(city, index) in cityList" :key="index">
            <WeatherWidget :cityList="city" :cityId="cityID"/>
        </div>
        <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WeatherWidget from '../components/WeatherWidget.vue';

export default defineComponent({
  name: 'WeatherPage',
  components: {
    WeatherWidget,
  },
  data() {
    return {
      newCity: '',
      cityList: [],
      errorMessage: '',
      cityID: 0,
    };
  },
  methods: {
    addCity() {
      if (this.newCity === "") {
        this.errorMessage = "Please enter a city name!";
        return;
      }
      this.errorMessage = "";
      const newId = this.cityList.length ? this.cityList[this.cityList.length - 1].id + 1 : 1;
      this.cityList.push({ id: newId, cityName: this.newCity });
      this.newCity = '';
    },
  },
});
</script>

<style scoped>

.weather-widget {
  width: 250px;
  height: 200px;
  padding: 10px;
  align-items: center;
}
.dashboard-weather {
  display: flex;
  height: 65vh;
  padding-top: 100px;
  width: 95%;
  justify-content: start;
  border-radius: 15px;
  border : 5px solid #42b883;
}

.input-weather {
  height: 100%;
  align-items: center;
}

input {
  margin-left: 15%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
}

input:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 8px 0 rgba(102, 175, 233, 0.6);
}

.weather-button {
  background-color: #42b883;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

</style>