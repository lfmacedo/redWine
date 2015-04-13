/**
 * 
 */
var app = angular.module('store',['ngRoute']);

app.config(['$routeProvider',function($routeProvider) {
	
	$routeProvider.
	when('/',{controller: 'MainCtrl',templateUrl:'partials/store.html'}).
	when('/vinhos/:vinhoSku',{controller:'ProductCtrl',templateUrl:'partials/product.html'}).
	when('/cart',{controller:'CartCtrl',templateUrl:'partials/cart.html'}).
	otherwise({redirectTo:'/'});
	
}]);


//app.run([ '$rootScope' ,'$http','$localstorage', function($rootScope,$http,localstorage){
//	
//	localStorage.clear();
//}]);

// ----------- Directives

app.directive('cartTitle',function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/cart-titles.html'
	};
});


// CONTROLLER

app.controller('MainCtrl', ['$scope','$http','CartService','$localstorage', function($scope,$http,CartService,$localstorage){

	$http.get("api/vinhos").success(function(data) {
		$scope.vinhos = data;
		//$scope.count = data.length;
		//console.log(data);
	}).
	error(function(){
		console.log('Error on get json');
	});
	
	this.addCart = function(sku,name,price,quantity) {
		CartService.add({
			sku: sku,
			name: name,
			price: price,
			quantity: quantity
		});
//		$scope.ItemsQtd = CartService.getQtd();
//		$scope.Total = CartService.getTotal();
		$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
		$scope.Total = priceTotal($localstorage.getObject('cart'));
	}

//	$scope.ItemsQtd = CartService.getQtd();
//	$scope.Total = CartService.getTotal();
	$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
	$scope.Total = priceTotal($localstorage.getObject('cart'));
	
	console.log($localstorage.getObject('cart'));
}]);


app.controller('ProductCtrl', ['$scope','$http','$routeParams','CartService','$localstorage',function($scope,$http,$routeParams,CartService,$localstorage){
	$http.get("api/vinhos/"+$routeParams.vinhoSku)
		.success(function(data){
			$scope.item = data;
		})
		.error(function(){
			console.log('Error on get Json');
		});
	
	this.addCart = function(sku,name,price,quantity) {
		CartService.add({
			sku: sku,
			name: name,
			price: price,
			quantity: quantity
		});
		
		$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
		$scope.Total = priceTotal($localstorage.getObject('cart'));
	}
	
	
	this.clearItems = function() {
		
		CartService.clear();
		$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
		$scope.Total = priceTotal($localstorage.getObject('cart'));

	}
	

	$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
	$scope.Total = priceTotal($localstorage.getObject('cart'));
	
}]);


app.controller('CartCtrl', ['$scope','$http','CartService','$localstorage',function($scope,$http,CartService,$localstorage){
	
	// nao está sumindo do cart quando limpo o cart
	var cart = CartService.list();
//	if(cart.length<1 && itemsQtd($localstorage.getObject('cart'))>0)
//	{
//		cart = $localstorage.getObject('cart');
//	}

	$scope.list = function() { 
	
		return cart;
	}
	
	
	this.clearItems = function() {
	
		CartService.clear();
		
		$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
		$scope.Total = priceTotal($localstorage.getObject('cart'));

	}
	
	
	this.addCart = function(sku,name,price,quantity) {
		CartService.add({
			sku: sku,
			name: name,
			price: price,
			quantity: quantity
		});
		

		$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
		$scope.Total = priceTotal($localstorage.getObject('cart'));
	}
	
	this.checkOut = function() {
		Finish(CartService.list());
	}
	
	
	$scope.ItemsQtd =  itemsQtd($localstorage.getObject('cart'));
	$scope.Total = priceTotal($localstorage.getObject('cart'));


}]);


// FACTORY

app.factory('CartService',['$localstorage',function($localstorage) {
	var cart = [];

	if($localstorage.getObject('cart').length>0)
	{
		cart = $localstorage.getObject('cart');
	}
	
	return {
		list: function() {
			return cart;
			//return $localstorage.getObject('cart');
		},
		add: function(item) {
	
			if(Number(item.quantity)!=0) {
				
				// Verifica se o item já existe no Carrinho (pelo SKU)
				var found = false;
				//for(var i = 0; i < cart.length && !found; i++)
				for(var i = 0; i < $localstorage.getObject('cart').length && !found; i++)
				{
					// item existe, altera a quantidade no carrinho
					//if(item.sku == cart[i].sku)
					if(item.sku == $localstorage.getObject('cart')[i].sku)
					{
						found = true;
						var newCartItemQtd = {
											sku: $localstorage.getObject('cart')[i].sku,
											name: $localstorage.getObject('cart')[i].name,
											price: $localstorage.getObject('cart')[i].price,
											quantity: Number($localstorage.getObject('cart')[i].quantity + item.quantity)
										};
						
						// quantidade inferior a 1 entao remove do carrinho
						if(newCartItemQtd.quantity <= 0)
						{
							cart.splice(i, 1);
							//armazena no local
							$localstorage.clearObject();
							$localstorage.setObject('cart', cart);
							break;
						}
						// altera a quantidade do item
						cart[i] = newCartItemQtd;
						
						console.log($localstorage.getObject('cart'));
						
						//armazena no local
						$localstorage.clearObject(); // quando limpei o objeto perdi os itens anteriores!!!
						$localstorage.setObject('cart', cart);
						
						console.log($localstorage.getObject('cart'));
						//console.log(cart);
						//cart = $localstorage.getObject('cart');
				
					}				
				}
				// novo item, add no carrinho
				if(!found)
				{
					cart.push(item);
					//armazena no local
					$localstorage.clearObject();
					$localstorage.setObject('cart', cart);
					//console.log(cart);
				}
				//console.log(JSON.stringify(cart));
			}
		},
		clear: function() {
			cart = [];
			$localstorage.clearObject();
		}		
	};
}]);


// LOCALSTORAGE
app.factory('$localstorage',['$window',function($window){
	return {
		setObject: function(key,value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		clearObject: function() {
			localStorage.clear();
		},
	}
}]);

// Mostra o objeto final do carrinho
function Finish(cartList) {
	var finishCart = JSON.stringify(cartList);
	$(".box-cart-finish").show();
	$("#cartObject").html(finishCart);
}

// Retorna a quantidade de itens do carrinho
function itemsQtd(cart) {
	var total = 0;
		
		for(var i=0; i<cart.length; i++) {
			total += Number(cart[i].quantity);
		}
		return total;
}


// Retorna o valor Total do carrinho
function priceTotal(cart) {
	var total = 0;
	for(var i=0; i<cart.length; i++) {
		total += Number(cart[i].price * cart[i].quantity);
	}
	return total;
}
