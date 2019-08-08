var bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
	methodOverride  = require("method-override"),
    express         = require("express"),
    app             = express();

// APP CONFIG

mongoose.connect("mongodb://localhost/amk");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG

var productSchema = new mongoose.Schema({
	productID:  String,
	name:       String,
	material:   String,
	price:      Number
});

var measurementSchema = new mongoose.Schema({
	_ID:        Number,
	productID:  Number,
	batch:      String,
	machineID:  Number,
	quantity:   Number,
	serial:     String,
	worker:     String,
	date:       String,
	d1:         Number,
	d2:         Number,
	length:     Number,
	roundLeft:  Number,
	roundRight: Number
});


var Product = mongoose.model("Product", productSchema);
var Measurement = mongoose.model("Measurement", measurementSchema);

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/products", function(req, res){
	res.render("products");
});


app.get("/products/deleteProduct", function(req, res){
	Product.find({}, function(err, allProducts){
		if(err){
			console.log(err);
		}else{
			res.render("deleteProduct", {products: allProducts});
		}
	});
});

app.get("/addMeasurement", function(req, res){
	res.render("addMeasurement");
});

// NEW ROUTE

app.get("/products/createProduct", function(req, res){
	res.render("createProduct");
});



// CREATE ROUTE

app.post("/products/createProduct", function(req, res){
	Product.create(req.body.product, function(err, newlyCreated){
		if(err){
			console.log(err);
			res.render("/products");
		}else{
			//redirect back to product page
			res.redirect("/products");
		}
	});
});

// SHOW ROUTE

app.get("/products/viewProducts", function(req, res){
	Product.find({}, function(err, allProducts){
		if(err){
			console.log(err);
		}else{
			res.render("viewProducts", {products: allProducts});
			console.log("all " + allProducts.length);
		}
	});
	// res.render("viewProducts");
});

// EDIT ROUTE

app.get("/products/viewProducts/:id/edit", function(req, res){
	Product.findById(req.params.id, function(err, foundProduct){
		if(err){
			console.log(err);
		}else{
			res.render("edit", {product: foundProduct});
		}
	})
});

// UPDATE ROUTE

app.put("/products/viewProducts/:id/edit", function(req, res){
	Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatebProduct){
		if(err){
			console.log(err);
			res.redirect("/products/viewProducts");

		}else{
			res.redirect("/products/viewProducts");
		}
	})
})


// DELETE ROUTE
app.get("/products/viewProducts/:id/delete", function(req, res){
	Product.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/products/viewProducts");
		}else{
			res.redirect("/products/viewProducts");
		}	
	})
});

//Sever creation

app.listen(3000, function(){
	console.log("Server started !");
});
