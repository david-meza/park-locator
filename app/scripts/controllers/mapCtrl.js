'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', function($scope){
	$scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
}]);