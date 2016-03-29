var arts = angular.module('app', ["firebase", 'ngAnimate',  'ngMaterial', 'ngMessages']);


arts.controller('SnakeController', ['$scope', '$interval', '$mdSidenav', function($scope, $interval, $mdSidenav){

	function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            console.log("right menu");
          });
      }
    }
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    var SNACK_STYLE = {
    	r: 0,
    	g: 0,
    	b: 0
    }
    $scope.SNACK_STYLE = SNACK_STYLE;

	var ATOM_SIZE = 50;
	var MAP = {
		width: 10000,
		height: 10000
	}
	var SNAKE_BODIES = [
		{x:150, y:100},
		{x:100, y:100}
	]
	var SNAKE_FOODS = [
		{x:500, y:500},
		{x:300, y:100}
	]
	$scope.SNAKE_FOODS = SNAKE_FOODS;
	var SNAKE_SPECIES = {
		"body": "body",
		"food": "food"
	}
	var SNAKE_DRECTIONS = {
		"right":  { mx: ATOM_SIZE, my: 0 },
		"left":   { mx: -ATOM_SIZE, my: 0 },
		"up": 	  { mx: 0, my: ATOM_SIZE },
		"down":   { mx: 0, my: -ATOM_SIZE },
	}

	var SNAKE_BRICK = {
		"height": ATOM_SIZE,
		"width": ATOM_SIZE
	}

	function drawSnake(){
		draw(SNAKE_BODIES, SNAKE_SPECIES.body, SNAKE_BRICK, {
			"x": function(d){return d.x},
			"y": function(d){return d.y}
		})
	}

	function drawFood(){
		draw(SNAKE_FOODS,  SNAKE_SPECIES.food, SNAKE_BRICK, {
			"x": function(d){return d.x},
			"y": function(d){return d.y}
		})
	}

	function draw(dataSet, species, staticAttrs, dynamicAttrs){
		var sections = d3.select('svg').selectAll("." + species);
		var items = sections.data(dataSet);
		var newItem = items.enter();
		var vanishItem = items.exit();
		items.transition()
			.attr(staticAttrs).attr(dynamicAttrs)
		newItem.append("rect").transition()
			.attr("class", species)
			.attr(staticAttrs).attr(dynamicAttrs)
		vanishItem.remove()
	}

	function snakeMeetFood(){
		var head = SNAKE_BODIES[0];
		angular.forEach(SNAKE_FOODS,function(food, index){
			if(food.x == head.x && food.y == head.y){
				SNAKE_BODIES.unshift(food);
				SNAKE_FOODS.splice(index, 1);
				return
			}
		})
	}

	function move(){
		var newHead = moveAhead(SNAKE_BODIES[0])
		SNAKE_BODIES.unshift(newHead);
		SNAKE_BODIES.pop();
	}
	function moveAhead(head){
		return {
			x: (head.x + direction.mx) % MAP.width,
			y: (head.y + direction.my) % MAP.height
		}
	}

	var direction = SNAKE_DRECTIONS.right;
	var level = 1000;
	drawSnake();
	drawFood();
	console.log("hi")
	$scope.toggleRight = buildToggler('right');


	$interval(function(){
			console.log("hi")

		move();
		drawSnake();
		drawFood();
		snakeMeetFood();
	},level)


}])
