import {browser} from 'protractor';
import {Utils} from '../lib';
import {SonyDirectPageObject, GmailApiHelper} from '../routes';
require('dotenv').config()

describe('workspace-accounts-documents-searchbar.e2e-spec.ts Scenarios', () => {
    let sonyDirectPageObject: SonyDirectPageObject;
    let gmailApiHelper: GmailApiHelper;

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 86400000;
    });

    beforeAll(() => {
        sonyDirectPageObject = new SonyDirectPageObject();
        gmailApiHelper = new GmailApiHelper();
    });

    it(`playstation direct - playstation 5 digital 399.99`, async () => {
        for (let i = 0; i < 86400; i++) {
            await browser.waitForAngularEnabled(false);
            await browser.driver.manage().window().maximize();
            await browser.takeScreenshot().then((png) => {
                Utils.writeScreenShot(png, `./reports/screenshots/ps5.png`);
            });
            await browser.get('https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817');
            if (await sonyDirectPageObject.isCaptchaVis()) {
                await sonyDirectPageObject.clickCaptchaAndHopeForTheBest()
                await browser.driver.sleep(1500);
            }
            if (!await sonyDirectPageObject.outOfStockVisible) {
                await browser.takeScreenshot().then((png) => {
                    Utils.writeScreenShot(png, `./reports/screenshots/ps5.png`);
                });
                await gmailApiHelper.sendEmailUsingGmail(process.env.email, process.env.password);
            }
            if (await sonyDirectPageObject.addToCartIsVisible()) {
                await browser.takeScreenshot().then((png) => {
                    Utils.writeScreenShot(png, `./reports/screenshots/ps5.png`);
                });
                await gmailApiHelper.sendEmailUsingGmail(process.env.email, process.env.password);
                await sonyDirectPageObject.clickAddToCart()
            }
            console.log(`attempt: ${i}`);
            await browser.driver.sleep(1000);
        }
    });

});
