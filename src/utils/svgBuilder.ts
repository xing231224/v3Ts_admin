/* eslint-disable no-restricted-syntax */
/*
 * @Author: your name
 * @Date: 2022-03-23 14:59:41
 * @LastEditTime: 2022-05-31 16:26:09
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\svgBuilder.ts
 */
import { readFileSync, readdirSync, PathLike } from 'fs'

let idPerfix = ''
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile(dir: PathLike): string[] {
    const svgRes = []
    const dirents = readdirSync(dir, {
        withFileTypes: true
    })
    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            svgRes.push(...findSvgFile(`${dir + dirent.name}/`))
        } else {
            const svg = readFileSync(dir + dirent.name)
                .toString()
                .replace(clearReturn, '')
                .replace(svgTitle, ($1, $2) => {
                    let width = 0
                    let height = 0
                    let content = $2.replace(clearHeightWidth, (s1: any, s2: string, s3: number) => {
                        if (s2 === 'width') {
                            width = s3
                        } else if (s2 === 'height') {
                            height = s3
                        }
                        return ''
                    })
                    if (!hasViewBox.test($2)) {
                        content += `viewBox="0 0 ${width} ${height}"`
                    }
                    return `<symbol id="${idPerfix}-${dirent.name.replace('.svg', '')}" ${content}>`
                })
                .replace('</svg>', '</symbol>')
            svgRes.push(svg)
        }
    }
    return svgRes
}

// eslint-disable-next-line import/prefer-default-export
export const svgBuilder = (path: PathLike, perfix = 'icon') => {
    if (path === '') return
    idPerfix = perfix
    const res = findSvgFile(path)

    return {
        name: 'svg-transform',
        transformIndexHtml(html: string) {
            return html.replace(
                '<body>',
                `
          <body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
              ${res.join('')}
            </svg>
        `
            )
        }
    }
}
