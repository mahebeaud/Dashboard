<template>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/options.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/menu.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/arrow-right-r.css' rel='stylesheet'>
    <Draggable>
      <div class="weather-form" :class="{flipped: isFlipped}">
        <div class="weather-content" :class="{flipped: isFlipped}">
          <div class="weather-front">
            <div class="icon-menu" @click="toogleRotation">
              <i class="gg-menu"></i>
            </div>
            <h1 class="city-name">{{ this.cityList.cityName }}</h1>
            <h1 class="city-temp">{{ temp_c }}°C</h1>
            <img class="city-icon" :src="getIcon()">
            <p class="city-condition"> {{ condition }}</p>
          </div>
          <div class="weather-back">
            <div class="icon-menu">
              <i class="gg-arrow-right-r" @click="toogleRotation"></i>
            </div>
            <h1>Change city</h1>
            <p>Current city: {{ this.cityList.cityName }}</p>
            <input class="change-city" type="text" placeholder="New city..." v-model="newCity">
            <button class="button-update" @click="updateCity(); toogleRotation()">Update City</button>
            <button class="button-delete" @click="deleteWidget">Delete Widget</button>
          </div>
        </div>
      </div>
    </Draggable>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import axios from 'axios'
import { Draggable } from '@braks/revue-draggable';

export default defineComponent({
  name: 'WeatherWidget',
  props: {
    cityList: {
      type: [Object, Array],
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  components: {
    Draggable,
  },
  data() {
    return {
      id: this.$store.state.Id,
      temp_c: 0,
      message: "",
      iconUrl: "",
      city: "",
      condition: '',
      cardState: false,
      newCity: '',
      isFlipped: false,
      currentIdWidget: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const city = this.cityList.cityName;
      axios.get(`http://api.weatherapi.com/v1/current.json?key=<YOUR_WEATHER_API_KEY>&q=${city}&aqi=yes`, {
        headers: {
          'Content-type':'application/json',
        },
      }).then((res) => {
        const allData = res.data;
        const new_temp = allData.current.temp_c;
        this.temp_c = Math.floor(new_temp);
        this.iconUrl = allData.current.condition.icon;
        this.city = allData.location.name;
        this.condition = allData.current.condition.text;
       }).catch((err) => {
          console.log(err);
       });
    },
    getIcon() {
      if (this.iconUrl) {
        const parts = this.iconUrl.split('/');
        const time = parts[5];
        const code = parts[6].split('.')[0];
        return `/weather/64x64/${time}/${code}.png`;
      }
    },
    async getWidgetId() {
      try {
        await axios.get(`http://localhost:8080/api/service/current/widgets/${this.id}`)
          .then((res) => {
            for (let i = 0; i < res.data.widgets.length; i++) {
              if (res.data.widgets[i].params[0].id == this.index) {
                this.currentIdWidget = res.data.widgets[i]._id;
              }
            }
          }).catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async updateCity() {
      this.cityList.cityName = this.newCity;
      await this.getWidgetId();
      try {
        await axios.put(`http://localhost:8080/api/service/widgets/${this.id}`, {
          widgetId: this.currentIdWidget,
          params: {
            name: this.newCity,
          }
        }, {
          headers: {
            'Authorization': this.$store.state.bearer,
          },
        }).then((res) => {
          this.fetchData();
          }).catch((err) => {
            console.log(err);
          });
        } catch (error) {
          console.log(error);
        }
      this.newCity = '';
    },
    async deleteWidget() {
      await this.getWidgetId();
      try {
        await axios.delete(`http://localhost:8080/api/service/widgets/${this.id}`, {
          data: {
            widgetId: this.currentIdWidget,
          }
        }).then((res) => {
            location.reload();
          }).catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },
    toogleRotation() {
      this.isFlipped = !this.isFlipped;
    }
  },
  mounted() {
    setInterval(() => {this.fetchData()},  900000); // refresh every 15 minutes
  },
});

</script>

<style scoped>

.weather-form {
  background-color: transparent;
  width: 300px;
  height: 200px;
  perspective: 1000px;
}

.weather-content {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.icon-menu {
  position: absolute;
  left: 90%;
  height: 4%;
  padding-top: 5%;
  cursor: pointer;
}

.weather-form.flipped .weather-content.flipped {
  transform: rotateY(180deg);
}

.weather-front, .weather-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.weather-front {
  background: linear-gradient(0deg,#389466,#42b883);
  color: white;
}

.city-name {
  position: absolute;
  font-size: 1.5em;
  top: 15%;
  left: 5%;
  font-weight: normal;
}

.city-temp {
  position: absolute;
  top: 10%;
  left: 70%;
}

.city-icon {
  position: absolute;
  top: 50%;
  left: 10%;
}

.city-condition {
  position: absolute;
  top: 50%;
  font-size: 20px;
  left: 33%;
}

.weather-back {
  background: linear-gradient(0deg,#389466,#42b883);
  color: white;
  transform: rotateY(180deg);
}

.weather-back h1 {
  font-size: 20px;
}

.change-city {
  border-radius: 5px;
  border: none;
  padding: 5px;
}

.button-update {
  position: absolute;
  top: 70%;
  left: 10%;
  background: #212529;
  width: 100px;
  height: 40px;
  color: white;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.button-update:hover {
  background: #343a40;
}

.button-delete {
  position: absolute;
  top: 70%;
  left: 55%;
  background: #212529;
  width: 100px;
  height: 40px;
  color: white;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.button-delete:hover {
  background: rgba(255, 0, 0, 0.646);
}

</style>