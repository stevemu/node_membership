let Application = function (args) {

  let app = {};
  app.username = args.username;
  app.password = args.password;
  app.confirm = args.confirm;
  app.status = "pending";
  app.message = null;

  app.setInvalid = (message) => {
    app.status = "invalid";
    app.message = message;
  };

  app.setValid = () => {
    app.status = "valid";
  };

  return app;
};

module.exports = Application;
