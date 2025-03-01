Webflow.push(function () {
    // Default value for amount input
    document.querySelector('.ff-ammount-input-field').value = "1";

    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    const productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;

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

    // Function to display cart items or empty cart message
    function updateCartDisplay() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const emptyCartMessage = document.querySelector('.ff-emply-cart');
        const cartGrid = document.querySelector('.w-layout-grid.ff-cart-display-grid');

        if (cartItems.length === 0) {
            // If cart is empty, show empty cart message and hide grid
            emptyCartMessage.style.display = 'block';
            cartGrid.style.display = 'none';
        } else {
            // If cart is not empty, show grid and hide empty cart message
            emptyCartMessage.style.display = 'none';
            cartGrid.style.display = 'grid';
        }
    }

    // Function to add product to cart
    function addProductToCart() {
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
            let cartItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount, // Ensure it's an integer
                productImageUrl: productImageUrl // Add the image URL to the cart item
            };

            // Add side dishes if any
            if (sideDishes.length > 0) {
                cartItem.sideDishes = sideDishes;
            }

            cartItems.push(cartItem);
        }

        // Save the updated cart items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the cart number and display after adding the item
        updateCartNumber();
        updateCartDisplay();

        // Dynamically update grid with the new item
        const cartGrid = document.querySelector('.w-layout-grid.ff-cart-display-grid');
        const newRow = document.createElement('div');
        newRow.classList.add('ff-cart-display-row');
        
        // Add product image
        const imageDiv = document.createElement('div');
        const img = document.createElement('img');
        img.src = productImageUrl;
        img.width = 50;  // Set image size
        imageDiv.appendChild(img);
        newRow.appendChild(imageDiv);

        // Add product name
        const nameDiv = document.createElement('div');
        nameDiv.textContent = productName;
        newRow.appendChild(nameDiv);

        // Add product price
        const priceDiv = document.createElement('div');
        priceDiv.textContent = productPrice;
        newRow.appendChild(priceDiv);

        // Add amount
        const amountDiv = document.createElement('div');
        amountDiv.textContent = amount;
        newRow.appendChild(amountDiv);

        // Append the new row to the grid
        cartGrid.appendChild(newRow);

        alert('Item added to cart!');
    }

    // Listen for the add-to-cart button click
    addToCartButton.addEventListener('click', addProductToCart);

    // Update the cart number and display when the page loads
    updateCartNumber();
    updateCartDisplay();
});
