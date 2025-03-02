Webflow.push(function () {
    // Default value for amount input
    document.querySelector('.ff-ammount-input-field').value = "1";

    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    let productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;
    productPrice = `$${productPrice}`;

    // Function to get image URL from background-image style
    function getImageUrl(element) {
        let style = window.getComputedStyle(element);
        let backgroundImage = style.getPropertyValue('background-image');
        let url = backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
        return url ? url[1] : null;
    }

    // Function to update the cart number
    function updateCartNumber() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalAmount = 0;

        // Sum the amounts of all items in the cart
        cartItems.forEach(item => {
            totalAmount += parseInt(item.amount, 10); // Ensure amount is an integer
        });

        // Log for debugging
        console.log('Cart Items:', cartItems);
        console.log('Total Amount:', totalAmount);

        // Update the cart number element
        const cartNumber = document.querySelector('.ff-cart-number'); // Fix selector
        if (cartNumber) {
            cartNumber.innerText = totalAmount;  // Set the cart number
        }
    }

    // Function to update the total price
    function updateTotalPrice() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalPrice = 0;

        // Sum the total price of all items in the cart
        cartItems.forEach(item => {
            let price = parseFloat(item.productPrice.replace('$', '')); // Remove '$' and parse float
            totalPrice += price * item.amount; // Multiply price by the quantity
        });

        // Update the total price element
        const totalPriceElement = document.querySelector('.ff-cart-display-total-price');
        if (totalPriceElement) {
            totalPriceElement.innerText = `Total price: $${totalPrice.toFixed(2)}`; // Format to two decimals with label
        }
    }

// Function to render cart items from localStorage
function renderCartItems() {
    const gridContainer = document.querySelector('.ff-cart-display-grid');
    const emptyCartMessage = document.querySelector('.ff-emply-cart');
    const totalPriceElement = document.querySelector('.ff-cart-display-total-price');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // If the cart is empty, display the empty cart message
    if (cartItems.length === 0) {
        gridContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        totalPriceElement.style.display = 'none'; // Hide total price when the cart is empty
    } else {
        // Display the grid and hide the empty cart message
        gridContainer.style.display = 'grid';
        emptyCartMessage.style.display = 'none';
        totalPriceElement.style.display = 'block'; // Show total price when the cart is not empty

        // Clear the grid first before re-rendering the items
        gridContainer.innerHTML = ''; // Clear existing content

        // Render each cart item directly into the grid container
        cartItems.forEach(item => {
            const image = document.createElement('img');
            const nameDiv = document.createElement('div');
            const priceDiv = document.createElement('div');
            const amountContainer = document.createElement('div');
            const minusDiv = document.createElement('div');
            const inputDiv = document.createElement('input');
            const plusDiv = document.createElement('div');

            // Set content for each cell
            image.src = item.productImageUrl;
            image.alt = item.productName;
            image.classList.add('ff-cart-display-item-image');
            nameDiv.innerText = item.productName;
            priceDiv.innerText = item.productPrice;

            // Create the input field for quantity
            inputDiv.type = 'number';
            inputDiv.value = item.amount;
            inputDiv.min = '1'; // Minimum quantity is 1
            inputDiv.classList.add('quantity-input'); // Add a class for easy styling

            // Create the minus and plus buttons
            minusDiv.classList.add('quantity-decrease');
            minusDiv.innerText = '-';
            plusDiv.classList.add('quantity-increase');
            plusDiv.innerText = '+';

            // Add event listeners for input change and button clicks
            inputDiv.addEventListener('input', (e) => {
                const newAmount = parseInt(e.target.value);
                if (newAmount >= 1) {
                    item.amount = newAmount; // Update the item amount
                    updateCartInLocalStorage(cartItems); // Update localStorage
                }
            });

            minusDiv.addEventListener('click', () => {
                if (item.amount > 1) {
                    item.amount -= 1; // Decrease the quantity
                    inputDiv.value = item.amount;
                    updateCartInLocalStorage(cartItems); // Update localStorage
                }
            });

            plusDiv.addEventListener('click', () => {
                item.amount += 1; // Increase the quantity
                inputDiv.value = item.amount;
                updateCartInLocalStorage(cartItems); // Update localStorage
            });

            // Append the quantity controls to the container
            amountContainer.appendChild(minusDiv);
            amountContainer.appendChild(inputDiv);
            amountContainer.appendChild(plusDiv);

            // Append each item to the grid container
            gridContainer.appendChild(image);
            gridContainer.appendChild(nameDiv);
            gridContainer.appendChild(priceDiv);
            gridContainer.appendChild(amountContainer);
        });
    }
}

// Function to update cart in localStorage
function updateCartInLocalStorage(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


    addToCartButton.addEventListener('click', function () {
        const amount = parseInt(amountInput.value, 10);
        let sideDishes = [];

        // Check if any side dishes are selected
        if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
            const sideDishCheckboxes = sideDishDiv.querySelectorAll('input[type="checkbox"]:checked');
            sideDishCheckboxes.forEach(function (checkbox) {
                sideDishes.push(checkbox.value);
            });
        }

        // Get the product image URL
        const productImageElement = document.querySelector('.ff-food-item-image');
        const productImageUrl = getImageUrl(productImageElement); // Get image URL
        
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the item is already in the cart
        let existingItem = cartItems.find(item => 
            item.productSerialNumber === serialNumber && 
            JSON.stringify(item.sideDishes || []) === JSON.stringify(sideDishes)
        );

        if (existingItem) {
            // If the item exists, increase the amount
            existingItem.amount += amount;
        } else {
            // If the item is new, add it to the cart
            let newItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount,
                productImageUrl: productImageUrl,
                sideDishes: sideDishes
            };
            cartItems.push(newItem);
        }

        // Save updated cart items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update cart number and total price
        updateCartNumber();
        updateTotalPrice();

        // Re-render cart items
        renderCartItems();
    });

    // Update the cart number, total price and render items when the page loads
    updateCartNumber();
    updateTotalPrice();
    renderCartItems();
});
