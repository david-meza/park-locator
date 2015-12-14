'use strict';

angular.module('parkLocator').factory('classesService', ['$http', 
  function($http){

    var classes = { content: [], sections: [] };


  var getParkClasses = function (ids) {
    // Empty all arrays when we change the current park
    // We can't just do classes = { content: [], sections: [] }; because it replaces and disconnects the object from the $digest loop that was triggered in the ctrl with $scope
    // So instead, we just clear the contents of the object and we still have a reference to the same object
    for (var key in classes) {
      if (key === 'content' || key === 'sections') {
        classes[key].splice(0, classes[key].length);
      } else {
        delete classes[key];
      }
    }

    return $http({
      method: 'GET',
      url: 'https://maps.raleighnc.gov/class/class.php?&ids=' + ids
    }).then(_processClasses, _logAjaxError);
    
  };

  var _processClasses = function (response) {
    // Typical response for no results is "null"
    if (response.data === null) { return; }
    response.data.forEach( function (course) {
      classes.content.push(course);
      if (course.SECTION === 'Athletic teams/leagues') { course.SECTION = 'Athletic teams and leagues'; }
      if (classes[course.SECTION]) {
        classes[course.SECTION].push(course);
      } else {
        classes[course.SECTION] = [course];
        classes.sections.push({ name: course.SECTION, active: false, disabled: false});
      }

    });
  };

  var getParkIds = function (name) {
    for (var i = 0; i < parkIds.length; i++) {
      if (parkIds[i].name === name) {
        return parkIds[i].ids;
      }
    }
  };
	
	var parkIds = [
    {
      'ids': '30,74',
      'name': 'Anderson Point Park'
    },
    {
      'ids': '82,83',
      'name': 'Annie Louise Wilkerson, MD Nature Preserve Park'
    },
    {
      'ids': '23',
      'name': 'Apollo Heights Park'
    },
    {
      'ids': '57',
      'name': 'Baileywick Road Park'
    },
    {
      'ids': '68',
      'name': 'Barwell Road'
    },
    {
      'ids': '7,50',
      'name': 'Biltmore Hills'
    },
    {
      'ids': '33',
      'name': 'Brentwood Park'
    },
    {
      'ids': '69',
      'name': 'Brier Creek Park'
    },
    {
      'ids': '60',
      'name': 'Brookhaven'
    },
    {
      'ids': '58,89',
      'name': 'Buffaloe Road Athletic Park'
    },
    {
      'ids': '11',
      'name': 'Campbell Lodge'
    },
    {
      'ids': '8',
      'name': 'Carolina Pines Park'
    },
    {
      'ids': '34',
      'name': 'Cedar Hills Park'
    },
    {
      'ids': '9,54',
      'name': 'John Chavis Memorial Park'
    },
    {
      'ids': '11',
      'name': 'Durant Nature Preserve'
    },
    {
      'ids': '35',
      'name': 'Eastgate Park'
    },
    {
      'ids': '75',
      'name': 'Fallon Park'
    },
    {
      'ids': '36',
      'name': 'Fred Fletcher Park'
    },
    {
      'ids': '62',
      'name': 'Gardner'
    },
    {
      'ids': '39',
      'name': 'Glen Eden Pilot Park'
    },
    {
      'ids': '10',
      'name': 'Green Road Park'
    },
    {
      'ids': '77',
      'name': 'Greystone Recreation Center'
    },
    {
      'ids': '12',
      'name': 'Halifax Park'
    },
    {
      'ids': '90',
      'name': 'Hill Street Park'
    },
    {
      'ids': '72',
      'name': 'Honeycutt Park'
    },
    {
      'ids': '81',
      'name': 'Isabella Cannon Park'
    },
    {
      'ids': '2,13',
      'name': 'Jaycee Park'
    },
    {
      'ids': '42',
      'name': 'John P Top Greene Park'
    },
    {
      'ids': '37',
      'name': 'Kentwood Park'
    },
    {
      'ids': '38',
      'name': 'Kiwanis Park'
    },
    {
      'ids': '14',
      'name': 'Lake Johnson Park'
    },
    {
      'ids': '14',
      'name': 'Lake Johnson Nature Preserve'
    },
    {
      'ids': '53',
      'name': 'Lake Johnson Pool'
    },
    {
      'ids': '16',
      'name': 'Lake Lynn'
    },
    {
      'ids': '15',
      'name': 'Lake Wheeler Park'
    },
    {
      'ids': '3',
      'name': 'Laurel Hills Park'
    },
    {
      'ids': '17',
      'name': 'Lions Park'
    },
    {
      'ids': '52',
      'name': 'Longview Park'
    },
    {
      'ids': '46',
      'name': 'Marsh Creek Park'
    },
    {
      'ids': '19',
      'name': 'Method Park'
    },
    {
      'ids': '6,18,43,88',
      'name': 'Millbrook Exchange Park'
    },
    {
      'ids': '56',
      'name': 'Moore Square'
    },
    {
      'ids': '64',
      'name': 'Mordecai Square'
    },
    {
      'ids': '84',
      'name': 'Nash Square'
    },
    {
      'ids': '48',
      'name': 'North Hills Park'
    },
    {
      'ids': '45',
      'name': 'Oakwood Park'
    },
    {
      'ids': '1,20',
      'name': 'Optimist Park'
    },
    {
      'ids': '59',
      'name': 'Peach Road Park'
    },
    {
      'ids': '40',
      'name': 'Powell Drive Park'
    },
    {
      'ids': '4,21,22,49',
      'name': 'Pullen Park'
    },
    {
      'ids': '5',
      'name': 'Pullen Arts Center'
    },
    {
      'ids': '4,21,22,49',
      'name': 'Pullen Amusement'
    },
    {
      'ids': '91',
      'name': 'Raleigh City Museum'
    },
    {
      'ids': '51',
      'name': 'Ridge Road'
    },
    {
      'ids': '24',
      'name': 'Roberts Park'
    },
    {
      'ids': '86',
      'name': 'Rose Garden & Little Theatre'
    },
    {
      'ids': '41',
      'name': 'Sanderford Road Park'
    },
    {
      'ids': '25',
      'name': 'Sertoma Arts Center'
    },
    {
      'ids': '55',
      'name': 'Shelley Lake Park'
    },
    {
      'ids': '31',
      'name': 'Southgate Park'
    },
    {
      'ids': '47',
      'name': 'Spring Forest Road Park'
    },
    {
      'ids': '26,80',
      'name': 'Tarboro Road Park'
    },
    {
      'ids': '76',
      'name': 'Tucker House'
    },
    {
      'ids': '29',
      'name': 'Walnut Creek Softball Complex'
    },
    {
      'ids': '78',
      'name': 'Walnut Creek Wetland Center'
    },
    {
      'ids': '87',
      'name': 'Whitaker Mill'
    },
    {
      'ids': '44',
      'name': 'Williams Park'
    },
    {
      'ids': '61',
      'name': 'Windemere Beaver Dam Park'
    },
    {
      'ids': '28',
      'name': 'Worthdale Park'
    }
  ];

  var _logAjaxError = function (error) {
    console.log(error);
  };
  

	return {
    getParkClasses: getParkClasses,
    getParkIds: getParkIds,
    classes: classes
	};
}]);