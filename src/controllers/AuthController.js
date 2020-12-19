const ControllerBase = require('../lib/baseClass/ControllerBase');

class AuthController extends ControllerBase {
  constructor(app) {
    super(app);
  }
}

module.exports = AuthController;