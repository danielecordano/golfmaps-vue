<template>
  <GmapMap
    :center="center"
    :zoom="17"
    map-type-id="satellite"
    :options="{
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: true,
      rotateControlOptions: {
        position: 7,
      },
      fullscreenControl: false,
      gestureHandling: 'greedy',
    }"
    ref="map"
    id="map"
    @click="$emit('map-clicked', $event)"
  >
    <Hole
      v-for="(hole, i) in holes"
      :key="i"
      :isSelected="selected === i"
      :isImperial="isImperial"
      :index="i"
      :path="hole"
      @path-changed="$emit('path-changed', { path: $event, index: i })"
      @path-clicked="$emit('path-clicked', { event: $event, index: i })"
    />
  </GmapMap>
</template>

<script >
import Hole from "./Hole";
export default {
  name: "Course",
  props: {
    isImperial: Boolean,
    holes: Array,
    selected: Number,
    center: Object,
  },
  data() {
    return {};
  },
  watch: {
    selected: function () {
      if (this.holes[this.selected][0]) {
        const map = this.$refs.map;
        map.panTo(this.holes[this.selected][0]);
      }
    },
  },
  emits: ["pathChanged", "pathClicked", "mapClicked"],
  components: {
    Hole,
  },
};
</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>