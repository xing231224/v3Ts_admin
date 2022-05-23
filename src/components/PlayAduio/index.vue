<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-05-12 15:32:18
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-05-23 16:55:10
 * @FilePath: \v3ts_admin\src\components\PlayAduio\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="weixinAudio" @click="playing">
        <audio :ref="'media_' + keys" class="media_audio" :src="url" width="1" height="1"></audio>
        <span :class="isPlaying ? 'db audio_area playing' : 'db audio_area'">
            <span class="audio_wrp db">
                <span class="audio_play_area">
                    <i class="icon_audio_default"></i>
                    <i class="icon_audio_playing"></i>
                </span>
                <span id="audio_length" class="audio_length tips_global juz">{{ audioInfo.audioTime }}</span>
                <span v-if="isTile" class="db audio_info_area">
                    <strong class="db audio_title">Title/标题</strong>
                    <span class="audio_source tips_global">From/来源</span>
                </span>
                <span id="audio_progress" class="progress_bar" style="width: 0%"></span>
            </span>
        </span>
    </div>
</template>

<script setup lang="ts">
const { proxy } = getCurrentInstance() as any;
const props = defineProps({
    keys: {
        type: String || Number,
        required: true,
    },
    isTile: {
        type: Boolean,
        default: false,
    },
    url: {
        type: String,
        required: true,
    },
    isPlay: {
        type: Boolean,
        default: false,
    },
});
interface audioInfoT {
    audio: HTMLAudioElement;
    minutes: string | number;
    seconds: string | number;
    audioTime: string | number;
}
const state = reactive({
    isPlaying: false,
    audioInfo: {} as audioInfoT,
    timer: '' as any,
    // 获取时间秒
    getAudioSeconds: (time: number) => {
        return Number(state.addZero(Math.floor(time % 60), 2)) < 60 ? state.addZero(Math.floor(time % 60), 2) : '00';
    },
    // 获取时间分
    getAudioMinutes(time: number) {
        return Number(state.addZero(Math.floor(time % 60), 2)) ? state.addZero(Math.floor(time / 60), 2) : '00';
    },
    // 时间+0
    addZero(word: string | number | any[], howManyZero: number) {
        let words = String(word);
        while (words.length < howManyZero) words = `0${words}`;
        return words;
    },
});
watchEffect(() => {
    state.isPlaying = props.isPlay;
});
const playing = () => {
    Array.from(document.getElementsByClassName('audio_area')).forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.className = 'db audio_area';
    });
    state.isPlaying = !state.isPlaying;
    nextTick(() => {
        if (state.isPlaying) {
            Array.from(document.getElementsByClassName('media_audio')).forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                (item as HTMLAudioElement).currentTime = 0;
                (item as HTMLAudioElement).pause();
            });
            state.audioInfo.audio.play();
            state.timer = setInterval(() => {
                const stime = state.audioInfo.audio.duration - state.audioInfo.audio.currentTime;
                state.audioInfo.audioTime = `${state.getAudioMinutes(stime)}:${state.getAudioSeconds(stime)}`;
                if (stime == 0) {
                    clearInterval(state.timer);
                    state.audioInfo.audioTime = `${state.getAudioMinutes(
                        state.audioInfo.audio.duration,
                    )}:${state.getAudioSeconds(state.audioInfo.audio.duration)}`;
                }
            }, 250);
        } else {
            state.audioInfo.audio.pause();
        }
    });
};
onMounted(() => {
    nextTick(() => {
        const audio = proxy.$refs[`media_${props.keys}`] as HTMLAudioElement;
        audio.addEventListener('canplay', () => {
            state.audioInfo = {
                audio,
                minutes: state.getAudioMinutes(audio.duration),
                seconds: state.getAudioSeconds(audio.duration),
                audioTime: `${state.getAudioMinutes(audio.duration)}:${state.getAudioSeconds(audio.duration)}`,
            };
        });
    });
});
const { isPlaying, audioInfo } = toRefs(state);
</script>

<style lang="scss" scoped>
.db {
    display: block;
}

.weixinAudio {
    min-width: 120px;
    line-height: 1.5;
    cursor: pointer;
}
.audio_area {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    margin: 0px 1px 0px 0;
    font-size: 0;
    position: relative;
    font-weight: 400;
    text-decoration: none;
    -ms-text-size-adjust: none;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
}

.audio_wrp {
    display: flex;
    border: 1px solid #ebebeb;
    background-color: #fcfcfc;
    overflow: hidden;
    justify-content: space-between;
    padding: 5px 10px;
}

.audio_play_area {
    font-size: 0;
    width: 18px;
    height: 25px;
    transform: scale(0.9);
    margin-right: 20px;
}

.playing .audio_play_area .icon_audio_default {
    display: block;
}

.audio_play_area .icon_audio_default {
    background: transparent url(../../assets/iconloop.png) no-repeat 0 0;
    width: 18px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 54px 25px;
    background-size: 54px 25px;
    background-position: -36px center;
}

.audio_play_area .icon_audio_playing {
    background: transparent url(../../assets/iconloop.png) no-repeat 0 0;
    width: 18px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 54px 25px;
    background-size: 54px 25px;
    -webkit-animation: audio_playing 1s infinite;
    background-position: 0px center;
    display: none;
}

.audio_area .pic_audio_default {
    display: none;
    width: 18px;
}

.tips_global {
    color: #8c8c8c;
}

.audio_area .audio_length {
    font-size: 12px;
}

.audio_info_area {
    overflow: hidden;
}

.audio_area .audio_title {
    font-weight: 400;
    font-size: 17px;
    margin-top: -2px;
    margin-bottom: -3px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
}

.audio_area .audio_source {
    font-size: 14px;
}

.audio_area .progress_bar {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #0cbb08;
    height: 2px;
}

.playing .audio_play_area .icon_audio_default {
    display: none;
}

.playing .audio_play_area .icon_audio_playing {
    display: inline-block;
}

@-webkit-keyframes audio_playing {
    30% {
        background-position: 0px center;
    }
    31% {
        background-position: -18px center;
    }
    61% {
        background-position: -18px center;
    }
    61.5% {
        background-position: -36px center;
    }
    100% {
        background-position: -36px center;
    }
}
</style>
