const Error = require('../lib/baseClass/ErrorBase');
const ERROR_CODE = require('../../config/errorCode/sys');
const Https = require('https');
const Http = require('http');
const log = require('../lib/log');

class Game {
    static Https = Https;
    static Http = Http;

    static getTimestamp() {
        return new Date / 1e3 | 0; //當前時間戳 by Derek 朕會功夫
    }

    /** 把陣列物件順序打亂 */
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /** 取得 min ~ max 之間的整數*/
    static getRandom(min, max) {
        return Math.floor(Math.random() * max) + min;
    };

    /** 等待 x 毫秒
     * @param {int} millisec e.g. 1500 毫秒等於 1.5秒
     */
    static delay(millisec) {
        let timeout, promise;
        promise = new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                resolve('timeout done');
            }, millisec);
        });

        return {
            promise: promise,
            cancel: () => { clearTimeout(promise); }
        };
    };

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /** 陣列排序
     * @param {Int32Array} arr 
     * @param {*} key 若要排序的是物件需要比對的key
     */
    static sort(arr, key = null) {
        arr = arr.slice();
        const length = arr.length;

        // 有幾個元素，就要找幾輪的最小值
        // 這邊的 i 代表 i 以前的元素都排序好了
        for (let i = 0; i < length; i++) {

            // 先預設第一個是最小的
            let min = arr[i];
            let minIndex = i;

            // 從還沒排好的元素開始找最小值
            for (let j = i; j < length; j++) {
                if (key != null) {
                    if (arr[j][key] < min[key]) {
                        min = arr[j];
                        minIndex = j;
                    }
                } else {
                    if (arr[j] < min) {
                        min = arr[j];
                        minIndex = j;
                    }
                }
            }

            // ES6 的用法，交換兩個數值
            [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
        }
        return arr;
    }
}

module.exports = Game;