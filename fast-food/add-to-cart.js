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

    // Function to render cart items from localStorage
    function renderCartItems() {
        const gridContainer = document.querySelector('.ff-cart-display-grid');
        const emptyCartMessage = document.querySelector('.ff-emply-cart');

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // If the cart is empty, display the empty cart message
        if (cartItems.length === 0) {
            gridContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        } else {
            // Display the grid and hide the empty cart message
            gridContainer.style.display = 'grid';
            emptyCartMessage.style.display = 'none';

            // Clear the grid first before re-rendering the items
            gridContainer.innerHTML = ''; // Clear existing content

            // Add header row before cart items
            const headerRow = document.createElement('div');
            headerRow.classList.add('ff-cart-header-row');
            headerRow.innerHTML = `
                <div class="ff-cart-dislay-grid-header">Image</div>
                <div class="ff-cart-dislay-grid-header">Product</div>
                <div class="ff-cart-dislay-grid-header">Price</div>
                <div class="ff-cart-dislay-grid-header">Amount</div>
            `;
            gridContainer.appendChild(headerRow);

            // Render each cart item directly into the grid container
            cartItems.forEach(item => {
                const imageDiv = document.createElement('div');
                const nameDiv = document.createElement('div');
                const priceDiv = document.createElement('div');
                const amountDiv = document.createElement('div');

                // Set content for each cell
                imageDiv.innerHTML = `<img src="${item.productImageUrl}" alt="${item.productName}" />`;
                nameDiv.innerText = item.productName;
                priceDiv.innerText = item.productPrice;
                amountDiv.innerText = item.amount;

                // Append each cell directly to the grid container
                gridContainer.appendChild(imageDiv);
                gridContainer.appendChild(nameDiv);
                gridContainer.appendChild(priceDiv);
                gridContainer.appendChild(amountDiv);
            });
        }
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

        // Update the cart number after adding the item
        updateCartNumber();

        // Re-render the cart items
        renderCartItems();

        alert('Item added to cart!');
    });

    // Update the cart number and render items when the page loads
    updateCartNumber();
    renderCartItems();
});
