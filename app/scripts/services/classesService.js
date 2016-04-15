(function(angular){

  'use strict';

  angular.module('appServices').factory('classesService', ['$http', '$q', function($http, $q){


    // urlNames don't matter as they'll be added later.
    var sectionsMap = {
      'adventure': { name: 'Adventure', urlName: 'adventure', icon: '/img/icons/classes/adventure.svg'},
      'aquatic': { name: 'Aquatic', urlName: 'aquatic', icon: '/img/icons/classes/aquatic.svg'},
      'art': { name: 'Art', urlName: 'art', icon: '/img/icons/classes/art.svg'},
      'athleticteamsleagues': { name: 'Athletic Teams and Leagues', urlName: 'athleticteamsleagues', icon: '/img/icons/classes/leagues.svg'},
      'citywidespecialevents': { name: 'Special Events', urlName: 'citywidespecialevents', icon: '/img/icons/classes/special-events.svg'},
      'educational': { name: 'Educational', urlName: 'educational', icon: '/img/icons/classes/educational.svg'},
      'fitness': { name: 'Fitness', urlName: 'fitness', icon: '/img/icons/classes/fitness.svg'},
      'nature': { name: 'Nature', urlName: 'nature', icon: '/img/icons/classes/nature.svg'},
      'schoolprograms': { name: 'School Programs', urlName: 'schoolprograms', icon: '/img/icons/classes/school.svg'},
      'social': { name: 'Social', urlName: 'social', icon: '/img/icons/classes/social.svg'},
      'specializedrecreation': { name: 'Specialized Recreation', urlName: 'specializedrecreation', icon: '/img/icons/classes/specialized-recreation.svg'},
      'sports': { name: 'Sports', urlName: 'sports', icon: '/img/icons/classes/sports.svg'},
      'summercampspecializedrecreation': { name: 'Summer Camp - Specialized Recreation', urlName: 'summercampspecializedrecreation', icon: '/img/icons/classes/summer-camp-spec.svg'},
      'summercampspecialty': { name: 'Summer Camp - Specialty', urlName: 'summercampspecialty', icon: '/img/icons/classes/summer-camp.svg'},
      'summercamptraditional': { name: 'Summer Camp - Traditional', urlName: 'summercamptraditional', icon: '/img/icons/classes/summer-camp.svg'}
    };

    function logError(response) {
      console.log('Failed to get data from classes service', response);
      return $q.reject(response);
    }

    function getParkClasses(ids) {
      return $http({
        method: 'GET',
        url: 'https://maps.raleighnc.gov/class/class.php?&ids=' + ids
      });
    }

    function processClasses(data, classes) {
      // Typical response for no classes results is "null"
      if (data === null) { return; }

      angular.forEach(data, function (course) {
        // Turn date string into Date object for proper sorting. This will make mistakes if in the same day because we remove AM/PM to parse.
        if (course.START_DATE) { course.sDate = new Date( Date.parse(course.START_DATE.substring(0,course.START_DATE.length - 2)) ); }
        
        var urlName = course.SECTION.replace(/\W+/ig, '').toLowerCase();
        
        // Collect unique section names and divide all classes into sections/categories
        if (classes[urlName]) {
          classes[urlName].push(course);
        } else {
          classes[urlName] = [course];
          // Make the urlName always the same as the key so we can find the right section
          sectionsMap[urlName].urlName = urlName;
          // Collect all sections that exist in this park only as an array
          classes.sections.push(sectionsMap[urlName]);
        }

      });
    }

    function getParkIds(parkName) {
      for (var i = 0; i < parkIds.length; i++) {
        if (parkIds[i].name === parkName) {
          return parkIds[i].ids;
        }
      }
    }
  	
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
        'name': 'Brookhaven Nature Park'
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


  	return {
      getParkClasses: getParkClasses,
      getParkIds: getParkIds,
      processClasses: processClasses,
      logError: logError
  	};

  }]);

})(window.angular);
