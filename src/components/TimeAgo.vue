<template> 
    <span :title="timeAgo">
      {{timeAgo}}
    </span>
</template>
<script>
import { parseISO, formatDistanceToNow } from 'date-fns';
export default {
  name: "TimeAgo",
  props: {
    timestamp: String,
  },
  data() {
    return {};
  },
  computed: {
    timeAgo() {
      const time = parseISO(this.timestamp);
      const timePeriod = formatDistanceToNow(time);
      const timeAgo = `${timePeriod} ago`;
      return timeAgo;
    },
  }
};
</script>
