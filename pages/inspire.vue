<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="redirectToAccueil" color="primary" class="mx-auto">
          Load
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text v-for="(line, key) in subtitleLines" :key="key"
            :class="{ 'active': activeIndex === key, 'arabic': isArabic(line.text) }">
            <v-btn @click="updateTheTime(key)" class="bigger-font no-style typewrite">{{ line.text }}</v-btn>
          </v-card-text>
          <v-card-text>
            {{ activeIndex }}
          </v-card-text>
        </v-card>
        <audio ref="audio" controls @timeupdate="updateTime">
          <source src="tmp/test.mp3" type="audio/mpeg">
          <source src="tmp/test.ogg" type="audio/ogg">
          <source src="tmp/test.wav" type="audio/wav">
          Your browser does not support the audio element.
        </audio>
      </v-col>
    </v-row>

  </v-container>
</template>
<script>
export default {
  data() {
    return {
      audioFile: null,
      currentTime: "",
      subtitleLines: [],
      activeIndex: 0,
      subtitleFile: null,
    };
  },
  beforeMount() {
    this.fetchSrt()
  },
  methods: {
    isArabic(text) {
      var arabic = /[\u0600-\u06FF]/;
      return (arabic.test(text));
    },
    isNumeric(num) {
      return !isNaN(num)
    },
    fetchSrt() {
      try {
        fetch("tmp/test.srt")
          .then(res => res.text())
          .then(text => {
            // Split the contents into lines
            const lines = text.split("\n");
            let key = undefined;
            let lineObject = {}
            // Filter out the lines that contain timecodes
            lines.map(line => {
              if (line.includes("-->")) {
                key = line
              } else {
                if (this.isNumeric(line)) {
                  line = ""
                }
                if (lineObject.hasOwnProperty(key)) {
                  lineObject[key].push(line)
                }
                else {
                  lineObject[key] = [line]
                }

              }
            });
            for (const [key, value] of Object.entries(lineObject)) {
              if (key.includes("-->")) {
                this.subtitleLines.push({
                  start: key.split(" --> ")[0],
                  end: key.split(" --> ")[1],
                  text: value.join("\n")
                })
              }
            }
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
    ,
    redirectToAccueil() {
      this.$router.push('/')
    },
    updateTime() {
      this.currentTime = this.$refs.audio.currentTime;
      this.subtitleLines.map((subtitle, index) => {
        if (this.currentTime >= this.timeInSeconds(subtitle.start) && this.currentTime <= this.timeInSeconds(subtitle.end)) {
          this.activeIndex = index
        }
      });
    },
    updateTheTime(key) {
      key = Number(key)
      let time = this.subtitleLines
        && this.subtitleLines[key]
        && this.subtitleLines[key]["start"]
        ? this.timeInSeconds(this.subtitleLines[key]["start"])
        : this.timeInSeconds("00:00:00,00")
      if (this.subtitleLines
        && this.subtitleLines[key]
        && this.subtitleLines[key]["start"]) {
        console.log(time)
        this.$refs.audio.currentTime = time
        this.$refs.audio.play();
      }
    },
    timeInSeconds(time) {
      const [hours, minutes, seconds] = time.split(':')
      return (parseInt(hours, 10) * 3600) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10)
    }
  }
};
</script>

<style>
.active {
  background: red;
}

.bigger-font {
  font-size: 2em !important;
}

.no-style {
  background-color: transparent !important;
  border: none;
  box-shadow: none;
}

.arabic {
  text-align: right;
}

</style>
