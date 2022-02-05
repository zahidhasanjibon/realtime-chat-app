const Menu = require("../../models/menu");
function homeController() {
  return {
    async index(req, res) {
      const data = await Menu.find();
      res.render("home", { data: data });
    },
  };
}

module.exports = homeController;
