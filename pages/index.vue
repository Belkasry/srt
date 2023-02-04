<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-form>
          <v-file-input v-model="subtitleFile" label="Subtitle File" @change="uploadSubtitleFile" />
        </v-form>
      </v-col>
      <v-col cols="6">
        <v-form>
          <v-file-input v-model="audioFile" label="Audio File" @change="uploadAudioFile" />
        </v-form>
      </v-col>
      <v-col cols="12">
        <v-btn @click="redirectToInspire" color="primary" class="mx-auto">
          Read
        </v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>
<script>
export default {
  data() {
    return {
      audioFile: null,
      subtitleFile: null,
    };
  },
  methods: {
    redirectToInspire() {
      this.$router.push('/inspire')
    },
    async uploadSubtitleFile() {
      try {
        const formData = new FormData();
        formData.append('subtitleFile', this.subtitleFile);
        const res = await this.$axios.post('/api/uploadSubtitleFile', formData);
        console.log(res.data);
        this.fetchSrt()
      } catch (error) {
        console.error(error);
      }
    },
    async uploadAudioFile() {
      try {
        const formData = new FormData();
        formData.append('audioFile', this.audioFile);
        const res = await this.$axios.post('/api/uploadAudioFile', formData);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    },
  }
};
</script>
