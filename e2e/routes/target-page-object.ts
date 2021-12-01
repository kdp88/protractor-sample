import {browser, by, element, ElementFinder, Key, protractor} from "protractor";
import {until} from "../lib";
import {By} from "selenium-webdriver";
const nodemailer = require('nodemailer');

export class TargetPageObject {
    private outOfStock: ElementFinder;
    private addToCart: ElementFinder;
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
    private keepMeSignedIn: ElementFinder;
    private ordersHeader: ElementFinder;
    private profileImage: ElementFinder;
    private signInOption: ElementFinder;
    private accountTab: ElementFinder;
    private storeLocation: ElementFinder;
    private storeSearchTextBox: ElementFinder;
    private findStoresButton: ElementFinder;
    private editStoreButton: ElementFinder;
    private setNewStoreButton: ElementFinder;

    constructor() {
        this.outOfStock = element(
            by.css(
                'div[data-test=storeBlockNonBuyableMessages]',
            ),
        );
        this.addToCart = element(
            by.css(
                'button[data-test=orderPickupButton]',
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
                'username',
            ),
        );
        this.password = element(
            by.id(
                'password',
            ),
        );
        this.signInButton = element(
            by.id(
                'login',
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
        )
        this.keepMeSignedIn = element(
            by.xpath(
                '//div[@class="sc-kGXeez fQexOT"]',
            ),
        );
        this.ordersHeader = element(
            by.css(
                'div h2',
            ),
        );
        this.profileImage = element(
            by.xpath(
                '//a[@href="#accountMenu"]',
            ),
        );
        this.signInOption = element(
            by.xpath(
                '//a//div[text()="Sign in"]',
            ),
        );
        this.accountTab = element(
            by.xpath(
                '//a[@href="/account?lnk=acct_nav_my_account"]',
            ),
        );
        this.storeLocation = element(
            by.xpath(
                '//a[text()="Edit your location"]',
            ),
        );
        this.storeSearchTextBox = element(
            by.id(
                'storeSearch',
            ),
        );
        this.findStoresButton = element(
            by.xpath(
                '//button[text()="Find stores"]',
            ),
        );
        this.editStoreButton = element(
            by.xpath(
                '//button[text()="Edit store"]',
            ),
        );
        this.setNewStoreButton = element(
            by.css(
                'button[data-test=chooseStoreModal-storeDetails-storeInformationSetAsMyStoreButton]',
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
        await this.addToCart.click();
        await browser.driver.sleep(1000);
    }

    async clickEditAndCheckOut() {
        return this.editAndCheckOutButton.click();
    }

    async outOfStockVisible() {
        try {
            const isPresent = await this.outOfStock.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.outOfStock.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async addToCartIsVisible() {
        try {
            const isPresent = await this.addToCart.isPresent();
            if (!isPresent) {
                return false;
            }
            return await this.addToCart.isDisplayed();
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
        await browser.wait(until.presenceOf(this.profileImage),
            10000, 'profileImage not loaded');
        await this.profileImage.click();
        await browser.driver.sleep(1000);
        await browser.wait(until.presenceOf(this.signInOption),
            10000, 'signInOption not loaded');
        await this.signInOption.click();
        await browser.wait(until.presenceOf(this.username),
            10000, 'username not loaded');
        await browser.wait(until.presenceOf(this.password),
            10000, 'password not loaded');
        await browser.wait(until.presenceOf(this.keepMeSignedIn),
            10000, 'keepMeSignedIn checkbox not loaded');
        await this.username.sendKeys(email);
        await this.password.sendKeys(password);
        await this.keepMeSignedIn.click();
        await this.signInButton.click();
        await browser.driver.sleep(1000);
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

    async clickIntoProfile() {
        await browser.wait(until.presenceOf(this.profileImage),
            5000, 'profileImage not loaded');
        await this.profileImage.click();
        await browser.driver.sleep(1000);
        await browser.wait(until.presenceOf(this.accountTab),
            5000, 'accountTab not loaded');
        await this.accountTab.click();
        await browser.driver.sleep(1000);
    }

    /**
     * use ZIP CODE ONLY ex: 12345
     * @param storeLocationZipCode
     */
    async updateMyTargetStoreLocation(storeLocationZipCode: string) {
        await browser.wait(until.presenceOf(this.editStoreButton),
            5000, 'editStoreButton not loaded');
        await this.editStoreButton.click();
        await browser.driver.sleep(1000);
        await browser.wait(until.presenceOf(this.storeLocation),
            5000, 'storeLocation not loaded');
        await this.storeLocation.click();
        await browser.driver.sleep(1000);
        await browser.wait(until.presenceOf(this.storeSearchTextBox),
            5000, 'storeSearchInput not loaded');
        await browser.driver.sleep(1000);
        await this.storeSearchTextBox.sendKeys(Key.chord(Key.CONTROL,"a",Key.DELETE));
        await this.storeSearchTextBox.clear();
        await this.storeSearchTextBox.sendKeys(storeLocationZipCode);
        return this.findStoresButton.click();
    }

    /**
     * must be the town name in which target displays it
     * IE: New York, Princeton, South Brunswick
     * @param storeLocation
     */
    async setNewHomeStore(storeLocation) {
        await browser.wait(until.presenceOf(element(
            by.xpath(`//button[@aria-label='${storeLocation} store details']`))), 5000, 'Store Details didnt show up in time');
        await browser.driver.sleep(1000);
        await element(
            by.xpath(
                `//button[@aria-label='${storeLocation} store details']`,
            ),
        ).click();
        await browser.driver.sleep(2000);
        return this.setNewStoreButton.click();
    }

    /**
     * example: Princeton or whatever town you live in
     * @param storeLocation
     */
    async myTargetStoreLocationIsVisible(storeLocation: string) {
        await browser.driver.sleep(2000);
        try {
            const isPresent = await element(
                by.xpath(
                    `//button[text()='${storeLocation}']`,
                ),
            ).isPresent();
            if (!isPresent) {
                return false;
            }
            return await element(
                by.xpath(
                    `//button[text()='${storeLocation}']`,
                ),
            ).isDisplayed();
        } catch (e) {
            return false;
        }
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
