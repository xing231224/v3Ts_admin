<!--
 * @Author: your name
 * @Date: 2022-03-16 15:54:10
 * @LastEditTime: 2022-03-30 11:30:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\components\Tabs.vue
-->
<template>
    <div class="flex-col">
        <!-- round -->
        <div :class="`tabbed  ${color ? `skin-${color}` : ''} flex-sb`">
            <ul>
                <li
                    v-for="(item, index) in dataList"
                    :key="index"
                    :class="item.name === tabActive ? 'active' : ''"
                    @click="changeTab(item.name)"
                >{{ item.label }}</li>
            </ul>
            <div class="juz">
                <slot name="headerRight"></slot>
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
import { ColorType, slotType, arrList } from './index';

const props = defineProps({
    modelValue: String,
    color: String as () => ColorType,
});
const Router = useRouter();
const slot = useSlots() as any;

const emit = defineEmits(['update:modelValue', 'change']);

const slotList = slot.default() as Array<slotType>;

const dataList = reactive(
    slotList[0].children.filter((item: { props: any }) => item.props).map((item: { props: any }) => item.props),
) as Array<arrList>;

const tabActive = ref(dataList[0].name);
provide('tabActive', tabActive);

// tab 切换
const changeTab = (name: string) => {
    tabActive.value = name;
    emit('update:modelValue', tabActive.value);
    emit('change', tabActive.value);
    Router.push('/mirandaIM');
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/tabs.css";
</style>
