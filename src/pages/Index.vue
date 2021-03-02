<template>
  <q-page class="wrap_bg flex flex-center" :class="isFocusing?'wrap_bg':'wrap_bg2'" style="min-height:50px;">
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
      <div class="col" @click="tools.sendIpcMsg('window-close')">quit</div>
      <div class="col" @click="tools.sendIpcMsg('window-min')">minisize</div>
      <div class="col" @click="setIsCfg">config</div>
      <div class="col" @click="stopTime">stop</div>
      <div class="col" @click="handleTimeEnd">relax</div>
      <div class="col" @click="timeStart">start</div>
    </div>
    <div v-if="cfg.cfgIng" class="cfg_panel fixed-center column justify-around">
      <q-input
        @click.stop=""
        v-model="cfg.attentionTime"
        type="text"
        label="专注时长"
        suffix="分钟"
        color="green"
        class="text-green q-mx-md"
      />
      <q-input
        @click.stop=""
        v-model="cfg.relaxTime"
        type="text"
        label="休息时长"
        suffix="分钟"
        color="green"
        class="text-green q-mx-md"
      />
      <div class="return row items-center justify-center q-mr-md" @click="setIsCfg">完成</div>
    </div>
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
  created() {
    let cacheData = localStorage.getItem("cacheCfg");
    if (cacheData) {
      this.cfg = JSON.parse(cacheData);
    }
  },
  methods: {
    setIsCfg() {
      const NEW_VAL = !this.cfg.cfgIng;
      this.cfg.cfgIng = NEW_VAL;
      if (!NEW_VAL) {
        let data = JSON.stringify(this.cfg);
        localStorage.setItem("cacheCfg", data);
      }
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
        this.stopTime();
      }
    },
    stopTime() {
      this.second = 0;
      clearInterval(this.intervalId);
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
          formatBit(Math.floor(min / 60)) + " " + formatBit(time % 60);
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
  color: rgba(235,235,235,.35)
.relax_status
  color: rgba(135,255,234,.4)
  text-shadow: 0px 1px 5px rgba(0,0,0,.5)
  
  // color: rgba(135,215,134,.3)
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

.cfg_panel
  z-index: 1005
  width: 80vw
  height: 80vh
  background: rgba(255,255,255,.4)
  border-radius: 15px
  .return
    align-self: flex-end
    opacity: .7
    font-size: 14px
    width: 70px
    height: 30px
    background: #000
    border-radius: 4px
    color: white
.wrap_bg,.wrap_bg2
  background-repeat: no-repeat
  background-size: 100% 100%

.wrap_bg
  background-image: url("../statics/bg/15.png")
.wrap_bg2
  background-image: url("../statics/bg/28.png")
</style>
