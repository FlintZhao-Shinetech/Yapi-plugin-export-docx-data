const exportDocxController = require('./controller');

module.exports = function () {
  this.bindHook('add_router', (addRouter) => {
    addRouter({
      controller: exportDocxController,
      method: 'get',
      path: 'exportDocx',
      action: 'exportData',
    });
  });
};
