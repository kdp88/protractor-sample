import {browser} from 'protractor';
import {until, Utils} from '../lib';
import {TargetPageObject, GmailApiHelper} from '../routes';

require('dotenv').config();


describe('target-ps5-digital', () => {
    let targetPageObject: TargetPageObject;
    let gmailApiHelper: GmailApiHelper;

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 86400000;
    });

    beforeAll(() => {
        targetPageObject = new TargetPageObject();
        gmailApiHelper = new GmailApiHelper();
    });

    it(`playstation direct - playstation 5 cd version 499.99`, async () => {
        for (let i = 0; i < 86400; i++) {
            await browser.waitForAngularEnabled(false);
            // todo login not working, they must have changed something
            // if (!alreadyLoggedIn) {
            //     await browser.get('https://target.com');
            //     await targetPageObject.login(process.env.email, process.env.targetPassword);
            //     await targetPageObject.clickIntoProfile();
            //     const currentUrl: string = await browser.getCurrentUrl();
            //     if (currentUrl.indexOf(`account?lnk=acct_nav_my_account`) !== -1) {
            //         return alreadyLoggedIn = true;
            //     }
            // }
            // await browser.driver.manage().window().maximize();
            await browser.get('https://www.target.com/p/playstation-5-console/-/A-81114595');
            if (!await targetPageObject.myTargetStoreLocationIsVisible(process.env.storeLocation)) {
                await targetPageObject.updateMyTargetStoreLocation(process.env.storeLocationZipCode);
                await targetPageObject.setNewHomeStore(process.env.storeLocation);
            }
            if (await targetPageObject.isCaptchaVis()) {
                await gmailApiHelper.sendEmailUsingGmail(process.env.email, process.env.password);
            }
            if (!await targetPageObject.outOfStockVisible) {
                await browser.takeScreenshot().then((png) => {
                    Utils.writeScreenShot(png, `./reports/screenshots/ps5.png`);
                });
                await gmailApiHelper.sendEmailUsingGmail(process.env.email, process.env.password);
            }
            if (await targetPageObject.addToCartIsVisible()) {
                await browser.takeScreenshot().then((png) => {
                    Utils.writeScreenShot(png, `./reports/screenshots/ps5.png`);
                });
                await gmailApiHelper.sendEmailUsingGmail(process.env.email, process.env.password);
            }
            console.log(`sleep 9 seconds. retry: ${i}`);
            await browser.driver.sleep(9000);
        }
    });

});
