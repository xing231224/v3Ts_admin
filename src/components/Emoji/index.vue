<!--
 * @Author: your name
 * @Date: 2022-03-30 15:48:12
 * @LastEditTime: 2022-06-15 14:34:20
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\components\Emjoy\index.vue
-->
<template>
    <div class="emojisList">
        <span
            v-for="item in emojisList"
            :key="item.value"
            :class="`chat-emoji pointer ${item.value}`"
            :data-name="item.value"
            @click="submitEmo(item)"
        />
    </div>
</template>

<script setup lang="ts">
import { EmojiList } from '@/utils/emjoymethod';

const emit = defineEmits(['update:modelValue', 'click']);
interface stateType {
    emojisList: { key: string; value: string }[];
}
const state = reactive<stateType>({
    emojisList: [],
});

const submitEmo = (item: { key: string; value: string }) => {
    const obj = {
        ...item,
        html: `<span class="chat-emoji ${item.value}" data-name="${item.value}"></span>`,
    };
    emit('click', obj);
};
onMounted(() => {
    state.emojisList = EmojiList();
});
const { emojisList } = toRefs(state);
</script>

<style lang="scss" scoped>
.emojisList {
    width: 225px;
    height: 240px;
    // padding: 10px 0 10px 10px;
}
.pointer {
    cursor: pointer;
    margin: 4px;
    &:hover {
        // box-shadow: 0 1px rgba(255, 255, 255, 0.5),
        //     0 8px 13px rgba(0, 0, 0, 0.15) inset;
        transform: scale(1.2);
    }
}
</style>
