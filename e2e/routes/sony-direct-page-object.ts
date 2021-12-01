import {browser, by, element, ElementFinder} from "protractor";
import {until} from "../lib";
const nodemailer = require('nodemailer');

export class SonyDirectPageObject {
    private sonyDirectOutOfStock: ElementFinder;
    private sonyDirectAddToCart: ElementFinder;
    private sonyDirectCaptcha: ElementFinder;
    private sonyDirectClickCaptcha: ElementFinder;
    private editAndCheckOutButton: ElementFinder;

    constructor() {
        this.sonyDirectOutOfStock = element(
            by.xpath(
                '//div[@class="productHero-info"]//div//p[@class="sony-text-body-1" and text() = "Out of Stock"]',
            ),
        );
        this.sonyDirectAddToCart = element(
            by.css(
                'div.productHero-info button',
            ),
        );
        this.sonyDirectCaptcha = element(
            by.css(
                'div.recaptcha-checkbox-border',
            ),
        );
        this.sonyDirectClickCaptcha = element(
            by.css(
                'div.recaptcha-checkbox-border',
            ),
        );
        this.editAndCheckOutButton = element(
            by.css(
                'div.mini-cart-expanded__content div.mini-cart-expanded__content-action-button',
            ),
        );
    }

    async isCaptchaVis() {
        try {
            const isPresent = await this.sonyDirectCaptcha.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.sonyDirectCaptcha.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async inQueUrlIsPresent() {
        let currentUrl: string = '';
        return currentUrl.indexOf(`https://direct-queue.playstation.com/`) !== -1;
    }

    async clickCaptchaAndHopeForTheBest() {
        return this.sonyDirectClickCaptcha.click();
    }

    async clickAddToCart() {
        await this.sonyDirectAddToCart.click();
        await browser.wait(until.presenceOf(this.editAndCheckOutButton),
            15000, 'sub car may not have loaded completely, check screenshot');
    }

    async clickEditAndCheckOut() {
        return this.editAndCheckOutButton.click();
    }

    async outOfStockVisible() {
        try {
            const isPresent = await this.sonyDirectOutOfStock.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.sonyDirectOutOfStock.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async addToCartIsVisible() {
        try {
            const isPresent = await this.sonyDirectAddToCart.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.sonyDirectAddToCart.isDisplayed();
        } catch (e) {
            return false;
        }
    }
}
