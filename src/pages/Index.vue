<template>
  <q-page class="flex flex-center bg-black" style="min-height:50px;">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    > -->
    <div
      class="num_time font-din row items-center justify-center"
      :class="{ relax_status: !isFocusing }"
    >
      {{ timeFm || "00:00" }}
    </div>
    <div class="btn_wrap row justify-between items-center">
      <div class="col-6" @click="setIsCfg">config</div>
      <div class="col-6" @click="timeStart">start</div>
    </div>
    <!-- <div class="cfg_panel">
      <q-input v-model="text" type="text" label="Label" />
    </div> -->
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      isFocusing: false,
      second: 0,
      intervalId: null,
      cfg: {
        // minute
        relaxTime: 8,
        attentionTime: 25,
        cfgIng: false
      }
    };
  },
  computed: {
    timeFm() {
      let { second } = this;
      return this.formatTime(second);
    }
  },
  methods: {
    setIsCfg() {
      this.cfg.cfgIng = !this.cfg.cfgIng;
    },
    timeStart() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.second = this.cfg.attentionTime * 60;
      this.isFocusing = true;
      this.startTimeInterval();
    },
    startTimeInterval() {
      this.intervalId = setInterval(() => {
        let newVal = this.second - 3;

        if (newVal > 0) {
          this.second = newVal;
          return;
        }
        this.handleTimeEnd();
      }, 3000);
    },
    handleTimeEnd() {
      const IS_START_RELAX = this.isFocusing;
      if (IS_START_RELAX) {
        this.second = this.cfg.relaxTime * 60;
        this.isFocusing = false;
      } else {
        this.second = 0;
        clearInterval(this.intervalId);
      }
    },
    formatTime(second) {
      function formatBit(val) {
        val = +val;
        return val > 9 ? val : "0" + val;
      } // 秒转时分秒，求模很重要，数字的下舍入
      function formatSeconds(time) {
        let min = Math.floor(time % 3600);
        let val =
          // formatBit(Math.floor(time / 3600)) +
          // ":" +
          formatBit(Math.floor(min / 60)) + ":" + formatBit(time % 60);
        return val;
      } // 定时器
      return formatSeconds(second);
    }
  }
};
</script>
<style scoped lang="sass">
.num_time
  width: 100%
  height: 100%
  font-size: 200px
  color: rgba(255,255,255,.3)
.relax_status
  color: rgba(135,255,234,.2)
.btn_wrap
  position: absolute
  bottom: 0
  // border-top: 2px solid rgba(255,0,0,.2)
  width: 100vw
  z-index: 999
  height: 50px
  // background: white
  div
    color: rgba(255,255,255,.1)
    text-align: center
</style>
