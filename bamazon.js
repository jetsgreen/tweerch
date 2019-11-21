var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~ Welcome to Bamazon ~~~~~~~~~~~~~~~~~~~~~");
    displayItems();
    

});
function displayItems() {
    var sqlQuery = "SELECT * FROM products";
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            
            var table = new Table({
                head: ["Item Id", "Product Name", "Price", "Items Left"],
                colWidths: [15, 15, 15, 15],
                colAligns: ["center", "left", "left", "left"]
            })
        }
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        purchase();
    });
 }





function purchase() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter the Item ID which you would like to purchase.",
            filter: Number
        },

        {
            type: "input",
            name: "quantity",
            message: "How many do you need?",
            filter: Number
        }
    ]).then(function (answers) {
        // var selection = answers.item_id;
        var amount = answers.quantity;


        connection.query("SELECT * FROM products", function (err, results) {
            if (err) throw err;


            let indexNum

            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === answers.item_id) {
                    indexNum = i
                }

            }
            var totalCost = answers.quantity * results[indexNum].price;
            console.log("You've selected  " + amount + "||" + results[indexNum].product_name);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("Your total is " + totalCost);
            console.log("Thank you for shopping at Bamazon, come again!!");
            console.log("Inventory Updated");
            
            connection.query(
                "UPDATE products SET ? WHERE ?", [{
                    stock_quantity: results[indexNum].stock_quantity - answers.quantity
                },
                {
                    item_id: answers.item_id
                    
                }
                
            ],
          

            );

            displayItems();
            

        });

    });

}



