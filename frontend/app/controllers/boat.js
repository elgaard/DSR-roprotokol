'use strict';

app.controller('BoatCtrl', ['$scope', '$routeParams', 'DatabaseService', '$interval', 'ngDialog', function ($scope, $routeParams, DatabaseService, $interval, ngDialog) {
    DatabaseService.init().then(function () {
      
      // Load Category Overview
      $scope.destinations = DatabaseService.getDestinations();
      $scope.triptypes = DatabaseService.getTripTypes();
      $scope.boatcategories = DatabaseService.getBoatCategories();

      // Load selected boats based on boat category
      $scope.selectedboats = DatabaseService.getBoatsWithCategoryName($routeParams.name);

      // Checkout code
      var boat_id = $routeParams.boat_id;
      $scope.selectedboat = DatabaseService.getBoatWithId(boat_id);
      if ($scope.selectedboat !== undefined) {
        var now = new Date();
        
        // Lock boat for the next 30 seconds
        DatabaseService.lockBoatWithId($routeParams.boat_id, new Date(now.getTime() + 30000), function() {
          // Failed to lock boat
          // TODO: Give error and redirect back to category list
        });
        
          $scope.checkout = {
	      'boat' : $scope.selectedboat,
              'destination': $scope.destinations[0],
              'starttime': now,
              // TODO: Calculate this based on the destination and triptype
              // TODO: Add sunrise and sunset calculations : https://github.com/mourner/suncalc
              'expectedtime': new Date(now.getTime() + 60000 * 60),
              'endtime': '',
              'triptype': $scope.triptypes[0],
              'rowers': []
        };
        
        // TODO: Check that all rowers has the correct right by looking at the rights table and also make sure we test if instructor
        // TODO: Show wrench next to name in checkout view
        
        // Fill the rowers array with empty values
        for (var i = 0; i < $scope.selectedboat.spaces; i++) {
          $scope.checkout.rowers.push("");
        }

        $scope.boatdamages = DatabaseService.getDamagesWithBoatId(boat_id);

        var setlock = $interval(function () {
          // Lock boat for 30 seconds more every 10 seconds
          DatabaseService.lockBoatWithId(boat_id, new Date((new Date()).getTime() + 30000));
        }, 10000);

        // Make sure we stop the timer and cancel the lock when we leave the page
        $scope.$on("$destroy", function () {
          if (setlock) {
            $interval.cancel(setlock);
            // Unlock boat
            DatabaseService.lockBoatWithId(boat_id, new Date(0));
          }
        });

      } else {
        //TODO: Say boat was not found
      }

    });
    
    // Utility functions for view
    $scope.getRowerByName = function (val) {
      // Generate list of ids that we already have added
      var ids = {};
      for(var i = 0; i < $scope.checkout.rowers.length; i++) {
        if(typeof($scope.checkout.rowers[i]) === 'object') {
          ids[$scope.checkout.rowers[i].id] = true;
        }
      }
      return DatabaseService.getRowersByNameOrId(val, ids);
    };

    $scope.isObjectAndHasId = function (val) {
      return typeof(val) === 'string' && val.length > 3;
    };

    $scope.clearDestination = function () {
      $scope.checkout.destination = undefined;
    };
    
    $scope.reportdamage = function () {
      ngDialog.open({ template: 'reportdamage.html' });
    };
    
    $scope.savedamage = function (boat_id, description, level) {
      var damage = { "id": 0, "descrption": description, "level": level }
      // TODO: Post to server and get id
      boatdamages.push(damage);
    };
  
    $scope.createRower = function (rowers, index) {
      var rower = DatabaseService.createRowerByName(rowers[index]);
      if(rower) {
        rowers[index] = rower;
      }
    };
  
    $scope.createtrip = function (data) {
      // TODO: Check if all rowers have ID and don't allow to start trip before it's done
      
      if(DatabaseService.createTrip(data)) {
        // TODO: redirect to category list
      } else {
        // TODO: give error that we could not save the trip
      };
    };
}]);
