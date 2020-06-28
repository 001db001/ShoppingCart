const readline = require('readline');
const chalk = require('chalk');
const Inventory = require('./inventory');
const Cart = require('./cart');

const inventory = new Inventory();
const cart = new Cart();

const read = readline.createInterface(process.stdin, process.stdout);

let inventoryStage = true;

console.log("Welcome to Inventory Tracker and Shopping Cart\n");
console.log("First, we need to stock up our inventory.");
console.log("To add an item to inventory input: command to add = 'ADD', sku = '1', name of the product = 'T-Shrt', quantity = '5' and price = '5.99'  e.g. ADD 1 T-Shirt 3 5.99\n");


read.setPrompt(`Add your command => `)
read.prompt();
read.on('line', function (answer) {

    const itemArray = answer.toString().trim().split(' ');

    const command = itemArray.shift();


    if (inventoryStage) { // Checks if we are in inventory stage of program.
        switch (command) {
            case "ADD": // Adds an inventory item to array.
                if (!isValidInventory(itemArray)) { // Checks if input is valid.
                    console.log(chalk.red('Not valid input'));
                    read.prompt();
                    return;
                }
                read.setPrompt(`Input ('END') to leave inventory and to go shopping `);

                try {
                    inventory.add(itemArray);
                } catch (err) {
                    console.log(chalk.bgRed(err));
                }
                read.prompt();

                break;

            case "END": // Switches from inventory stage to cart stage.
                inventoryStage = false
                console.log(chalk.green("Welcome to Shopping Cart\n"));
                console.log(chalk.green("To add to cart, input: command to add = 'ADD', identification number (sku) = '1' quantity = '1'; e.g. ADD 1 1 => "));
                break;
        };
    } else {
        switch (command) {
            case "ADD": // Adds an cart item to array.
                if (!isValidCart(itemArray)) { // Checks if input is valid.
                    console.log(chalk.red('Not valid input'));
                    read.prompt();
                    return;
                }
                read.setPrompt(`'REMOVE' - Removes an item from the shopping cart,\n'CHECKOUT '- Prints all items\n'END' - exits program => `)
                try {
                    const inventoryItem = inventory.getById(itemArray[0]);
                    if (inventoryItem) {
                        cart.add(itemArray);
                        inventory.remove(itemArray);
                    } else {
                        console.log(chalk.red('Item is not in the inventory!'));
                    };

                } catch (err) {
                    console.log(chalk.bgRed(err));
                }
                break;

            case "REMOVE": // Decrements quantity of cart item by an amount that was given. If quantity is at 0 or below, removes the item from the array.
                if (!isValidCart(itemArray)) { // Checks if input is valid.
                    console.log(chalk.red('Not valid input'));
                    read.prompt();
                    return;
                }
                try {
                    cart.remove(itemArray[0], itemArray[1]);
                } catch (err) {
                    console.log(chalk.bgRed(err));
                }
                break;

            case "CHECKOUT": // Prints all items and total price
                try {
                    cart.checkout(inventory.items);
                } catch (err) {
                    console.log(chalk.bgRed(err));
                }
                break;
            case "END": // Closes a program
                read.close();
                break;
        };
        read.prompt();
    }

});

/**
 *Checks if input is valid.
 *
 * @param {*} input - An array that consists of SKU, name, quantity, price.
 * @returns true if input is valid and false if it is not.
 */
function isValidInventory(input) {
    if (numberCheck(input[0]) && numberCheck(input[2]) && numberCheck(input[3]) && !(input.length > 4)) {
        return true;
    } else {
        return false;
    }
}

/**
 *Checks if input is valid.
 *
 * @param {*} input - An array that consists of SKU, quantity.
 * @returns true if input is valid and false if it is not.
 */
function isValidCart(input) {
    if (numberCheck(input[0]) && numberCheck(input[1]) && !(input.length > 4)) {
        return true;
    } else {
        return false;
    }
}

/**
 *Checks if given input is a number.
 *
 * @param {*} number - A variable by which we check if it is a number.
 * @returns true if number is valid and false if it is not.
 */
function numberCheck(number) {
    return !isNaN(number) && number > 0;
}

read.on('close', function () {
    console.log(chalk.cyanBright(`The program was closed`));
    process.exit();
})