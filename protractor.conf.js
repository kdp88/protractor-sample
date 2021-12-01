// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
let reporter = new HtmlScreenshotReporter({
    pathBuilder: function () {
        return 'screenshot'
    },
    dest: './reports/screenshots',
    filename: 'report.html',
    captureOnlyFailedSpecs: true,
    inlineImages: true,
    cleanDestination: true,
    showSummary: null,
    showConfiguration: null,
});

exports.config = {
    allScriptsTimeout: 86400000,
    specs: [
        // './e2e/specs/walmart-playstation-five-digital-version.e2e-spec.ts',
        // './e2e/specs/playstation-DIRECT-playstation-five-cd-version.e2e-spec.ts',
        './e2e/specs/target-playstation-five-disc-version.e2e-spec.ts'
    ],
    suites: {
        suite1: [
            './e2e/specs/playstation-DIRECT-playstation-five-digital-version.e2e-spec.ts',
            // './e2e/specs/playstation-DIRECT-playstation-five-cd-version.e2e-spec.ts'
        ]
    },
    capabilities: {
        browserName: 'chrome',

        // allows different specs to run in parallel.
        // If this is set to be true, specs will be sharded by file
        // (i.e. all files to be run by this set of capabilities will run in parallel).
        // Default is false.
        shardTestFiles: true,

        // Maximum number of browser instances that can run in parallel for this
        // set of capabilities. This is only needed if shardTestFiles is true.
        // Default is 1.
        maxInstances: 2,

        chromeOptions: {
            args: [
                // "--headless",
                "--disable-gpu",
                // "--window-size=1920,1080",
                // "--no-sandbox",
                // "--disable-dev-shm-usage",
                // '--allow-insecure-localhost',
                // '--ignore-certificate-errors',
                // '--enable-logging',
            ]
        },
        loggingPrefs: {
            'browser': 'ALL', // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL"
            'server': 'ALL',
            'driver': 'ALL'
        },
    },
    directConnect: true,
    acceptInsecureCerts: true,
    baseUrl: 'localhost:5000',
    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 86400000,
        print: function () {
        }
    },

// Setup the report before any tests start
    beforeLaunch: function () {
        return new Promise(function (resolve) {
            reporter.beforeLaunch(resolve);
        });
    },

    params: {},
    onPrepare() {
        let jasmineReporters = require('jasmine-reporters');
        let fs = require('fs-extra');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './',
            filePrefix: 'xmlresults'
        }));
        jasmine.getEnv().addReporter({
            specDone: function (result) {
                if (result.status == 'failed') {
                    browser.getCapabilities().then(function (caps) {
                        const browserName = caps.get('browserName');

                        browser.takeScreenshot().then(function (png) {
                            let stream = fs.createWriteStream('./reports/screenshots/FAILED.png');
                            stream.write(new Buffer(png, 'base64'));
                            stream.end();
                        });
                    });
                }
            }
        });

        require('jasmine2-protractor-utils');
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
        let env = jasmine.getEnv();
        browser.params.TIMEOUT_INTERVAL = 86400000; // global interval timeout used in spec files
        browser.manage().timeouts().setScriptTimeout(4000000);
        env.addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true,
                displayFailuresSummary: true,
                displaySuccessesSummary: true,
                displayPendingSummary: true,
                displaySuccessfulSpec: true,
                displayFailedSpec: true,
                displayPendingSpec: true,
                displaySuiteNumber: true,
                displaySpecDuration: true
            }
        }));
        global.browser.getProcessedConfig().then(function (config) {
        });

        // This code will stop test spec on first failure of expect(thing()).toBe<>('pattern to verify');
        let specs = [];
        let orgSpecFilter = jasmine.getEnv().specFilter;

        // Assign the test reporter to each running instance
        jasmine.getEnv().addReporter(reporter);
        jasmine.getEnv().specFilter = function (spec) {
            specs.push(spec);
            return orgSpecFilter(spec);
        };
        jasmine.getEnv().addReporter(new function () {
            this.specDone = function (result) {
                if (result.failedExpectations.length > 0) {
                    specs.forEach(function (spec) {
                        spec.disable()
                    });
                }
            };
        });
    },

    //HTMLReport called once tests are finished
    onComplete: function () {
        let browserName, browserVersion, os, suite, baseUrl;
        let capsPromise = browser.getCapabilities();
        let getProcessedConfig = browser.getProcessedConfig();

        getProcessedConfig.then(config => {
            baseUrl = config.baseUrl;
            suite = config.suite;
        });

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');
            os = caps.get('platform');

            const HTMLReport = require('protractor-html-reporter-2');

            let testConfig = {
                reportTitle: `frontend-e2e-agilicats suite:${suite} Report for ${browserName} ${browserVersion} ${os} on ${baseUrl}`,
                outputPath: './',
                outputFilename: `./reports/screenshots/frontend-suite-${suite}-report-${browserName}-${browserVersion}-${os}`,
                screenshotPath: './screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true,
                testPlatform: os
            };
            new HTMLReport().from('xmlresults.xml', testConfig);
        });
    },

    // Close the report after all tests finish
    afterLaunch: function (exitCode) {
        return new Promise(function (resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    }
};
