angular
.module("wsApp", ['ui.bootstrap'])
.run(function ($templateCache) {
	//$templateCache lets us create templates directly in our HTML document, which I thought was useful for this excercise
	$templateCache.put('sonoma-template.html', 'main-nav.html', 'breadcrumbs.html', 'product-component.html', 'carousel.html', 'product-details.html', 'user-cart.html', 'myModalContent.html');
})
// We create a mock service here that we could replace with a real backend call someday.
.service("mockService", function ($http) {
	this.getProducts = () => {
		return mockProductData; //Returns global variable from mockData.js
	}
})
.service("mockUserService", function ($http) {
	this.getUser = () => {
		return mockUserData; //Returns global variable from mockData.js
	}
})
.controller("mainController", function (mockService, mockUserService) {
	this.productVariations = mockService.getProducts()
	this.user = mockUserService.getUser();
})
.component('sonomaLogo', {
	templateUrl:'sonoma-template.html',
})
.component('mainNav', {
	templateUrl:'main-nav.html',
	controller: function mainNavController () {
		this.navItems = ["COOKWARE", "COOKS' TOOLS", "CUTLERY", "ELECTRICS", "BAKEWARE", "FOOD", "TABLE & BAR", "HOMEKEEPING", "OUTDOOR", "SALE"]
		this.homeNavItem = "WILLIAMS-SONOMA HOME"
	}
})
.component('productComponent', {
	templateUrl: 'product-component.html',
	controller: function () {
		this.$onInit = () => {
			this.currentProduct = this.productVariations[0];
		}

		this.changeProduct = (productId) => {
			for (var i = 0; i < this.productVariations.length; i++) {
				if(productId === this.productVariations[i].product.id){
					this.currentProduct = this.productVariations[i];
					break;
				}
			}
		}

		this.pushProduct = (productObj) => {
			if(!this.currentUser.userCart.length){
				this.currentUser.userCart.push(productObj)
			} else {
				var alreadyInCart = false;
				for (var i = 0; i < this.currentUser.userCart.length; i++) {
					if (this.currentUser.userCart[i].product.id === productObj.product.id) {
						this.currentUser.userCart[i].qty = productObj.qty
						alreadyInCart=true;
						break;
					}
				}
				if (!alreadyInCart) this.currentUser.userCart.push(productObj);
			}
		}

	},
	bindings: {
		productVariations: "<",
		currentUser:"="
	}
})
.component('breadCrumbs', {
	templateUrl:'breadcrumbs.html',
	bindings: {
		currentProduct: "<"
	}
})
.component('carousel', {
	templateUrl: 'carousel.html',
	bindings: {
		productVariations: "<",
		currentProduct: "<",
		changeProduct: "&"
	}
})
.component('productDetails', {
	templateUrl: 'product-details.html',
	controller: function ($uibModal) {
		this.$onInit = () => {

			this.productToAdd = {};

			this.active1 = false;
			this.active2 = false;
			this.active3 = false;

			this.img1 = 'arrow-collapsed.png';
			this.img2 = 'arrow-collapsed.png';
			this.img3 = 'arrow-collapsed.png';
		}

		this.activation = (option) => {
			this['active'+option] = !this['active'+option]; 
			this['img'+option] = this['active'+option] ? 'arrow-expanded.png' : 'arrow-collapsed.png'
		}

		this.addToCart = () => {
			this.productToAdd.product = angular.copy(this.currentProduct.product);
			if(this.productToAdd.qty > 0) {
				this.pushProduct({productObj: angular.copy(this.productToAdd)});
			}
		}

	},
	bindings: {
		productVariations: "<",
		currentProduct: "<",
		pushProduct: "&"
	}
})
.component('userCart', {
	templateUrl: 'user-cart.html',
	controller: function () {
		this.$onInit = () => {
			this.subtotal = '0.00';
			this.showCartFloating = false;
			this.initCartFloat = () => {
				var findSubtotal = () => {
					var subtotal = 0;
					for (var i = 0; i < this.currentUser.userCart.length; i++) {
						subtotal+=Number(this.currentUser.userCart[i].product.price * this.currentUser.userCart[i].qty);
					}
					return parseFloat(Math.round(subtotal * 100) / 100).toFixed(2);
				}
				this.subtotal = findSubtotal();
				this.showCartFloating = true;
			}
			this.hideCartFloat = () => {
				this.showCartFloating = false;
			}
		}


	},
	bindings: {
		currentUser: "<"
	}
})
.component('userCartExpanded', {
	templateUrl: 'user-cart-expanded.html',
	bindings: {
		currentUser: "<",
		subtotal: "<"
	}
})

