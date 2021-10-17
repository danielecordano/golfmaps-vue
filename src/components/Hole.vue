<template>
  <div>
    <GmapPolyline
      :path="path"
      :editable="isSelected"
      :options="{
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 4,
      }"
      :click="true"
      @click="$emit('path-clicked', $event)"
      :path_changed="isSelected"
      @path_changed="isSelected && $emit('path-changed', $event)"
    />
    <div v-if="isSelected">
      <GmapMarker
        :key="i"
        v-for="(vertex, i) in path"
        :position="vertex"
        :icon="{
          url:
            'https://upload.wikimedia.org/wikipedia/commons/8/8c/Transparent.png',
          scaledSize: { width: 0, height: 0 },
        }"
      >
        <GmapInfoWindow>
          <div>
            {{
              i > 0
                ? fastHaversineString(path[i], path[i - 1])
                : "Tee " + (index + 1).toFixed(0)
            }}
          </div>
        </GmapInfoWindow>
      </GmapMarker>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hole",
  props: {
    path: Array,
    isSelected: Boolean,
    index: Number,
    isImperial: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    color() {
      return this.isSelected ? "orange" : "white";
    },
  },
  methods: {
    fastHaversine: function (p1, p2) {
      const lat = this.rad(p1.lat);
      const cLat = Math.cos(lat);
      const dLat = this.rad(p2.lat - p1.lat);
      const dLong = this.rad(p2.lng - p1.lng);
      const sdLat = dLat / 2;
      const sdLong = dLong / 2;
      const a = sdLat * sdLat + cLat * cLat * sdLong * sdLong;
      const c = (2 + a) * Math.sqrt(a);
      const radius = this.isImperial ? 6975220 : 6378137;
      const r = radius * c;
      return r;
    },
    fastHaversineString: function (p1, p2) {
      const r = this.fastHaversine(p1, p2);
      const rString = r.toFixed(0) + (this.isImperial ? " yd" : " mt");
      return rString;
    },
    rad: function (x) {
      return (x * Math.PI) / 180;
    },
  },
  emits: ["pathChanged", "pathClicked"],
};
</script>

