Webflow.push(function () {
    document.querySelector('.ff-ammount-input-field').value = "1";
    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    const productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;

    addToCartButton.addEventListener('click', function () {
        const amount = parseInt(amountInput.value, 10);
        let sideDishes = [];

        // Check for selected side dishes
        if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
            const sideDishCheckboxes = sideDishDiv.querySelectorAll('input[type="checkbox"]:checked');
            sideDishCheckboxes.forEach(function (checkbox) {
                sideDishes.push(checkbox.value);
            });
        }

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the exact item (same product + same side dishes) already exists in the cart
        let existingItem = cartItems.find(item => 
            item.productSerialNumber === serialNumber && 
            JSON.stringify(item.sideDishes || []) === JSON.stringify(sideDishes)
        );

        if (existingItem) {
            // If exists, increase quantity
            existingItem.amount = (parseInt(existingItem.amount, 10) + amount).toString();
        } else {
            // If new item, push to array
            let cartItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount.toString()
            };

            // Add sideDishes only if it has values
            if (sideDishes.length > 0) {
                cartItem.sideDishes = sideDishes;
            }

            cartItems.push(cartItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        alert('Item added to cart!');
    });
});
