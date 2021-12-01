import {browser, by, element, ElementFinder, protractor} from "protractor";
import {until} from "../lib";
import {By} from "selenium-webdriver";
const nodemailer = require('nodemailer');

export class WalmartPageObject {
    private walmartOutOfStock: ElementFinder;
    private walmartAddToCart: ElementFinder;
    private captcha: ElementFinder;
    private editAndCheckOutButton: ElementFinder;
    private username: ElementFinder;
    private password: ElementFinder;
    private signInButton: ElementFinder;
    private checkOutButton: ElementFinder;
    private continueCheckoutButton: ElementFinder;
    private continueCheckoutButton2: ElementFinder;
    private creditCardCVV: ElementFinder;
    private selectCreditCard: ElementFinder;
    private reviewYourOrder: ElementFinder;
    private newCaptcha: ElementFinder;

    constructor() {
        this.walmartOutOfStock = element(
            by.xpath(
                '//div[@class="productHero-info"]//div//p[@class="sony-text-body-1" and text() = "Out of Stock"]',
            ),
        );
        this.walmartAddToCart = element(
            by.css(
                'span.spin-button-children',
            ),
        );
        this.captcha = element(
            by.css(
                'div.recaptcha-checkbox-border',
            ),
        );
        this.editAndCheckOutButton = element(
            by.css(
                'div.mini-cart-expanded__content div.mini-cart-expanded__content-action-button',
            ),
        );
        this.username = element(
            by.id(
                'email',
            ),
        );
        this.password = element(
            by.id(
                'password',
            ),
        );
        this.signInButton = element(
            by.css(
                'form#sign-in-form button[data-automation-id=signin-submit-btn]',
            ),
        );
        this.checkOutButton = element(
            by.xpath(
                '//button[@data-automation-id="pac-pos-proceed-to-checkout"]//span[@class="button-wrapper" and text()="Check out"]',
            ),
        );
        this.continueCheckoutButton = element(
            by.css(
                'button[data-automation-id=fulfillment-continue]',
            ),
        );
        this.continueCheckoutButton2 = element(
            by.css(
                'button[data-automation-id=address-book-action-buttons-on-continue]',
            ),
        );
        this.creditCardCVV = element(
            by.css(
                'input[data-automation-id=cvv-verify-cc-0]',
            ),
        );
        this.selectCreditCard = element(
            by.css(
                'button[data-automation-id=payment-type-selector-CREDITCARD]',
            ),
        );
        this.reviewYourOrder = element(
            by.css(
                'button[data-automation-id=submit-payment-cc]',
            ),
        );
        this.newCaptcha = element(
            by.css(
                'div.captcha',
            ),
        );
    }

    async isCaptchaVis() {
        const currentUrl = await browser.getCurrentUrl();
        if (currentUrl.indexOf(`/blocked`) !== -1 || await this.anotherCaptchaVisible()) {
            await browser.switchTo().frame(element(by.xpath("//iframe[contains(@src,'https://www.google.com/recaptcha/')]")).getWebElement());
            try {
                const isPresent = await this.captcha.isPresent();
                if (!isPresent) {
                    return false;
                }
                return await this.captcha.isDisplayed();
            } catch (e) {
                return false;
            }
        } else {
            return;
        }
    }

    async clickCaptchaAndHopeForTheBest() {
        return this.captcha.click();
    }

    async clickAddToCart() {
        await this.walmartAddToCart.click();
        await browser.driver.sleep(1000);
    }

    async clickEditAndCheckOut() {
        return this.editAndCheckOutButton.click();
    }

    async outOfStockVisible() {
        try {
            const isPresent = await this.walmartOutOfStock.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.walmartOutOfStock.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async sendEmailUsingGmail(email: string, password:string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        });
        const mailOptions = {
            from: 'protractor@gmail.com',
            to: email,
            subject: 'PS5',
            text: 'see screenshot',
            attachments: [{
                'path': './reports/screenshots/ps5.png',
            }],
        };
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error(error);
            }
            console.log(`Mail sent: ${info.response}`);
        });
    }

    async addToCartIsVisible() {
        try {
            const isPresent = await this.walmartAddToCart.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.walmartAddToCart.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async loginScreenVisible() {
        try {
            const isPresent = await this.username.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.username.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async login(email: string, password: string) {
        await this.username.sendKeys(email);
        await this.password.sendKeys(password);
        return this.signInButton.click();
    }

    async clickCheckoutProcess(creditCardLast3CVV: string) {
        await browser.wait(until.presenceOf(this.checkOutButton),
            10000, 'checkOutButton broke');
        await this.checkOutButton.click();
        await browser.wait(until.presenceOf(this.continueCheckoutButton),
            10000, 'continueCheckoutButton broke');
        await this.continueCheckoutButton.click();
        await browser.wait(until.presenceOf(this.continueCheckoutButton2),
            10000, 'continueCheckoutButton2 broke');
        await this.continueCheckoutButton2.click();
        await browser.wait(until.presenceOf(this.selectCreditCard),
            10000, 'continueCheckoutButton2 broke');
        await this.selectCreditCard.click();
        await browser.wait(until.presenceOf(this.selectCreditCard),
            10000, 'creditCardCVV broke');
        await this.creditCardCVV.sendKeys(creditCardLast3CVV);
        await this.reviewYourOrder.click();
    }

    async anotherCaptchaVisible() {
        try {
            const isPresent = await this.newCaptcha.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.newCaptcha.isDisplayed();
        } catch (e) {
            return false;
        }
    }
}
