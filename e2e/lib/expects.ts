import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');


chai.use(chaiAsPromised);
chai.use(require('chai-smoothie'));
chai.use(require('chai-http'));

export const expects = chai.expect;