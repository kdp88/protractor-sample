import {browser, ElementFinder} from 'protractor';
import * as fs from 'file-system';

const _chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const _nextId = [0];
let startTime, endTime;

export class Utils {
    static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static async clearSessionStorage() {
        return browser.executeScript('window.sessionStorage.clear();');
    }

    static generateGuid() {
        let dt = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (g) {
            // tslint:disable-next-line:no-bitwise
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            // tslint:disable-next-line:no-bitwise
            return (g === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /**
     * add the following method anywhere you want to create a screenshot
     * during the workflow of a running spec
     *
     * Ex:
     await browser.takeScreenshot().then((png) => {
             Utils.writeScreenShot(png, `inProgressScreenshot.png`);
           });
     *
     * this writes the screenshot in root of the repo
     * @param data
     * @param filename
     */
    static writeScreenShot(data, filename) {
        const stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    }

    static async clearLocalStorage() {
        return browser.executeScript('window.localStorage.clear();');
    }

    static async deleteAllCookies() {
        return browser.driver.manage().deleteAllCookies();
    }

    static createUSAPostalCode() {
        const sizeOfString = 5; // the size of string
        const charset = '0123456789'; // from where to create
        let result = '';
        for (let i = 0; i < sizeOfString; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
        // console.log(result);
        return result;
    }

    /**
     * currently hardcoded invoice due to case requirements, but that can change
     * @param location Ex: Hamilton, NJ
     * translations found in ./data/document-history-usps-scanned-history.ts
     */
    static createUspsScannedEventValue(location: string) {
        return `USPS Scan Invoice in ${location}`;
    }

    static start() {
        startTime = new Date();
    }

    static end() {
        endTime = new Date();
        // console.log(`${endTime - startTime}ms`);
        return endTime - startTime;
    }

    /**
     * 0 thru 10
     */
    static async setWindowSize(number) {
        switch (number) {
            case 0:
                await browser.manage().window().maximize();
                break;
            case 1:
                await browser.manage().window().setSize(1024, 768);
                break;
            case 2:
                await browser.manage().window().setSize(1280, 800);
                break;
            case 3:
                await browser.manage().window().setSize(1280, 1024);
                break;
            case 4:
                await browser.manage().window().setSize(1366, 768);
                break;
            case 5:
                await browser.manage().window().setSize(1440, 900);
                break;
            case 6:
                await browser.manage().window().setSize(1680, 1050);
                break;
            case 7:
                await browser.manage().window().setSize(1600, 1200);
                break;
            case 8:
                await browser.manage().window().setSize(1920, 1200);
                break;
            case 9:
                await browser.manage().window().setSize(1920, 1080);
                break;
            case 10:
                await browser.manage().window().setSize(2048, 1536);
                break;
            default:
                return;
        }
    }

    static async slowType(keys, delay) {
        for (let i = 0; i < keys.length; i++) {
            await browser.actions().sendKeys(keys[i]).perform();
            await browser.driver.sleep(delay);
        }
    }


    /**
     * Instruct webdriver to wait until Angular has finished rendering and has no outstanding
     * $http or $timeout calls before continuing
     * @returns {Promise<any>}
     */
    async waitForAngularComplete() {
        return browser.waitForAngular();
    }
}
