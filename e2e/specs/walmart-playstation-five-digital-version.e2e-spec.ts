import {browser} from 'protractor';
import {until, Utils} from '../lib';
import {WalmartPageObject} from '../routes';
require('dotenv').config();


describe('walmart-ps5-digital', () => {
    let walmartPageObject: WalmartPageObject;
    let alreadyLoggedIn: boolean = false;
    let newBrowser = browser;

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 86400000;
        walmartPageObject = new WalmartPageObject();
    });

    beforeAll(() => {
        walmartPageObject = new WalmartPageObject();
    });

    it(`walmart - playstation 5 digital 399.99`, async () => {
        for (let i = 0; i < 86400; i++) {
            let savedBrowser = browser;
            await savedBrowser.waitForAngularEnabled(false);
            await savedBrowser.driver.manage().window().maximize();
            await savedBrowser.get('https://www.walmart.com/account/login?returnUrl=%2Faccount%3Fr%3Dyes');
            if (walmartPageObject.loginScreenVisible) {
                await walmartPageObject.login(process.env.walmartUsername, process.env.walmartPassword);
                if (await walmartPageObject.isCaptchaVis()) {
                    await walmartPageObject.clickCaptchaAndHopeForTheBest()
                    await savedBrowser.restart();
                    newBrowser = await browser.forkNewDriverInstance(true, true, true);
                    await newBrowser.driver.manage().window().maximize();
                    await newBrowser.waitForAngularEnabled(false);
                    await newBrowser.get('https://www.walmart.com/account/login?returnUrl=%2Faccount%3Fr%3Dyes');
                    const currentUrl = await newBrowser.getCurrentUrl();
                    if (currentUrl.indexOf(`account?r=yes&action=SignIn&rm=true`) !== -1) {
                        alreadyLoggedIn = true;
                        return;
                    } else {
                        await walmartPageObject.login(process.env.walmartUsername, process.env.walmartPassword);
                    }
                } else {
                    alreadyLoggedIn = true;
                }
            }
            await savedBrowser.get('https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815') || newBrowser.get('https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815');
            if (await walmartPageObject.addToCartIsVisible()) {
                // await walmartPageObject.sendEmailUsingGmail(process.env.email, process.env.password);
                await walmartPageObject.clickAddToCart();
                await walmartPageObject.clickCheckoutProcess(process.env.creditLast3CVV);
            }
            if (alreadyLoggedIn &&  !await walmartPageObject.addToCartIsVisible() && !await walmartPageObject.isCaptchaVis()) {
                for (let i = 0; i < 86400; i++) {
                    await savedBrowser.get('https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815') || newBrowser.get('https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815');
                    if (await walmartPageObject.addToCartIsVisible()) {
                        // await walmartPageObject.sendEmailUsingGmail(process.env.email, process.env.password);
                        await walmartPageObject.clickAddToCart();
                        await walmartPageObject.clickCheckoutProcess(process.env.creditLast3CVV);
                    }
                    await savedBrowser.driver.sleep(2000) || newBrowser.driver.sleep(2000);
                }
            }
            console.log(`attempt: ${i}`);
            await savedBrowser.driver.sleep(5000) || newBrowser.driver.sleep(5000);
        }
    });

});
