// import the files being tested
const {
  configController,
  config,
} = require('../server/controllers/configController.js');
// helper function that will be called in the method
const prometheusQueries = require('../server/services/prometheusService.js');

// mock prometheusQueries to avoid real API calls
jest.mock('../server/services/prometheusService.js');
// testing the configController.savConfig method
describe('configController.saveConfig', () => {
  // variable initialization
  let req, res, next;

  // Setup before each test
  beforeEach(() => {
    // mock request body with data from client
    req = {
      // key value pairs on the req.body - mocking client input data
      body: {
        memory: 70,
        memTimeFrame: 45,
        cpu: 75,
        cpuTimeFrame: 60,
      },
    };
    // default res.locals starts out as an empty object
    res = {
      locals: {},
    };
    // make sure the next function is being invoked
    next = jest.fn();
  });
  // after each test, clear and reset
  afterEach(() => {
    jest.clearAllMocks();
  });
  // test description
  it('should update the config object with the new user CPU and memory thresholds and time frames', () => {
    // call the saveConfig function pairing the parameters with the arguments
    configController.saveConfig(req, res, next);

    // check that the config object was updated correctly for CPU - threshold, minutes, the queryString to contain correct time frame
    expect(config.cpu.threshold).toBe(75);
    expect(config.cpu.minutes).toBe(60);
    expect(config.cpu.queryString).toContain('60m');

    // check that the config object was updated correctly for memory - threshold, minutes, the queryString to contain correct time frame
    expect(config.memory.threshold).toBe(70);
    expect(config.memory.minutes).toBe(45);
    expect(config.memory.queryString).toContain('45m');
  });
  // test description
  it('should update res.locals with the saved config', () => {
    // call the saveConfig function
    configController.saveConfig(req, res, next);

    // check that res.locals.savedConfig object was updated with the correct data
    expect(res.locals.savedConfig.cpu).toEqual({
      threshold: 75,
      minutes: 60,
    });
    expect(res.locals.savedConfig.memory).toEqual({
      threshold: 70,
      minutes: 45,
    });
  });
  //test description
  it('should call prometheusQueries', () => {
    // Call the saveConfig function
    configController.saveConfig(req, res, next);

    // ensure that prometheusQueries was called
    expect(prometheusQueries).toHaveBeenCalled();
  });
  // test description
  it('should call next() after completing successfully', () => {
    // call the saveConfig function
    configController.saveConfig(req, res, next);

    // ensure next was called without any errors
    expect(next).toHaveBeenCalledWith();
  });
  // test description
  it('should handle errors and pass them to next', () => {
    // simulate an error scenario
    req.body = null;

    configController.saveConfig(req, res, next);

    // check that next was called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
