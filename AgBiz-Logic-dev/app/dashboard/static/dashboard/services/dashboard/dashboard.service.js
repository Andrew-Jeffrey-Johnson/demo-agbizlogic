(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .factory("dashboardService", dashboardServiceFactory);

  dashboardServiceFactory.$inject = [
    '$compile',
    '$http',
    '$q',
    'configService',
  ];

  function dashboardServiceFactory(
    $compile,
    $http,
    $q,
    configService) {
    var url_dashboard = "/dashboard/api/dashboards/";
    var inactive_tiles = [
      "profit",
      "lease",
      "finance",
      "environment",
    ];

    return {
      retrieveDashboard: retrieveDashboard,
      updateDashboard: updateDashboard,
      setTileGrid: setTileGrid,
    };


    /****************************************************************
                         Methods
    ****************************************************************/


    function retrieveDashboard() {
      return $http.post(url_dashboard);
    }


    function updateDashboard(dashboard) {
      return $http.put(url_dashboard, dashboard);
    }


    function setTileGrid(dashboard_config, $scope) {
      return configService.retrieveConfig()
      .then(function(config) {
        // Access tiles using 'dashboard_config[column][row]'
        var tile_grid = {};

        angular.forEach(dashboard_config.tiles, function(tile, index, tiles) {
          if (tile_grid[tile.column] === undefined) {
            tile_grid[tile.column] = {};
          }
          var tile_template = "<div id=\"" + tile.tile_type + "-tile\" class=\"row\" draggable-tile>" +
            "<drop-zone position=\"top\"></drop-zone>" +
            "<" + tile.tile_type + " " +
            "class=\"col-md-12\" " +
            "inactive=" + (inactive_tiles.indexOf(tile.tile_type) != -1) + " " +
            "user=\"$ctrl.user\">" +
            "</" + tile.tile_type + ">";
          // Add drop-zone after last tile in each column
          if (tile.row == lastRow(tiles, tile.column)) {
            tile_template += "<drop-zone position=\"bottom\"></drop-zone>";
          }

          var tile_element = $compile(tile_template)($scope);
          tile_grid[tile.column][tile.row] = tile_element;
        });

        angular.forEach(tile_grid, function(tiles, column) {
          angular.forEach(tiles, function(tile_element) {
            angular.element(document.querySelector("#column-" + column)).append(tile_element);
          });
        });

        return $q.when(tile_grid);
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function lastRow(tiles, column) {
      var last_row = 0;
      tiles.forEach(function(tile) {
        if (tile.column == column && tile.row > last_row) {
          last_row = tile.row;
        }
      });

      return last_row;
    }

  }

})();
