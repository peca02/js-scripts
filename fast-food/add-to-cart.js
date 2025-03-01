Webflow.push(function () {
    // Default value for amount input
    document.querySelector('.ff-ammount-input-field').value = "1";
    
    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    const productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;

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
                amount: amount // Ensure it's an integer
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

        alert('Item added to cart!');
    });

    // Update the cart number when the page loads
    updateCartNumber();
});
