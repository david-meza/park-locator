'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', function($http){
	
	// http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson

	var list = { content: [], uniques: [], activitiesPos: { markers: [] } };
	var currentMarker = { obj: {} };
	var selectedActivities = { current: [] };

	list.activitiesPos.markersConfig = {
    type: 'cluster',
    typeOptions: {
      title: 'Zoom in to find more activities!',
      gridSize: 60,
      minimumClusterSize: 3
    },
    typeEvents: {}
  };

	var _logAjaxError = function (error) {
		console.log(error);
	};

	var _generateList = function (response) {
		var allAmenities = response.data.drawingInfo.renderer.uniqueValueInfos;
		allAmenities.forEach( function(amenity) {
			var processed = {
				id: amenity.value,
				name: amenity.label,
				url: amenity.symbol.url,
				imageData: amenity.symbol.imageData
			};

			list.content.push(processed);
		});

		_processUniques();
	};

	var _addSecondSet = function (response) {
		_generateList(response);
		_addMissingAmenities();
	};

	var _processUniques = function () {
		for (var i = 0; i < list.content.length; i++) {
			// Shorthand for current array element (current amenity)
			var c = list.content[i];

			// Name overrides
			if (c.name === 'Tennis') { c.name = 'Tennis Courts'; }
			if (c.name === 'Theatre') { c.name = 'Theater'; }
			if (c.name === 'Tennis Center') { c.imageData = 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIEwfcPzwAAAw1JREFUSMe9Vk1PE1EUPe/NkEJbQaggGzdGxSjgAkz4GeoCd34s1Shqor9Bg/9AAwK60IjGHRAxMSaiLUWjBdToRj6muKst2mln3nFRZux0KpSQ9iaTzNz37j3v3nvufQMAjQAGhRAmAFbrEUI80HW9DQDubCjtKgI6vp8KIYRJsg4FEaieKABCbCDXSlhrQMhaggGAXqoQQkCIzUtJEiR9duX2+fxjhymVUkIIAdu2fWuapkEp5QH2AbZEImhq3AWl6Ds1SUgpkc1mkUwmPfqGYBDhUBgAQQLpTBpmNuv6KAZ1GpMAePfeEEnStm2WimVZJMloNMZQKEwAbGvbyysDA4zNxrm0vMIfS8v8sbTMNzNveeHiJYZCIY9/H+Ct24NMpVJcXTVomjmSpFKKtm0zmVxjKpXixMQE6+rq2BKJ8NWr12UP6HyPjz9jMOgB9Y0gAuCuxibGZuOug/X1dXZ2dhMApZQEwJGRMZKkaZokyeTaT87PL1IpRaUUcxv6y5cHiu22DwiAhw51MJ3OuBkgyRMnT7G+IchHj5+QJHO5QoYmp164dr62KGZT6aQr5tCRo0cRDoeglIKUEh8/JfByehrZP79x/dpVDA8NwbItaFJDOpN27f4LuFWvNO9u9rAvlfqFfD4PXddhGKtYWVku30aV9lupfP/+DZZlQ8qCi4MHD6C1rRWWZeHM2fNYXPyC2fgcEvMLGB176Aumohp2df2rYSBQz0RivlCrfJ4kOTE5xRs3bvLzl6+eNhq+P1oZS6Oxf4CZTMYljaZpBMAzZ8/Rsmy3DRzyKKVcMCO5xo6Ow1uztLFpN+NzHzwRdncfcw2dff39p/kpseBha+GdjMbi7Onp9bTSf2eplBLt7e0IBALusDYMA7lcroi1AiRRX9+Avr4+9PYeR0skAsMw8P79HKLRd8iZprvP4f2OhremaWUHt3MgKaVnfVPA0qtKKVXRPpeN5a6xnUa4Xan5jS9rHKFyIlQ7clMhGAChCSH2AehxFFUCIwrZnIGu63sAPN9QKlTvrzsGYP9fe4PZVKNaaIwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTItMDNUMTE6MDI6MDQtMDU6MDBYT/64AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEyLTAzVDExOjAyOjA0LTA1OjAwKRJGBAAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII='; }
			if (c.name === 'Aquatic Center') { c.id = 1302; c.name = 'Pool'; }
			if (c.name === 'Bocceball') { c.name = 'Bocce'; }
			if (c.name === 'Off Leash Dog Area') { c.name = 'Dog Park'; }
			// These two seem to be different 
			// if (c.name === 'Community Center' || c.name === 'Neighborhood Center') { c.name = 'Recreation Center'; }
			if (c.name === 'Informal Playfield' || c.name === 'Multipurpose') { c.name = 'Multipurpose Field'; }

			if (list[c.name]) {continue;}
			list.uniques.push(c);
			// Mapping the amenity by name so we know we've processed it
			list[c.name] = true;
			// Mapping the amenity by id so we can get the name later when we have foreign keys
			list[c.id] = c;
		}
	};

	var _addMissingAmenities = function () {
		var missing = [
			{ name: 'Active Adult Center', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAQAAADYBBcfAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQffDAMLAgNfk5psAAACvklEQVQ4y43Uz4vVZRQG8M/7vff68zrqeM2ccdSpGTMtoYSCNkGrCCKCiIgWgYv+gkIIWhZRQhC4CsJ1UkjbIqTMkhb9QizwB44zkTaN4Dioc+99WszXGaPAOe/me873ec7hfd6Hw4D3yk1Z9ulL+bg1yCHRWx6pSiutVD3xaRFRLCOK3P7qpyxld4lK334HzDnqOyWkiuzLb5nJG1nISmRrzuZq3o006uoLmUuS3MgrEQs/nk83yWc1pIo8lW6SLyONlMiGnEtyPdeSHM+KVBTs0sBuxEJltwaGdPS08KpRXWusRlfUxO1gvaFFpXbUlUF08SSajnpfrNBXFfMYRawzgkrBXvRsNoy+e+3F51520It6WppFbLYD17WN+V5l3hojuG7ATrDFuDhiXssxkyoVtA0571sMocJmw077AdtqIn84ia6ek+ZUBUM2+N0pjKOPrTb5y0/Yo2AYV00poq+q27sfE05jzGq9es6U49hpFTZiutZ7oXWV+hnOuYht2vp1qz+cx0PWolnD73BSak3/NG3WuEHwIC6YcEvb8P9bMNiHn51xuZZnpe341YxJPIBrWH+H3WlyjxG86bJNeMxX2h7G617SrqfPYKN1rim1u5rssgrPKbq1foM64mn0auIkOh51XFPXgBsqRrTq8VUN2/Ov2+zAlGlrPYt5Y96xUnMBesUlsdGoPfVrTpvQN2DcVltMOmuT11xwyhHT5pCPkhyMyBNJ/k4nh5K8vVi5kkciHyS5laSb5Iu0UjVtxxS4rGudEWO4CK6Y1DGMT8xqmTePpqIact8iccZZTc/o4HxNvIQxnHAYDStwwi3Ntp5fatisH40adcOUCTRcdcbjBsBbZh1w02EfoujffceVei9kKe9X/zHhojeW4jahQlERpVFG7F/O1KUG6Zeq+lqz49jCYl/m6Un1TXvLP8bfbEWalg9XAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTAzVDExOjAyOjAzLTA1OjAwnejANgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wM1QxMTowMjowMy0wNTowMOy1eIoAAAAASUVORK5CYII='},
			{ name: 'BMX Track', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIDX5OabAAABI5JREFUSMe1Vk1MVFcYPfe+9xBxJGEEHU1Y2BhFKtbQuKlYHLVAZVwoK8LWDWxNkZpUQizRKa2hMTUxaJtImLowEzAm2thoQouRWERmVGxdoKk/bJwONiMMM++eLuBdZhhHpNEvuXl59++ce+73cwEgH0CHECIOgO+hKQAUQvxkWZYbAL6dHbDfE2Dq3kEhhIiTtDBjAu/PFAAhZpHf2qSUkFLqf5Kwbfttl3PRgK8zIQRIQgihSWQzczEnU0rB6/Vi69atmJycRG5uLoaGhnDt2jVIIaC4MHf5Flhp5vF4UFtbi927dmH79gp0nzuHz3bvhiLh8XhQXFzsHDu7rvObEGJBzzNNkwDY/EUzbw/dpmVZHBwc5OnTpwmAhmG8fl026QzDAEndUu9LCAGlFIQQ6Py+E9KQ2PRhKdatW4dQKJQ2b/59ZgAKIWBZFhKJRFqflFKDK6XSCI7evw8IiQMHDmjHcQg55NIkdSTMW7qU3d3dDI2E2NPTQ19tLT2rVmVIbBiGlrS9vZ0kGY1GeenSJbYcOsTSjRu5bNmybNcBSikJgCUbShgOhWjbNh2LvHjBM11dbGxs5Adr13LJkiV6fk1NDZPJJJVSVEqRpP7ev3ePJ0+e5Oc1NWl+kRGHbrcbG9avR63Phx07vNi27RMt0fj4OEZHR9Hb24uJiQm0tLSgtLQUSikopWCaJqL/RHH58mW8/PclCgsL8cetW/juxAkkEom5OHUYaBaz35ycHNbt38/x58/T2M83p//69essKyvTCszfV0uaClJdXc0fz55lIBBgU2MTAbCyspKxWIwkmUgktIRKKS1/f38/CwoKCIAFBQV0u90ZBwBApP74/X7N2NloYGCAy10udnZ2akDbtmnbNpPJJElyOh5n5aeVlFLS7/dzbGyMT58+pf/4ca5ZsyYd1Dn+nj17GI/HSZI3btxgIBDg1NQUSbK1tZXVVVUZUjqkRkZGuLJoJS9cuKD7nbFfrlyhy+XSoKYTmF6vFzk5OQiHw/D5fIhEIvD7/Whubsa+fftw/ufz+ProURQWFWF6enomqJXC8vx8XLx4EZvKNqGurg4TExNoamoCSHzT0YGq6mpUVVUhGAxCSjkX+IZhAACi0SgikQgA4PmzZwCA/Px8vHoVw1dHjuhMpDOHaSKZTKKhoQEAMDw8jL6+PsRiMfj27kV9fT0+2rwZwWAQioTppJ9wOAwAqKiowKkfTuHBnw/w5eHDAIDBmzfx95Mnug6m1kPH1aPRKEiivLwcDQ0NEEJg586dAIA7d0Zm1gkB7TR5eXns6+3Td+C4+qNHj7hlyxamJojXJXrLshjo6cm4w1+vXqVrNuvMzp1btGLFCh48eJB3797l48ePeaariyUlJQtWEGcsNzeXbW1t/OvhQ46NjfH4sWNcvXp19kzjyGuaJqSUSCQSupJzgeKaOseyLAghtHMBc6+ADMDU7J4t278JNHXz1Aqj52D2NfUmxou1N7xtlANI/I/nxiKNAGAIIYoBfJztpO/IlBBCSil/g2mahQD6kPIsf8fNxkxI/e5yuVb9BxfThsLsSan/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTAzVDExOjAyOjAzLTA1OjAwnejANgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wM1QxMTowMjowMy0wNTowMOy1eIoAAAAASUVORK5CYII='},
			{ name: 'Boat Rentals', imageData: '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' },
			{ name: 'Environmental Education Center', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIDX5OabAAAA/hJREFUSMe9ll9PHFUYxn9nYNhdXCCpBNlFJC0tmhYILJRKFE24UPBGU/wE3FETPoHRK42JpqZ+ALlRozExMUS9aSClLRCgyN/Sbk1JgIYVWdiFwLIzs/N6sTMjC5hYm+VNJmdy5sz7zPu8z3nmAJQCnwMHgOThsp1xADgD8IUzkckT4OHcPymnsiKyochf2IBSDvJphZw2INppggEU5qBrx/Ft20YphVIKEUFEcta7c4fv3Tjpvaem1E3wzBX6/X6qqqrIZDJeQk3TWFlZIRAIEAqF2NvbIxb7E5EMSilqamowTJPtrS3C4TCGYbC+vo5lWQCUlpZSXl7OfipFbH3dQSwsFEA6OztFRMQ0TRERsSxLRETC4bD09vaKiEgqdSBvd3ULID6fT9LpA1l68FCuvNouB+m0JJM70hxp9fbfJ59+JiIi3//wowCilBLNrcYdDcMgFouxsbGBYRhYloVSymHBR1/fNa+3tp3tXSwW4/7iEqWlJdTVXfDoa2pqBOC3X3/xGNPcZLZtAzAzM0MoFKK6uppgMMjGxgYlJSUAbG8n6Op6i6bmCKZpomkaPp+fJ0/WGB8fA6C1pQWA2trzRJqbMU2Lqampf4R2tKkFBQUe/8Fg0BMKwMzsHL6iIvr7+z1WtAINyzS5NXIbgI433gTgxeqXqKysZHZulpXVVa8o7ShQJBLBMAzi8Th/PF4mEChmf38fgIfRKNHoI97v6aGhoZH9vT0UoOs6CwvzpNNpamvPoetFXDh/DoChoSF2d5Loup79wJOk68neGV265+fmGBwcpKQkSHf3O6QODhARfH4/iwvzzM8vUP78GVpaWnjt9Q6nRXM5OTzATCYDwPT0NIFAgIqKCl55uY5Uah+fz+dQC18PDABwtaeHv+JbiAjK8fype9MAvPveVS5evIRhGIyPjZ4MeBjYtm22t7dJJBIekLtX7y8uMDx8iyttrdSePYtpmigtu2B09E5Wnc1NNDRc4u7oGMvLj3PMQjvqGsXFxTQ2NtLe3k5HRwe6rmNZGUfW2T5f//I6AMHgc5jOJgcYvTtKIrlDa6SJgN/PxMTkcadxFeiKpr6+ntnZ2ayiNI2+ax9gGGkAdD1rTLdHRpiYnKLtcitFepGn4s3NTaLRKG2XWwEYHrrpqdwtrNC92d3dZXl5mXg87nFeVlbG2toahQUam/E4q468k8kEN258xccffcjSg4eYholSimQywXfffkNVOMTk1D2mp3/PFSH/w7yfJk4y+sLDD//t95Ttn4Zt2znG7iZ01xyedwV47CPyWeFJcep/fO2UKxS3QvuZ0vxHMIACoBpocUDzdS61ybJ5E6Ac+JncY3k+Tt13gBf+Bll2M6p6yA4WAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTAzVDExOjAyOjAzLTA1OjAwnejANgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wM1QxMTowMjowMy0wNTowMOy1eIoAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC' },
			{ name: 'Greenway Trail', imageData: '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' },
			{ name: 'Gym', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIDX5OabAAABCVJREFUSMfFlk1sVFUUx39vpjO0zLRTYNrOiIBhhQstichG0aTyIbhCxIUfNUE+QjDhI7Eu/IgYFwIu1DUUChRaAjVGTVgUsFCgExk2QmuYAdqUzlDbydiWKcy08/4uZt6bjmxMTMtJXu7LPfec//2fe865F6ACOAA8AjQNn5kfDwNzAb7NT2SnCXCq7zYjz8xNTgymT0zAMPLIMyWaaUAcMwkGUPLYDhwODKNwlJIwTdOeN00TSRiGgcPhQBKScDhye/+3fqoPyCXJkwmpxeqll1fQdPQ44XCYixcv8elnnwPwzb79xONx6urqAFi5ajWRSITvvv+BZcteJBqN0hUKseKVVwFYuOgZzp49y507t9m5a3cRhpxOpwDV138gUznJZrOSpGj0tgDt3LVHktR8okWA9n71tSRpx46PtLR2qSxpaPhEgFaveV2p8YeSpGPNJwXIMAzhcDgEqKqqWje7eyRJBw82avny5dq48W1t3rJNgOb5/RocHNKtSFSzPR6FQiE9eJBSIPiUNm36UJI0MjqmtrYfBWjzlq2SpGTybx093lwAtNht2PCWJKmp6VhBme8U1n/j4SOSpN17PtbI6JiO5R3t239AknT5apf+uNEtn2+OWlpa1dd/T3d7+3Sy5ZTtx2FlT91rKwE4c+YMAF6vl8rKSnw+H+5ZswA41drKw0dp6uvfp6LcS/PxZgDS6TQAg/cHCQRqqK6pZv78p+nu7inK+KKk8Xi9AITDvwNw4mQryWSSgYEYq1avAeDKlSvcvHmDpbXPcbUrxPnz5+xSArh+PYx/3lxqa59nybNL+O3CeSYnJwkEAnZ5FLI0Py5cuAiAa9eu0dvbh8cz2y6c0dERTp9uA6DpyGEymRwzv78KgFCoi1RqnPXr38Tr8dDZ2YkAn89XYGhRjkRuAbB27ToA9n75BY2NhwCYmJywDRKJRNEIUFZWRmp8nMH7f3Hnbi9vrFtHJBplaGgYt6sE08w+DniuvR2A7du38c677xVX65TW4CwpKaopyHWXVGqc4cQw8dgAPl8FvXd7SSSGcbndZLNmAdBKmnA4zM+//Irf76fx0EFisRgNDQ02Axs7v96yy+lLKS0tJTZwj46ODgAuXuogMTyEmTWZUzklpFbfy2TSbNu6lZbWU6QzEwSDQcCg8/JV7sfjBYZOZ9GZAyxevNhm393dQyI5Qk/PnwDEYnEWLJhvW9i91DCMfBN2UlVdRVlpKZnMBMlkkvSjh5jKxbW8vJyamhri8TipVAqAQDCI2+Wiv78fl8tFRYWPsbFR0uk0wWAQt9tNX19fMaCV3qYpprOfP3ZbWMlgMQbs0Zq3dNa8YRhgGPb5TrW11j/562kmAWf0EWUxNP+Xm/8IBuAEFgAv5EGn611qkotmO4Af+IniZ/l0vLo7gZp/AGFKbGemCmKQAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTAzVDExOjAyOjAzLTA1OjAwnejANgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wM1QxMTowMjowMy0wNTowMOy1eIoAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC' },
			{ name: 'Kiddie Boats', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIDX5OabAAABGxJREFUSMe9Vk1PVFcYft5z7zDjcKFTA8wkRSyNMDqC0XRlN6bECNoE6g/QRXVvE7tx5Q9oY6oLVzaN/QFFWaDEJvJVqRI0BBaa0IpDxnF0hJFh7nzde54uYK6MNFEa4Une5N73vOc857xf5wBAPYAfRaQIgFsgGgBF5Fefz7cTAH5aG3C3iHD92r+LiBRJ+rAKwdZBAxBZY94ucLsJobaTDADMDzESkQ3fJEFu3jnvdel6gg+FUqpqzvq5gtUa+c9FRQQkEQwG0dLSgsXFRXx1+DAM08TAwADK5bJnsxl49SIiVEpRKUXDMAiAgYCfQ7dvc3x8nBcuXKB2XZLkD+fPEwCVUhvqbvfuFh44cICBQIA+n48i8nZcRFhXZ9E0zSpiAAwGg7x58wYXFhYYCoV49uxZVnDlyhWP0DAMGoZBEWEwGOTY6Biz2SwfPXrEubk59vb2eramZdXi8s+XEY6EMTf3N1zXRaFQQDz+DMePn0Bvby++P3cOpVIJjx8/xtDQEGzbxtWrV70waK0915bKZTQ2NcKyLHR0dMA0TRw6dAgDAwNvY3jjRj/6+r6F4zgwzerELZfLWF5eRrFYxJs3b6C1RjabxcuXKRTyBbx+/Rr/PH2KdDqNXC4Hx3HQ3X0Mfr8fShT8gQBu3RrE9eu/QURWCc+c+Q7Xrv3iJUFF1mfcZpBIJGDncshkMshms8jmVhB/FsfFixdXvRIKhfjkyROSpNaaWmu6a8lR0bmuS8dx6Lqu9/+uaK35LirrPJuf5769e6mUUshkMrh06ZIXExGpqqWKzjAMKKWqGoFSyhMRgdYarut6pVKxrbVq8UkoBFQysqamhoODgyTJVCrF54nEht2m02kmk8kN+qWlJaZSqSqvkGQmk2EymaTjOCTJvr4+eoVPEtFoO5qbd+Hu3bsAgGg0ip6ebli1Fu5NTGB0dBSu6yIWi6H72DFYdXUYHR3BxMRfKJVKaG9rR09PNxoaGzEyPIw/792Dnc9jbzSKb06cwJ0/7rxtbT7Th8COAL5obcXRo0exI7gDIyMjmJp6iHw+j4MHD+LIkSPw+/2YnJzEg/v3kS8UENu3D193daG+vg5jY+OYmnoI286hY/9+dHV1odayMD09jeHhYeRyOaDSKfbHYpydnWWxWPSCXyqVmEwmOT8/z3w+77mqXC4zlUoxHo/Ttm1PXyqVmEqluLCwQDuX8/TFYpH5fJ4nT56kWQnqpzt3oq2tDTU1NXjx4gW01giHw4hEIl6CpF+9guM4CIfDaGpq8vSLi4soFAqIRCJV+qWlJdi2jYaGBgQCAdTX10NEhCTR3PwZTp06jXQ6jckHD+A4Djo6O7CnrR0C4HkigZmZGRQKBXR2duLz1lb4fD4kEgnMzsxgZWUFsVgMe9Y2nUwmMT09jeXlZcRiMXR2dqK/v//919PHRlUf+z9dZTMgCcHaa2qbDqgrR9LbQEYAYojILgBfbvFJtYgopdQYTNNsAHAT657lH1lcrF6+45Zlhf8FomUq9qMT1V0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTItMDNUMTE6MDI6MDMtMDU6MDCd6MA2AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEyLTAzVDExOjAyOjAzLTA1OjAw7LV4igAAAABJRU5ErkJggg==' },
			{ name: 'Library', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIEwfcPzwAABIpJREFUSMelVk1MVFcU/s59A0QJI47iRghGTP0JwhglMVUbxc10000Tu0HrcnBnbOrCjQhdtbEbE0xqbWI3JibdoDGmo3FIlEotNbGB2hggSgVK4FFhZph5792vC+Zd58nIjOlJbmbuffec75zvnnPuBYAwgK9FJAuAqw0RoYiYuVIqMH/H0HndHyoqKiIA8E3+g1cKrJRDqwzf9k8iIlmSFVgWQREREZBEfX09zn55Fi2tLcg5OfwyMICLF7+FbdtmzyqiffslaQTAjRs2MHn/PknS8zx6nkeSvH79OpVS5bKgSwL6xk6fPk2SdF3XAPqghw8fDuxd1R5KiE9T09athl6lFJR6o3rgwIfmWykJldyRl9m5OePA22c1OjoWcK5kEOVQ2trayqmpKZKk1trQ+eTJE0YikffJ5NJJ44O27dvHxM8JTky85Pj4OG/cuMEtjVvepyYpPmox8VM9Go3i4MEDsG0bkUgEe/bsQTabxdDQEBzHgeu4uHvvHiYnJ6FEQVO/P6V+VJ2dnbRtm1prUxILCwtMpVJmzXVd/vH0Kffu3VtOtq5ctCyLAHjkyBGm02lzboVn56/5TpDko0ePuGnTplKgxSOLRNZzeHiYY2Nj7O6+wD9HRgyAASSZSad5N5FgT3c3s9ksL/f2Fu27JQGvXr1Kkrxz5w4BsKG+nh/HYrzc28uBgQHeTST4xZkzjEajXF9by3Xr1nFycpIk+dmxY3lb1uqAPpWd8bihKZFIrEj5UCi0op3V1dUZwPGxMTY3N7+L2mBk0WiU09PThrbBwUHu37+fLS27i/bY6upqtrW1MRaLcWZmxujdvn2blZWVxerzzcKGSIT9/f2BRPB//52fZ0dHh2FCRGhZFi9dukSSXFpaWqHTdf58cUA/uq96egIKfpI4jkOSvHmzL0Dn7uZmzs/PB3QK9XLZLGOxWIBBpZSC1hqNjY3oOH4cAKC1hud5plAtywJJDA7+Ctd1TeN+OTGB3x4/DhS11hpaa+RyOVRUVuLkyZOBRmJavlIKlmUF/osIXNeFiODlixd4+OAhAMDzPIgIFhcXcevWreV53nFf13fKt1kAKiQJEUFXVxfi8Ths28Zfz56hr68PrdEoTp06BcdxMPPPDIZ+H0IymUQ4HMbRo+3YsWMXIutrsZBKoefCBdSEw2hvb0dTUxPsuTnEO+NIJvsDL4JADW7bto0NDQ0mw86dO7fijIqJk8vxo0OHCIBr167lrp07uXnz5hV1GHqb/+fPnxu+ASCTyWBqagrpVAoQgdYallLmXlRKLdNZcOZLS0sYHhkpfiEU3hahUMgkiO9ATU0NamtroXXBDUACBbe7APC0xuzsLBzHMc6KCDzPg+u6Zm9IKUWttdTV1eHHa9fwwfbtyGQyy56LwHEc5HI5lBIRQVVVlXFYa401a9ZgdHQUn584gb9fvYJSSofy0eh0Oq2+u3IF4XDYZKFvqJy3is/IGxIIy7Lw+vVrLCwu5pcoEJErKOMh/D+Hl385JCUUCm10Xfd7AJ/km3d54ZQv2vM8JSIPqqurP/0PPDhJAHgCSA0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTItMDNUMTE6MDI6MDQtMDU6MDBYT/64AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEyLTAzVDExOjAyOjA0LTA1OjAwKRJGBAAAAABJRU5ErkJggg==' },
			{ name: 'Museum', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIEwfcPzwAABAZJREFUSMfNls1vVUUYxn8z5/S0t4VaKbYNLtryUQLFBfa7gAt1B8TWhWw0Rl0I1D/CDW50pW4NQf8CrGmMtAmmlBah7aINRVdFmmBKsJja3nvPOTOvi3vP3C9ahUDim8ydc5/3mfc9M+/MMwegHvgcyADyHJrN9xeBXQBf5AHzJIGUUk+TdEblZxaQM8UWppRCqZzbWutwrTUAIoKIsI3ZJP62s9Bai9a6Am9tbZUgCEowz6vklrVY5R/cLIr74pmkUrUc6jzMm6+/wdDQMJ2dh5idm+eH0VEmJiZYXFzEmPixMy/uXcIkSfGy1NXV0dFxkKGhYY4dG6Svv58ddbXOLyIopVhbe8TVqz8zPjHBlZ9+ZHn5LlEUlpSjImFiNTUpXu3q4tjgAEPDb3Ok8zD19fUugbXW1TOpm+d5bvzqgwdMT88wNjbG5OQkv/16B2NMITkgjY27OTcyQtNLTRzsOMDAwCA7d9bl30VhrUVE0Fq7lSg2EcEYg+d5Jf779/9g8to1VlcfMDc7y8WL3+T4bW175e69FRERsdaKiIgxRmJjxBjjsMSsta6V48YYiePY+aIoEhGRy9+PCiA+gLGGdDrtNorW2hV9qyPyb0enfD8k8f0EiKOIOI6B3CBrLWFYKHwQBGitiePY8UBK8CiOUYDWHkFQBUAYhvi+nx+Tf5FUqlb6+welq7tHpq5fFxGRhYUF6e7ukf6BATl1+i1Zvvu7iIhcuPCZHD3aJcdPnJDjJ16T2bk5ERG59O130t3dIz29vfLBhx+JiEg6nZGPz56Tnt4+OXLklcKSptOb3LgxjYjw16M1ANbX17l16yYAe/a8TCaTBWBp6Tbz87Nu2f98+BCAlZUVx09vbrolvXN7iZu/3HAlcoVygPYq6lRVVYXn5fzV1dXO7/tV+L7vOIWjVVPgVPml8RNSoirlypD4kv8Jz1qLtQYSXhm/8Fw6buut+Jzsf5pwi0tLKQVKbT+0zK0fG4TSTaNVQdKS4nvaKxGHEv4WeEnCxJEIbfGmyYZZd3CdIklOGKIoAiCTzTr+5sZGjmPFiUcS309Uv7q6hpOnTrP/QAcAzS0tnD0/gu95vNDQQMOLDQCcPHWaHfUNpGqqQWna2toB6Ovt49z5T1AK2trb3XK++977RLFhZnoqlzS5od85c6ZEhJ+FJXGWl5dl3779AognIp82NTXz5Vdf09LSwt8bGxhjCcOIMAoJo4gwyulkFMUVeBhFRHGCJ748P47JpDM0NzeRzoSMj1/JKfCuxkZ6e/rIZLP5XZUT5uKbWfHfcVX0a8USBAHr6+vMXJ+qvPGfs1k/n1D0dhfgMzARsSKiAC7xFB/CT9iSD+EpgN3A5TLHs2zJRG4Ce/8BHtQkgRlN/7YAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTItMDNUMTE6MDI6MDQtMDU6MDBYT/64AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEyLTAzVDExOjAyOjA0LTA1OjAwKRJGBAAAAABJRU5ErkJggg==' },
			{ name: 'Teen Center', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAQAAADYBBcfAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQffDAMLAgTB9w/PAAACX0lEQVQ4y53UzWtdZRAG8N97PpKbtIi9pMSAGhpRV+J3d0bc+QH+By78F8StgktRBCWlG6ErV4Jo0bqpBb+oKDa0UNImoGI1bVAqtWjuzbnnjov75hJrhKZzVnNmnnmeGeYdbvNG6oub/oYiHau7vCm0ewCOsj9IqR81kr3YUEpiT5Bti5Qi7Sw0pg6xw9uODJEkQ7fKqDjuBxetumDdY170h/NWXPaSAz7zkxVrzpr0tHUfm8GSM+ZVhxwSkqHCtANut0+hNKO2YF6r1FfomvOce/xu3n06ik7uAcodumthkMc9qdKAx9HXaFXvmvOkh7znugsO4xOruk5JOq46ZkLjugosWpIUEkWI1yNiIYR4JSKeDVGHmIvf4usQZVQhXoiIiPUQ78efcW8UFfahq0TcsAtF/kep56KD7teTUDRoMdDm5Fd96AuLejY96LiT3kar47RNT/hbQZb+L3vYIyp3Oqs15RmVmVx82VMWtWJ34P+tJ5d87wFX9aTdgMsum/WLQmnTSfut5G5rn1qyoa+4EZjwmhNqjTlTlj2vHA0Dpc9Nutuv2d+59OhgIsvroFLnaGXNzzmr+C9jg63sDdAYjIF8k/vdhfGoVVe8bOAvh6350Tm1rQz8zujJVfKoYzy7g0qlrtDHgkJPpc3RMxpJjBinUY43JWVZE6azjo7CVO7+vEu66hHjCY0r4LSjrkmmnXLNEbO2lPr6znnHt9jwljts3PoFqIRUKjUCZX6TSatVj+s2CpWBISrJYJgMtzvdgwVlusujhnu6q8NUFF+qZnw0Ouw3f8eLr/bP/gOnBR/NA7WmZgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0xMi0wM1QxMTowMjowNC0wNTowMFhP/rgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMTItMDNUMTE6MDI6MDQtMDU6MDApEkYEAAAAAElFTkSuQmCC' },
			{ name: 'Walking Trails', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wwDCwIEwfcPzwAAA/VJREFUSMetls1rVFcYxn9n7p1OMgkmSoSkwmBduDGVoFMX7lKLxV2FtkHwoxiEOv4BpsGgTRcuWtwFLNRAcWdBSSSBAZuEpGRhIxInmybF4NRF0Mh0UicfM3PP04W5F0OazG3igZd7OOfc9znP+/HcC7AD+N4YswIojBljZIxZN69gPwMNAD+sLnhhAX2rqqpSJBIJc9b3fZdVZnbVKjIDFIvF9F33t5qcnNQ3HR1hL1hexQjPyGdz+vRpSZK1VpL0ybFja/Y3MRthC6O2pgYASQDEYrGwr5otMayurtKNGzc0Pf2Huru7FY1G/0/uw1cmvMlhKnVRU1NTymQyaj5wIGw4wwP6xbKzfqd6e29JksrlsiTp8ePHisfja85tC9B3sn//fo2MjARg1lp5nidJunDhggA5jrM9QD9MTU1Nmpj4XZI0Pz8fAPnPR48eqa6uLizoxpv+y62trZKkdDqtX+7ckT/y+bxevnwhSerp6VEsFqsY2k3bwi/7w4cOATA0NERNbW2wn8vluHKli6dPn5JKpRgaGiKZTCIJY8zGfjfLHaC+vj5JUsfly3r27FnAcHR0VIAOHvxQ9/v7JUkTExNqaGjYkKm7GTtjDJJ4/vw5Y2NjzM7OkkgkKHseruNQKhaJRqM8eZLhs5MnuXQpxcryCvl8ftPur1ihu3btUk1NjTo7OyVJpVIpkLWrV6++2z70QR3HUTqdliT9s7Cg5eXlILTnzp4VoGg0GgY4HGB9fb2y2awk6dcHD5S6+HUAupDP69Pjx8MyDaefJ06cUKlUkiT9ePOmAHV1dQW9mE6nA02toDjhwjkwMBB8kr784vNgvX+1OmdnZ7Vv377tAfqNf/bMmYDJ4OCgHMeR67oCdO3aNUlSoVAIG9bN2TU2NiqTybzJ1cKCjh49GhQIoFOnTgWXaW9vrwgYKI0xhkgkssYAUqkUzc3NAPT29jI+Po7rulhrAZiammJxsQBAMnkYYJ0f3xdAMJOEtTYwX9b858OHD7l+/ToAnufheR7GGDKZDP399wHIZv8CWOPHt7eIGUni/aYmPjpyBGst5XKZP2dmmH/1it27d/Nxaytjv41RKCyyo24H1rNBVFZWVvhg717a2tq4e+8euVyOZDJJY2MjpWKR6nicmZkZbt++zdLSEsZxHOt5nmk/f56fbt2iXC7jui7ZbJa/czk8aym8fk11PM6ePXtwHGedVEUihmj0PWpra9eEz5fHpaUlWlpamJ6etr6WWoyJ+LcGSCQSJBIJ3sWQhCQLGFdSL9A+PDxsvzp3LlIsFgPR9vP3dmFtOIzB/OeyQZKdm5uLAKO4rtsA9K2WbcWf4S2Y/9c9DjT9C/mS81HiwMSqAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTAzVDExOjAyOjA0LTA1OjAwWE/+uAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wM1QxMTowMjowNC0wNTowMCkSRgQAAAAASUVORK5CYII=' },
		];
		for (var i = 0; i < missing.length; i++) {
			list.uniques.push(missing[i]);
		}

		list[2113] = { id: 2113, name: 'Youth Baseball', imageData: 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAhlJREFUSInF1jGI2lAYwPG/cEOWAwsWzdAhh8NJoKDQIUM7OBR6B11uzObS4XKLJHDQDDfYcoNuOSe5LauUDg4FXQoVCpctU8tl6CDaGwId1MkONqn2er2nRPtNL1++fL8HSd57O2w5dv476DjObDAYJNJclmUMw0jdCSoZZdY4awg1q52/xj59c2+dklFmwU0QozHoOI4w5n3xeFEuC9UC1Ov1mWmaqSVwEATCmOd5DL+FwuDiK1rpo+l+7uK6Lo2zBtffrwEolUqEK+DCoPve5a1t0/3QB37Eedu2MV+ZyYH7T/aRJIlqtcrw6/BXdje+X6vVhDEhsNPpAHBwcMCQOXh8eky73QZA13Uuzi+SAbWnGqVSCc/z6HQ6GIaB4zi36hID+x/7AKiqiu/7MTaZTJAkSRgRBqMYj8aoqkqr1ULXdVzXRdO0zYERqr/U10LWApOKtUAll9sumFOU5QnkswTxP5owqDyeY2EYkk6nAXAuLzl8drgZMPo1LMuiUqmgaRqFQkH4+ZXBqHn3XZerT1d4vgdANp9dWPoSArP57NJ1OPq9SzSbTY6eHyULNpvNW7ler0e5XKZYLAr1WAmMmkYLOoB5coLn+wCkH6Xv3RtjUJZlYdiyrHgcjsbxeDqd/rV+sXcMGqaZUjLK7F/Q3sM95pvvrlA+iug8swQCBDdBql6vJ3dMfCBj2ubdx8Q/Z7OJ2Pri/RNlqLk+UmpInQAAAABJRU5ErkJggg==' };
		
		_addParkAttributesName();
	};

	var _addParkAttributesName = function () {
		var rridx;
		for (var mm = 0; mm < list.uniques.length; mm++) {

			var c = list.uniques[mm];
			
			c.parkAttr = c.name.replace( /\s+/g, '').toUpperCase();
			
			if (c.name === 'Art Center') { c.parkAttr = "ARTSCENTER"; }
			if (c.name === 'Boat Ramp') { c.parkAttr = "BOATRENTALS"; }
			if (c.name === 'Kiddie Boats') { c.parkAttr = "BOATRIDE"; }
			if (c.name === 'Baseball' || c.name === 'Softball' ) { c.parkAttr = "BALLFIELDS"; }
			if (c.name === 'Canoe Launch') { c.parkAttr = "CANOE"; }
			if (c.name === 'Fishing Area') { c.parkAttr = "FISHING"; }
			if (c.name === 'Horseshoe Pit') { c.parkAttr = "HORSESHOE"; }
			if (c.name === 'In Line Hockey') { c.parkAttr = "INLINESKATING"; }
			if (c.name === 'Active Adult Center') { c.parkAttr = "ACTIVE_ADULT"; }
			if (c.name === 'Environmental Education Center') { c.parkAttr = "ENVCTR"; }
			if (c.name === 'Greenway Trail') { c.parkAttr = "GREENWAYACCESS"; }
			if (c.name === 'Teen Center') { c.parkAttr = "TEEN"; }
			if (c.name === 'Restroom') { rridx = mm; }
			
		}

		list.uniques.splice(rridx, 1);

	};

	var _onMarkerClicked = function () {
		// If currentMarker is not null, meaning another marker window is shown,
    // then set showWindow of that marker window to false.
    currentMarker.obj.showWindow = false;
    currentMarker.obj = this;
    this.showWindow = true;
    console.log(this);
	};

	var _generateParkData = function (response) {

		var actsPos = response.data.features;
		actsPos.forEach( function(activity) {
			var processed = {
				id: activity.attributes.OBJECTID,
				name: activity.attributes.LOCATION,
				park: activity.attributes.PARK_NAME,
				subcategory: list[activity.attributes.SUBCATEGORY] || activity.attributes.SUBCATEGORY,
				latitude: activity.geometry.y,
				longitude: activity.geometry.x,
				icon: list[activity.attributes.SUBCATEGORY] ? ('data:image/png;base64,' + list[activity.attributes.SUBCATEGORY].imageData) : 'http://maps.raleighnc.gov/parklocator/images/adult.png',
				showWindow: false,
        onMarkerClicked: _onMarkerClicked
			};

			list.activitiesPos.markers.push(processed);
		});

	};


	(function getAmenitiesData () {

		// First set of amenities (buildings)
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson'
		}).then(_generateList, _logAjaxError);

		// Second set of amenities (outdoors)
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3?f=pjson'
		}).then(_addSecondSet, _logAjaxError);

		// Building amenities join table with parks
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		}).then(_generateParkData, _logAjaxError);

		// Outdoor amenities join table with parks
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		}).then(_generateParkData, _logAjaxError);
		
	})();


	return {
		list: list,
		selectedActivities: selectedActivities
	};
}]);