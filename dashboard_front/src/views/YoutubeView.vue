<template>
  <div>
    <h1>Youtube</h1>
    <div class="input-youtube">
      <label for="videoId">Video ID:</label>
      <input type="text" id="videoId" v-model="newVideo">
      <button @click="addVideo()">Ajouter une vidéo</button>
    </div>
    <div class="youtube-widget" v-for="(video, index) in videoList" :key="index">
        <YoutubeWidget :videoList="video"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import YoutubeWidget from '../components/YoutubeWidget.vue';

export default defineComponent({
  name: 'Name',
  components: {
    YoutubeWidget,
  },
  data() {
    return {
      newVideo: '',
      videoList: [],
      errorMessage: '',
    };
  },
  methods: {
    addVideo() {
      if (this.newVideo === "") {
        this.errorMessage = "Please enter a video ID!";
        return;
      }
      this.errorMessage = "";
      const newId = this.videoList.length ? this.videoList[this.videoList.length - 1].id + 1 : 1;
      this.videoList.push({ id: newId, videoId: this.newVideo});
      this.newVideo = '';
    },
  },
});
</script>

<style scoped>

.youtube-widget {
  width: 430px;
  height: 250px;
  border: 1px solid black;
}

</style>