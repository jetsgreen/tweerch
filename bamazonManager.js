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
       
    });
};

function viewLowInventory() {
    var sqlQuery = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 10";
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
            name: "Name",
            type: "input",
            message: "What product id would you like to re-stock?",
            filter: Number
        },
        {
            name: "Quantity",
            type: "input",
            message: "What is the quantity you would like to add?",
            filter: Number
        }

    ]).then(function (answers) {

        var itemAdd = answers.Name
        var unitsAdded = answers.Quantity

        console.log("You have choosen item number: " + itemAdd + " To be increased by: " + unitsAdded);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    item_id: itemAdd
                },
                {
                    stock_quantity: unitsAdded
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products updated!\n");

            }
        );
        console.log(query.sql);
        productsForSale();
    })

}
function addProduct() {

    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Please enter the new product name.",
        },
        {
            type: "input",
            name: "department_name",
            message: "Which department does the new product belong to?",
        },
        {
            type: "input",
            name: "price",
            message: "What is the price per unit?",
            filter: Number
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "How many items do you want to add to stock?",
            filter: Number
        }
    ]).then(function (answers) {

        console.log("Adding New Item: \n    product_name = " + answers.product_name + "\n" +
            "    department_name = " + answers.department_name + "\n" +
            "    price = " + answers.price + "\n" +
            "    stock_quantity = " + answers.stock_quantity);
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_quantity: answers.stock_quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
            }
        );
        productsForSale();
        console.log(query.sql);

    })
}




