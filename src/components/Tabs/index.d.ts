/*
 * @Author: your name
 * @Date: 2022-03-18 14:45:42
 * @LastEditTime: 2022-03-18 17:16:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\components\Tabs\index.d.ts
 */
export type ColorType =
    'turquoise'
    | 'emerald'
    | 'peter-river'
    | 'amethyst'
    | 'wet-asphalt'
    | 'sun-flower'
    | 'carrot'
    | 'alizarin'
    | 'graphite'
    | 'concrete'
    | 'green-sea'
    | 'nephritis'
    | 'belize-hole'
    | 'wisteria'
    | 'midnight-blue'
    | 'orange'
    | 'pumpkin'
    | 'pomegranate'
    | 'silver'
    | 'asbestos'
    | 'dodgerblue'
    | 'gray-black'
    | 'black-glass' | undefined;

export interface slotType {
    props: object;
    [propName: string]: any;
}

export interface arrList {
    name: string;
    label: string;
    [propName: string]: any;
}