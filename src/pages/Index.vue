<template>
  <q-page
    class="wrap_bg flex flex-center"
    style="min-height: 50px"
    :style="
      `background-image: url('http://127.0.0.1:8081/public/bg/${bgIndex}.JPG')`
    "
  >
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    > -->
    <div
      class="num_time font-din row items-center justify-center"
      :class="{ relax_status: !isFocusing }"
    >
      {{ timeFm.m || "00" }} {{ timeFm.s || "00" }}
    </div>
    <div class="btn_wrap column justify-end">
      <content class="row justify-between items-center overflow-hidden">
        <div class="col btn" @click="toPrevBgIndex">prev</div>
        <!-- <div class="col-2" @click="toPrevBgIndex">{{bgIndex}}</div> -->
        <q-input
          @click.stop=""
          v-model="bgIndex"
          type="text"
          color="green"
          class="text-black"
          style="width:50px;height:30px;font-size:20px"
        />
        <div class="col btn" @click="setNextBgIndex">next</div>
      </content>
      <content class="row justify-between items-center overflow-hidden">
        <div class="col btn" @click="tools.sendIpcMsg('window-close')">quit</div>
        <div class="col btn" @click="tools.sendIpcMsg('window-min')">mini</div>
        <div class="col btn" @click="setIsCfg">config</div>
        <div class="col btn" @click="stopTime">stop</div>
        <div class="col btn" @click="handleTimeEnd">relax</div>
        <div class="col btn" @click="timeStart">start</div>
      </content>
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
      <q-input
        @click.stop=""
        v-model="cfg.bgMaxIndex"
        type="number"
        label="图片maxIndex"
        suffix="序号"
        color="green"
        class="text-green q-mx-md"
      />
      <q-input
        @click.stop=""
        v-model="cfg.duration"
        type="number"
        label="时针变换频率"
        suffix="秒"
        color="green"
        class="text-green q-mx-md"
      />
      <div
        class="return row items-center justify-center q-mr-md"
        @click="setIsCfg"
      >
        完成
      </div>
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
        cfgIng: false,
        bgMaxIndex: 20,
        duration: 30
      },
      bgHistory: [0],
      bgIndex: 1
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
      // console.info("cache", this.cfg);
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
    toPrevBgIndex() {
      let len = this.bgHistory.length;
      this.bgIndex = this.bgHistory[len - 1];
      this.bgHistory.pop();
    },
    setNextBgIndex() {
      this.bgHistory.push(this.bgIndex);
      this.bgIndex = Math.round(this.cfg.bgMaxIndex * Math.random());
      let len = this.bgHistory.length;
      let maxHistory = 5;
      if (len == maxHistory) this.bgHistory.length.Shift;
    },
    startTimeInterval() {
      this.setNextBgIndex();
      this.intervalId = setInterval(() => {
        this.setNextBgIndex();
        let newVal = this.second - this.cfg.duration;

        if (newVal > 0) {
          this.second = newVal;
          return;
        }
        this.handleTimeEnd();
      }, this.cfg.duration * 1000);
    },
    handleTimeEnd() {
      this.setNextBgIndex();
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
      this.bgIndex = 1;
      clearInterval(this.intervalId);
    },
    formatTime(second) {
      function formatBit(val) {
        val = +val;
        return val > 9 ? val : "0" + val;
      } // 秒转时分秒，求模很重要，数字的下舍入
      function formatSeconds(time) {
        let min = Math.floor(time % 3600);
        let val = {
          m: formatBit(Math.floor(min / 60)),
          s: formatBit(time % 60)
        };
        return val;
      } // 定时器
      let res = formatSeconds(second);
      console.info({ res });
      return res;
    }
  }
};
</script>
<style lang="sass">
.num_time
  width: 100%
  // top: 30px
  bottom: 50px
  position: absolute
  font-size: 140px
  color: rgba(235,235,235,.35)
  text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2)
.relax_status
  color: rgba(135,255,234,.4)
  text-shadow: 0px 5px 8px rgba(0, 0, 0, 0.2)
  // text-shadow: 0px 1px 5px rgba(0,0,0,.7)

.btn_wrap
  position: absolute
  bottom: 0
  width: 100vw
  z-index: 999
  color: rgba(30,44,55,.3)
  input
    text-align: center !important
    color: rgba(30,44,55,.3)
  .btn
    font-weight: 600
    text-align: center
    height: 30px
  .btn:hover
    color: black
    font-size: 1.5em
    transition: all 0.5s
    background: rgba(225, 225, 225, .6)
    border-radius: 5px

.cfg_panel
  z-index: 1005
  width: 80vw
  height: 80vh
  background: rgba(255,255,255,.6)
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
  // background-size: 100% 100%
  width: 100vw
  height: 100vh

.wrap_bg

  background-position: 100% 100%
  background-size: 100% 100%
</style>
