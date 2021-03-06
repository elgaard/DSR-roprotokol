'use strict';

app.controller('AdminCtrl', ['$scope', 'DatabaseService', 'NgTableParams', '$filter', '$route',
                             function ($scope,   DatabaseService, NgTableParams, $filter,$route) {



          var rower_diff = function(current,correction) {
            var diffs={'from':{},'to':{}};
            angular.forEach(current, function(rid,rower,kv) {
              if (correction[rower]!=rid) {
                diffs.from[rower]=rid;
              }
            },this);
            angular.forEach(correction, function(rid,rower,kv) {
              if (current[rower]!=rid) {
                diffs.to[rower]=rid;
              }
            },this);
            return diffs;
          }

          var correction_diff = function(current,correction) {
	    var res={'diff':{}};
            if (!correction.DeleteTrip) {
              var flds=['boat','Destination','intime','outtime','distance','triptype'];
              for (var ki=0; ki<flds.length;ki++) {
                var k=flds[ki];
                if (current[k]!=correction[k]) {
                  res.diff[k]={'from':current[k],'to':correction[k]};
                }
              }
              if (JSON.stringify(current.rowers) != JSON.stringify(correction.rowers)) {
                res.rowerdiff=rower_diff(current.rowers,correction.rowers);
              }
            }
            return res;
          }
                               
          DatabaseService.init().then(function () {
            $scope.currentrower=null;
            $scope.do="events";
            $scope.DB=DatabaseService.getDB;
            $scope.allboats = DatabaseService.getBoats();
            $scope.locations = DatabaseService.getDB('locations');
            $scope.events = DatabaseService.getDB('get_events');
            $scope.memberrighttypes = DatabaseService.getDB('memberrighttypes');
            $scope.boatkayakcategories = DatabaseService.getDB('boatkayakcategory');
            var errortrips = DatabaseService.getDB('errortrips');
            $scope.levels=DatabaseService.getDB('boatlevels');
            $scope.brands=DatabaseService.getDB('boat_brand');
            $scope.usages=DatabaseService.getDB('boat_usages');
            $scope.placementlevels=[0,1,2];
            $scope.config={'headers':{'XROWING-CLIENT':'ROPROTOKOL'}};
            $scope.ziperrors=[];
            // var mainplan=[[],[],[],[],[]];
            // var num_aisles=5;
            // var num_rows=3;
            // for (var a=0;a<num_aisles;a++) {
            //   mainplan[a]=[];
            //   for (var r=0;r<num_rows;r++) {
                
            //   }
            // }
            
            // for (var b=0;b<$scope.allboats.length;b++ ) {
              
            // }
            
            var i=0;
            while (i < errortrips.length -1) {
              while (errortrips[i].id && i < errortrips.length-1) {
                i++;
              }
              var j=i+1;
              while (j<errortrips.length && errortrips[j].Trip==errortrips[i].Trip) {
                $scope.ziperrors.push({
                  'trip':errortrips[i].Trip,
                  'current':errortrips[i],
                  'correction':errortrips[j],
                  'diffs': correction_diff(errortrips[i],errortrips[j])
                });
                j++;
              }
              i++;
            }
            $scope.boatcategories = DatabaseService.getBoatTypes();

            $scope.errorhandler = function(error) {
              console.log(error);
              $route.reload();
              alert("du skal logge ind");
            }
            
            $scope.getRowerByName = function (val) {
              return DatabaseService.getRowersByNameOrId(val, undefined);
            };

            $scope.setboatkayak = function(bt) {
              var exeres=DatabaseService.updateDB('setboatkayak',bt,$scope.config,$scope.errorhandler);
            }

            $scope.create_boattype = function(bt) {
              console.log("net boattype");
              var exeres=DatabaseService.updateDB('create_boattype',bt,$scope.config,$scope.errorhandler);
              $scope.DB('boattypes').push(bt);
            }

            $scope.update_level = function(boat) {
              var exeres=DatabaseService.updateDB('boat_update_level',boat,$scope.config,$scope.errorhandler);
            }
            $scope.update_brand = function(boat) {
              var exeres=DatabaseService.updateDB('boat_update_brand',boat,$scope.config,$scope.errorhandler);
            }
            $scope.update_usage = function(boat) {
              var exeres=DatabaseService.updateDB('boat_update_usage',boat,$scope.config,$scope.errorhandler);
            }

            $scope.update_usage_name = function(boat) {
              var exeres=DatabaseService.updateDB('usage_update_name',boat,$scope.config,$scope.errorhandler);
            }
            $scope.update_usage_description = function(usage) {
              var exeres=DatabaseService.updateDB('usage_update_description',usage,$scope.config,$scope.errorhandler);
            }
            $scope.update_usage_name = function(usage) {
              var exeres=DatabaseService.updateDB('usage_update_description',usage,$scope.config,$scope.errorhandler);
            }
            $scope.create_usage = function(usage) {
              console.log('create new usage '+usage);
              var exeres=DatabaseService.updateDB_async('usage_create',usage,$scope.config).then(
                function(newusage) {
                  if (newusage.status=="ok") {
                    $scope.usages.push(newusage.newusage);
                    usage.name="";
                    usage.description="";
                  }                  
                }
              );
            }

            $scope.set_duration = function(destination,loc) {
              var exeres=DatabaseService.updateDB('set_duration',destination,$scope.config,$scope.errorhandler);
            }
            $scope.set_distance = function(destination,loc) {
              var exeres=DatabaseService.updateDB('set_distance',destination,$scope.config,$scope.errorhandler);
            }

            $scope.set_cat_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_cat_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.set_loc_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_loc_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.set_aisle_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_aisle_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.set_row_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_row_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.set_level_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_level_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.set_side_for_boat = function(boat) {
              var exeres=DatabaseService.updateDB('set_side_for_boat',boat,$scope.config,$scope.errorhandler);
            }
            $scope.retire_boat = function(boat,ix) {
              var exeres=DatabaseService.updateDB('retire_boat',boat,$scope.config,$scope.errorhandler);
              $scope.allboats.splice(ix,1);              
            }
            $scope.create_boat = function(boat) {
              var exeres=DatabaseService.updateDB('create_boat',boat,$scope.config,$scope.errorhandler);
              $scope.allboats.push(boat);
            }


            $scope.add_rower_right = function(right,rower) {
              var data={'right':right,'rower':rower}
              var exeres=DatabaseService.updateDB('add_rower_right',data,$scope.config,$scope.errorhandler);
              $scope.currentrower.rights[right.member_right]=Date();
            }
            $scope.remove_rower_right = function(right,rower) {             
              var data={'right':right,'rower':rower}
              var exeres=DatabaseService.updateDB('remove_rower_right',data,$scope.config,$scope.errorhandler);
              delete $scope.currentrower.rights[right];
            }
            
            $scope.remove_boattype_requirement = function(rt,ix) {
              var data={boattype:$scope.currentboattype,'right':rt};
              var exeres=DatabaseService.updateDB('remove_boattype_right',data,$scope.config,$scope.errorhandler);
              delete $scope.requiredboatrights[rt];

            }

            $scope.add_boattype_requirement = function(data,existing_rights) {
              data.boattype=$scope.currentboattype;
              var exeres=DatabaseService.updateDB('add_boattype_req',data,$scope.config,$scope.errorhandler);
              existing_rights[data.right]=data.subject;
            }

            $scope.remove_triptype_requirement = function(rt,ix) {
              var data={triptype:$scope.currenttriptype,'right':rt};
              var exeres=DatabaseService.updateDB('remove_triptype_req',data,$scope.config,$scope.errorhandler);
              delete $scope.requiredtriprights[rt];

            }
            $scope.add_triptype_requirement = function(data) {
              data.triptype=$scope.currenttriptype;
              $scope.requiredtriprights[data.right]=data.subject;
              var exeres=DatabaseService.updateDB('add_triptype_req',data,$scope.config,$scope.errorhandler);
              $scope.trip.newright.right=null;
            }

            $scope.approve_correction = function(data,ix) {
              var exeres=DatabaseService.updateDB('approve_correction',data,$scope.config,$scope.errorhandler);
              $scope.ziperrors.splice(ix,1);                            
            }
            $scope.reject_correction = function(data,ix) {
              var exeres=DatabaseService.updateDB('reject_correction',data,$scope.config,$scope.errorhandler);
              $scope.ziperrors.splice(ix,1);              
            }
            
            $scope.boatcat2dk=DatabaseService.boatcat2dk;
            $scope.rightsubjects=['cox','all','any','none'];


            
            $scope.rowerconvert = function (fromrower,torower) {
              if (fromrower && torower) {
                var exeres=DatabaseService.updateDB('convert_rower',{"from":fromrower,"to":torower},$scope.config,$scope.errorhandler);
              } else {
                alert("begge roere skal være valgt");
              }
            }

            $scope.doboatrights = function (rr,bt) {
              if (rr&rr.length==0) { // Hack, must be due to PHP json marshalling
                $scope.requiredboatrights={};
              } else {
                $scope.requiredboatrights=rr;
              }
              $scope.currentboattype=bt;
            }

            $scope.noright= function() {
                  return function(rtt) {
                    return (rtt&&$scope.currentrower && typeof($scope.currentrower.rights[rtt.member_right])!=="string");
                  }
            }

            $scope.noreq= function(allreqs) {
                  return function(rtt) {
                    return (allreqs && !allreqs[rtt.member_right]);
                  }
            }
            
            $scope.dotriprights = function (rr,tt){
              if (rr&rr.length==0) { // Hack, must be due to PHP json marshalling
                $scope.requiredtriprights={};
              } else {
               $scope.requiredtriprights=rr;
              }
              $scope.currenttriptype=tt;
            }

            
          }
                                     )
        }
                            ]
          )


