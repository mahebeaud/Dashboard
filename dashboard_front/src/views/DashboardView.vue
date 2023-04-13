<template>
  <div class="dashboard-title">
    <h1>Dashboard</h1>
  </div>
  <div class="dashboard">
    <div class="error-message" v-if="this.errReturn == 404">
        No widgets were found - Please add some widgets
    </div>
    <WidgetModal @city-choosed="cityChoosed" @youtube-id="youtubeChoosed" @subreddit="subredditChoosed"/>
    <div v-for="(city, index) in cityList" :key="index">
      <WeatherWidget :cityList="city" :index="index"/>
    </div>
    <div v-for="(video, index) in videoList" :key="index">
      <YoutubeWidget :videoList="video" :index="index"/>
    </div>
    <div v-for="(reddit, index) in redditList" :key="index">
      <RedditWidget :redditList="reddit" :index="index"/>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import YoutubeWidget from '../components/YoutubeWidget.vue';
import WeatherWidget from '../components/WeatherWidget.vue';
import WidgetModal from '../components/ServWidgetModal.vue';
import RedditWidget from '../components/RedditWidget.vue';

export default defineComponent({
    name: 'Dashboard',
    components: {
    YoutubeWidget,
    WeatherWidget,
    WidgetModal,
    RedditWidget
  },
    data() {
      return {
        id: this.$store.state.Id,
        bearer: this.$store.state.Bearer,
        firstname: '',
        newCity: '',
        cityList: [],
        newVideo: '',
        videoList: [],
        redditList: [],
        newReddit: '',
        errorMessage: '',
        service: '',
        errReturn: 0,
        cityId: 0,
      };
    },
    methods: {
      async cityChoosed(city) {
        const addOrNot = true;
        await this.addCity(city, addOrNot);
      },
      youtubeChoosed(videoId) {
        const addOrNot = true;
        this.addVideo(videoId, addOrNot);
      },
      subredditChoosed(newReddit, lastNPost) {
        const addOrNot = true;
        this.addSubreddit(newReddit, lastNPost, addOrNot);
      },
      addWidget() {
        this.modal = true;
      },
      async addCity(city, addOrNot) {
        const cityId = this.cityList.length;
        this.cityId = cityId;
        this.cityList.push({ id: cityId, cityName: city });
        this.service = 'weather';
        if (addOrNot) {
            await this.addWidgetsToDB(city, cityId);
        }
        this.errReturn = 0;
        return;
      },
      async addVideo(videoId, addOrNot) {
        const VideoID = this.videoList.length;
        this.videoList.push({ id: VideoID, videoId: videoId});
        this.service = 'youtube';
        if (addOrNot) {
            await this.addWidgetsToDB(videoId, VideoID);
        }
        this.errReturn = 0;
        return;
      },
      async addSubreddit(newReddit, lastNPost, addOrNot) {
        const redditID = this.redditList.length;
        this.redditList.push({ id: redditID, subreddit: newReddit, nbrPosts: lastNPost});
        this.service = 'reddit';
        if (addOrNot) {
            await this.addWidgetsToDB(newReddit, redditID, lastNPost);
        }
        this.errReturn = 0;
        return;
      },
      async addWidgetsToDB(params, idWidget, lastNPost) {
        const widgetsParams = {
          name: params,
          id: idWidget,
          nbrPosts: 0,
        };
        try {
          if (this.service == 'reddit') {
            widgetsParams.nbrPosts = lastNPost;
          }
          await axios.post(`http://localhost:8080/api/service/widgets/${this.id}`, {
            headers: {
              'Authorization': this.bearer,
            },
            WidgetName: this.service,
            params: widgetsParams,
          });
        } catch (err) {
          console.log(err);
        }
      },
      async getAllWidgets() {
          await axios.get(`http://localhost:8080/api/service/widgets/all/${this.id}`, {
            headers: {
              'Authorization': this.bearer,
            },
          }).then((res) => {
            for (let x = 0; x < res.data.widgets.length; x++) {
              if (!res) {
                return;
              }
              if (res.data.widgets[x].WidgetName == "weather") {
                this.addCity(res.data.widgets[x].params[0].name, false);
                this.newCity = '';
                this.service = '';
              }
              else if (res.data.widgets[x].WidgetName == "youtube") {
                this.addVideo(res.data.widgets[x].params[0].name, false);
                this.newVideo = '';
                this.service = '';
              }
              else if (res.data.widgets[x].WidgetName == "reddit") {
                this.addSubreddit(res.data.widgets[x].params[0].name, res.data.widgets[x].params[0].nbrPosts, false);
                this.newReddit = '';
                this.service = '';
              }
            }
            this.errReturn = 0;
          }).catch((err) => {
            if (err.response.status === 404) {
              this.errReturn = err.response.status;
            } else {
              console.log(err);
            }
          });
        }
    },
    mounted() {
        if (this.errReturn === 404) {
            return;
        } else {
            this.getAllWidgets();
        }
    },
});
</script>

<style scoped>


.dashboard-title {
  margin-left: 70px;
  display: flex;
  justify-content: left;
  width: auto;
  font-size: 20px;
  padding-top: 50px;
}

.dashboard {
  display: flex;
  height: 65vh;
  padding-top: 100px;
  width: 95%;
  justify-content: start;
  border-radius: 15px;
  border : 5px solid #42b883;
}

.error-message {
  margin-left: 35%;
  color: red;
  font-weight: bold;
}

p {
  color: red;
  font-weight: bold;
  margin-left: 43%;
}

</style>