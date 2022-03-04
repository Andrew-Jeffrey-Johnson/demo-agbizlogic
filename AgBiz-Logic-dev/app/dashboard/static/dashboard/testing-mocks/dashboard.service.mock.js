(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("dashboardServiceMock", dashboardServiceMock);

  dashboardServiceMock.$inject = [
    "$q",
  ];

  function dashboardServiceMock($q) {
    return {
      retrieveDashboard: retrieveDashboard,
      updateDashboard: updateDashboard,
      setTileGrid: setTileGrid,
    };


    /****************************************************************
                         Methods
    ****************************************************************/

    function retrieveDashboard() {
      return $q.when({'data': fake_dashboard});
    }


    function updateDashboard(dashboard) {
      return $q.when({'data': dashboard});
    }


    function setTileGrid(dashboard_config, $scope) {
      return $q.when({});
    }

  }

  var fake_dashboard = {
    'id': 32,
    'tiles': [
      {
        'id': 54,
        'tile_type': "info",
        'row': 1,
        'column': 2,
      },
    ],
  };

}());
