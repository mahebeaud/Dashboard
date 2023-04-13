<template>
    <link href='https://unpkg.com/css.gg@2.0.0/icons/css/menu.css' rel='stylesheet'>
    <link href='https://unpkg.com/css.gg@2.0.0/icons/css/arrow-right-r.css' rel='stylesheet'>
    <Draggable>
        <div class="reddit-form" :class="{flipped: isFlipped}">
        <div class="reddit-content" :class="{flipped: isFlipped}">
          <div class="reddit-front">
            <div class="icon-menu" @click="toogleRotation">
              <i class="gg-menu"></i>
            </div>
            <h1 class="reddit-tittle">Subreddit: r/{{ this.subreddit }}</h1>
            <h1 class="reddit-last-post">{{ this.nbrPosts }} posts </h1>
            <div class="separater"></div>
            <ul class="reddit-post">
              <li v-for="(p, index) in post" :key="index" style="padding-bottom: 15px">
                {{ p }}
              </li>
            </ul>
          </div>
          <div class="reddit-back">
            <div class="icon-menu">
              <i class="gg-arrow-right-r" @click="toogleRotation"></i>
            </div>
            <h1>Change Subreddit</h1>
            <p>Current suberreddit: {{ this.redditList.subreddit }}</p>
            <input class="change-video" type="text" placeholder="New subreddit..." v-model="this.newSubReddit">
            <input class="change-n-post" type="number" placeholder="How much post ?" v-model="this.newNbrPosts">
            <button class="button-update" @click="updateSubReddit(); toogleRotation(); fetchData()">Update widget</button>
            <button class="button-delete" @click="deleteWidget">Delete widget</button>
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
  name: 'RedditWidget',
    props: {
      redditList: {
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
        post: [],
        subPP: '',
        subreddit: '',
        nbrPosts: 0,
        currentIdWidget: 0,
        newSubReddit: '',
        newNbrPosts: 0,
        isFlipped: false,
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        const subreddit = this.redditList.subreddit;
        const numPosts = this.redditList.nbrPosts;
        this.nbrPosts = numPosts;
        try {
          const res = await axios.get(`https://www.reddit.com/r/${subreddit}/new/.json?limit=${numPosts}`);
          const data = res.data.data.children;
          if (data) {
            this.subPP = data[0].data.thumbnail;
            this.subreddit = data[0].data.subreddit;
            for (let i = 0; i < data.length; i++)
              this.post.push(data[i].data.title);
          }
        } catch (err) {
          console.log(err);
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
      async updateSubReddit() {
        this.redditList.subreddit = this.newSubReddit;
        this.redditList.numPosts = this.newNbrPosts;
        await this.getWidgetId();
        try {
          await axios.put(`http://localhost:8080/api/service/widgets/${this.id}`, {
            widgetId: this.currentIdWidget,
            params: {
              name: this.newSubReddit,
              nbrPosts: this.newNbrPosts,
            }
          }, {
            headers: {
              'Authorization': this.$store.state.bearer,
            },
          }).then((res) => {
            location.reload();
            }).catch((err) => {
              console.log(err);
            });
          } catch (error) {
            console.log(error);
          }
        this.newSubReddit = '';
        this.newNbrPosts = 0;
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
      setInterval(() => {this.fetchData()},  300000); // reset all 5 minutes
    }
});

</script>

<style scoped>

.reddit-form {
  background-color: transparent;
  width: 430px;
  height: 240px;
  perspective: 1000px;
}

.reddit-content {
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

.reddit-form.flipped .reddit-content.flipped {
  transform: rotateY(180deg);
}

.reddit-front, .reddit-back {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  display: inline-block;
  border-radius: 15px;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.reddit-front {
  background: linear-gradient(0deg,#389466,#42b883);
  overflow-y: scroll;
  color: white;
}

.reddit-tittle {
  font-size: 20px;
  position: absolute;
  top: 3%;
  background-color: orange;
  border-radius: 5px;
  left: 3%;
}

.reddit-last-post {
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  top: 8%;
  left: 70%;
}

.reddit-post {
  position: absolute;
  top: 30%;
  left: 3%;
  font-size: 15px;
  list-style: decimal;
  margin-right: 8%;
}

.reddit-back {
  background: linear-gradient(0deg,#389466,#42b883);
  color: white;
  transform: rotateY(180deg);
}

.reddit-back h1 {
  font-size: 20px;
}

.change-video {
  position: absolute;
  border-radius: 5px;
  border: none;
  padding: 5px;
  left: 27%;
}

.change-n-post {
  border-radius: 5px;
  border: none;
  padding: 5px;
  position: absolute;
  left: 27%;
  top: 59%;
}

.button-update {
  position: absolute;
  top: 80%;
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
  top: 80%;
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

.separater {
  position: absolute;
  top: 20%;
  width: 80%;
  left: 9.5%;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  margin: 0.9em 0;
}

</style>