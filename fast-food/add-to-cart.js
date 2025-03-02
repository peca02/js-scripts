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

    if (cartItems.length === 0) {
        gridContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
    } else {
        gridContainer.style.display = 'grid';
        emptyCartMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';

        gridContainer.innerHTML = ''; 

        // Render each cart item
        cartItems.forEach((item, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('ff-cart-item');

            const nameDiv = document.createElement('div');
            nameDiv.innerText = item.productName;

            const priceDiv = document.createElement('div');
            priceDiv.innerText = item.productPrice;

            // Container za količinu
            const quantityContainer = document.createElement('div');
            quantityContainer.classList.add('ff-cart-quantity-container');

            const minusDiv = document.createElement('div');
            minusDiv.classList.add('ff-cart-quantity-minus');
            minusDiv.innerText = '-';

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.classList.add('ff-cart-quantity-input');
            quantityInput.value = item.amount;
            quantityInput.min = 1;

            const plusDiv = document.createElement('div');
            plusDiv.classList.add('ff-cart-quantity-plus');
            plusDiv.innerText = '+';

            quantityContainer.appendChild(minusDiv);
            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(plusDiv);

            // Event listener za dugme -
            minusDiv.addEventListener('click', () => {
                let newAmount = parseInt(quantityInput.value) - 1;
                if (newAmount >= 1) {
                    quantityInput.value = newAmount;
                    updateCartQuantity(index, newAmount);
                }
            });

            // Event listener za dugme +
            plusDiv.addEventListener('click', () => {
                let newAmount = parseInt(quantityInput.value) + 1;
                quantityInput.value = newAmount;
                updateCartQuantity(index, newAmount);
            });

            // Event listener za direktan unos broja
            quantityInput.addEventListener('input', (e) => {
                let newAmount = parseInt(e.target.value);
                if (newAmount >= 1) {
                    updateCartQuantity(index, newAmount);
                } else {
                    quantityInput.value = 1;
                    updateCartQuantity(index, 1);
                }
            });

            productDiv.appendChild(nameDiv);
            productDiv.appendChild(priceDiv);
            productDiv.appendChild(quantityContainer);
            gridContainer.appendChild(productDiv);
        });
    }
}

// Function to update quantity in localStorage
function updateCartQuantity(index, newAmount) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems[index].amount = newAmount;
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
