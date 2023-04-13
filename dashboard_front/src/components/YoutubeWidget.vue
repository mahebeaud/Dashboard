<template>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/eye.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/heart.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/youtube.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/user.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/menu.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/arrow-right-r.css' rel='stylesheet'>
  <Draggable>
      <div class="youtube-form" :class="{flipped: isFlipped}">
      <div class="youtube-content" :class="{flipped: isFlipped}">
        <div class="youtube-front">
          <div class="youtube-pp">
            <img :src="this.videoPP" alt="pp-youtube">
          </div>
          <div class="icon-menu" @click="toogleRotation">
            <i class="gg-menu"></i>
          </div>
          <h1 class="video-view">:{{ viewCount }}
              <i class="gg-eye" style="position: absolute; right: 105%; top: 15%"></i>
          </h1>
          <h1 class="video-like">:{{ likeCount }}
              <i class="gg-heart" style="position: absolute; top: 30%; right: 115%;"></i>
          </h1>
          <h1 class="channel-name">:{{ channelName }}
            <i class="gg-user" style="position: absolute; top: 6%; right: 107%;"></i>
          </h1>
          <h1 class="video-name">{{ videoName }}</h1>
          <i class="gg-youtube" style="position: absolute; top: 72.5%; left: 3.5%;"></i>
        </div>
        <div class="youtube-back">
          <div class="icon-menu">
            <i class="gg-arrow-right-r" @click="toogleRotation"></i>
          </div>
          <h1>Change Youtube video</h1>
          <p>Current VideoID: {{ this.videoList.videoId }}</p>
          <input class="change-video" type="text" placeholder="New videoID..." v-model="newVideo">
          <button class="button-update" @click="updateVideo(); toogleRotation()">Update video</button>
          <button class="button-delete" @click="deleteWidget">Delete Widget</button>
        </div>
      </div>
    </div>
  </Draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { Draggable } from '@braks/revue-draggable';

export default defineComponent({
  name: 'YoutubeWidget',
    props: {
      videoList: {
        type: Object,
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
        viewCount: 0,
        videoName:'',
        videoComment:'',
        videoPP:'',
        channelId:'',
        likeCount: 0,
        channelName: '',
        newVideo: '',
        currentIdWidget: 0,
        isFlipped: false,
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        const videoId = this.videoList.videoId;
        if (videoId === "") {
          return;
        }
        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=<YOUR_YOUTUBE_API_KEY>&part=statistics%2Csnippet`)
        .then((res) => {
          const nbr = res.data.items[0].statistics.viewCount;
          this.videoPP = res.data.items[0].snippet.thumbnails.standard.url;
          this.videoName = res.data.items[0].snippet.title;
          this.likeCount = res.data.items[0].statistics.likeCount;
          this.channelName = res.data.items[0].snippet.channelTitle;
          this.viewCount = nbr.toLocaleString();
        }).catch((err) => {
          console.log(err);
        })
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
    async updateVideo() {
        this.videoList.videoId = this.newVideo;
        await this.getWidgetId();
      try {
            await axios.put(`http://localhost:8080/api/service/widgets/${this.id}`, {
            widgetId: this.currentIdWidget,
            params: {
                name: this.newVideo,
            }
            }, {
            headers: {
                'Authorization': this.id,
            },
        }).then((res) => {
            }).catch((err) => {
            console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
      this.newVideo = '';
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
      setInterval(() => {this.fetchData()},  1000); // reset every 60 seconds
    }
});

</script>

<style scoped>

.youtube-form {
  background-color: transparent;
  width: 410px;
  height: 240px;
  perspective: 1000px;
}

.youtube-content {
  position: relative;
  width: 100%;
  height: 100%;
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

.youtube-form.flipped .youtube-content.flipped {
  transform: rotateY(180deg);
}

.youtube-front, .youtube-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  text-align: center;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.youtube-front {
  background: linear-gradient(0deg,#389466,#42b883);
  color: white;
  overflow-y: scroll;
}

.video-name {
  position: absolute;
  text-align: left;
  font-size: 20px;
  top: 64%;
  left: 12%;
  font-weight: normal;
}

.video-like {
  font-size: 20px;
  position: absolute;
  top: 5%;
  left: 65%;
}

.video-view {
  font-size: 20px;
  position: absolute;
  top: 22%;
  left: 65%;
}

.channel-name {
  text-align: left;
  position: absolute;
  top: 40%;
  font-size: 20px;
  left: 65%;
}

.youtube-pp img {
  height: auto;
  border-radius: 5px;
  width: 150px;
  position: absolute;
  top: 10%;
  right: 54%;
}

.youtube-back {
  background: linear-gradient(0deg,#389466,#42b883);
  color: white;
  transform: rotateY(180deg);
}

.youtube-back h1 {
  font-size: 20px;
}

.change-video {
  border-radius: 5px;
  border: none;
  padding: 5px;
}

.button-update {
  position: absolute;
  top: 65%;
  left: 20%;
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
  top: 65%;
  left: 60%;
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