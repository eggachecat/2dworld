var arts = angular.module('app', ["firebase", 'ngAnimate',  'ngMaterial', 'ngMessages']);

arts.service('basicService', function(){
	var ATOM_SIZE = 10;
	var GRIDS = 100;

	var map = { width: ATOM_SIZE*GRIDS, height: ATOM_SIZE*GRIDS };
	var directions = {
		"right":  { mx: ATOM_SIZE, my: 0 },
		"left":   { mx: -ATOM_SIZE, my: 0 },
		"up": 	  { mx: 0, my: ATOM_SIZE },
		"down":   { mx: 0, my: -ATOM_SIZE },
	}
	var brick = {
		"height": ATOM_SIZE,
		"width": ATOM_SIZE	
	}

	this.brick = brick
	this.directions = directions;
	this.nextHead = function(head, direction){
		return {
			x: (head.x + direction.mx) % map.width,
			y: (head.y + direction.my) % map.height
		}
	}
	this.moveSettings = {
		"x": function(d){ return d.x },
		"y": function(d){ return d.y }
	}
})

arts.service('snakeService', function(commonService, basicService){
	var snakeObj = {
		bodies: [ {x:100, y:100} ],
		selecter: ".snake",
		styles: {
			fill: "rgb(0, 0, 255)"
		},
		static: {
			class: "snake"
		},
		direction: {
			mx: 10, 
			my: 0
		}
	}

	var drawSnake = function(){
		return commonService.draw(snakeObj.bodies, snakeObj.selecter, snakeObj.static, snakeObj.styles);
	}

	function move(){
		var currentHead = snakeObj.bodies[0]
		var currentHead = basicService.nextHead(currentHead, snakeObj.direction)
		snakeObj.bodies.unshift(currentHead);
		snakeObj.bodies.pop();
	}

	function forage(foodsObj){
		var head = snakeObj.bodies[0];
		angular.forEach(foodsObj.locations,function(food, index){
			if(food.x == head.x && food.y == head.y){
				snakeObj.bodies.unshift(angular.copy(food));
				foodsObj.locations.splice(index, 1);

				return
			}
		})
	}

	function steer(dir){
		snakeObj.direction = basicService.directions[dir];
	}

	function paint(color){
		snakeObj.styles.fill = color;
	}


	this.snake = snakeObj;
	this.drawSnake = drawSnake;
	this.move = move;
	this.forage = forage;
	this.steer = steer;
	this.paint = paint;
})

arts.service('foodsService', function(commonService){
	var foodsObj = {
		locations: [ {x:130, y:100},{x:500, y:100} ],
		selecter: ".food",
		styles: {
			fill: "rgb(255, 0, 0)"
		},
		static: {
			class: "food"
		}
	}

	var drawFoods = function(){
		return commonService.draw(foodsObj.locations, foodsObj.selecter, foodsObj.static, foodsObj.styles);
	}

	this.foods = foodsObj;
	this.drawFoods = drawFoods;
	//this.makeFood
})

arts.service('commonService', function(basicService){

	var basicAttrs = basicService.brick;
	var moveSettings = basicService.moveSettings

	var draw = function(dataSet, selecter, staticAttrs, dynamicAttrs){
		var sections = d3.select('svg').selectAll(selecter);
		var items = sections.data(dataSet);
		var newItem = items.enter();
		var vanishItem = items.exit();
		items
			.attr(basicAttrs).attr(moveSettings)
			.attr(dynamicAttrs)
		newItem.append("rect")
			.attr(basicAttrs).attr(moveSettings)
			.attr(staticAttrs)
			.attr(dynamicAttrs)
		vanishItem.remove()
	}

	this.draw = draw;
})


arts.controller('SnakeController', function($scope, $interval, $mdSidenav, $timeout,snakeService, foodsService){
// some ui settings
	function buildToggler(navID) {
      return function() {
        $mdSidenav(navID).toggle();
      }
    }
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
	$scope.toggleRight = buildToggler('right');

	$scope.paint = function(snake_color){
		snakeService.paint("rgb(" + snake_color.r + ","
								  + snake_color.g + ","
								  + snake_color.b + ")")
	}


	var game = $interval(function(){
		snakeService.drawSnake();
		foodsService.drawFoods();
		snakeService.move();
		snakeService.forage(foodsService.foods);
	},40)
	// while(true){
	// 	snakeService.drawSnake();
	// 	foodsService.drawFoods();
	// 	snakeService.move();
	// 	snakeService.forage(foodsService.foods);
	// }
})
