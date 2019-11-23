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


    managerChoice();

});

function managerChoice() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ]).then(function (answer) {


        switch (answer.choices) {
            case "View Products for Sale":
                productsForSale();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }
    });
};


function productsForSale() {
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
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~ Products for Sale ~~~~~~~~~~~~~~~~~~~~~");
        console.log(table.toString());
        viewLowInventory();
    });
};

function viewLowInventory() {
    var sqlQuery = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 20";
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;

        console.log("~~~~~~~~~~~~~~~~~~~~~ Low Inventory ~~~~~~~~~~~~~~~~~~~~~");
        for (var i = 0; i < res.length; i++) {
            console.log("Item Id number: " + res[i].item_id + "||" + res[i].product_name);

        }
        addInventory();
    })
}

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Which item id would you like to add to?",
            filter: Number
        },
        {
            type: "input",
            name: "amount",
            message: "How many would you like to add?",
            filter: Number
        }

    ]).then(function (answers) {
            
            var itemAdd = answers.item
            var unitsAdded = answers.amount
        
                console.log("You have choosen item number: " + itemAdd + " To be increased by: " + unitsAdded);
                inquirer.prompt([
                    {
                    type: "confirm",
                    name: "confirmation",
                    message: "Are you sure you would like to proceed?",
                    
                }

                ]).then(function (answers){
                    var response;
                    if(response === answers.true ){
                      
                      
                    }else{
                        connection.end();
                    }

                }) 

        })

}


