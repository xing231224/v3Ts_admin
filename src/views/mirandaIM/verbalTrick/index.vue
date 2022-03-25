<!--
 * @Author: your name
 * @Date: 2022-03-25 10:42:04
 * @LastEditTime: 2022-03-25 17:08:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\verbalTrick\index.vue
-->
<template>
    <!-- vue3页面 -->
    <div class="verbal_header flex-sb">
        <div class="flex-sa" style="flex: .5;">
            <div class="juz active">
                <i-ph-folder-notch-open class="wh_30" />
            </div>
            <div class="juz">
                <i-icon-park-outline-people-speak class="wh_16" />
            </div>
            <div class="juz">
                <i-gis-search-attribtues class="wh_16" />
            </div>
        </div>
        <div class="juz">
            <i-teenyicons-double-caret-right-outline class="wh_16" />
        </div>
    </div>
    <div style="--el-color-primary:#F39C12">
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane label="公司话术" name="first">
                <div class="verbal_Tree">
                    <el-input
                        v-model="input2"
                        class="verbal_search"
                        placeholder="Please Input"
                        :prefix-icon="Search"
                    />
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="我的话术" name="second">Config</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'

const input2 = ref('')
const activeName = ref("first")
interface Tree {
    label: string
    children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
    console.log(data)
}

const data: Tree[] = [
    {
        label: 'Level one 1',
        children: [
            {
                label: 'Level two 1-1',
                children: [
                    {
                        label: 'Level three 1-1-1',
                    },
                ],
            },
        ],
    },
    {
        label: 'Level one 2',
        children: [
            {
                label: 'Level two 2-1',
                children: [
                    {
                        label: 'Level three 2-1-1',
                    },
                ],
            },
            {
                label: 'Level two 2-2',
                children: [
                    {
                        label: 'Level three 2-2-1',
                    },
                ],
            },
        ],
    },
    {
        label: 'Level one 3',
        children: [
            {
                label: 'Level two 3-1',
                children: [
                    {
                        label: 'Level three 3-1-1',
                    },
                ],
            },
            {
                label: 'Level two 3-2',
                children: [
                    {
                        label: 'Level three 3-2-1',
                    },
                ],
            },
        ],
    },
]

const defaultProps = {
    children: 'children',
    label: 'label',
}
</script>

<style lang='scss' scoped>
.verbal_header {
    padding: 10px 20px;
    border-bottom: 1px solid #e5e7eb;
    height: 45px;
    .active {
        color: #f39c12;
    }

    .juz {
        cursor: pointer;
    }
    .wh_30 {
        width: 30px;
        height: 30px;
    }
    .wh_16 {
        width: 16px;
        height: 16px;
    }
}
.verbal_Tree {
    padding: 0 20px;
    .verbal_search {
        margin-bottom: 10px;
    }
}
</style>