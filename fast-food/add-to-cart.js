Webflow.push(function () {
    document.querySelector('.ff-ammount-input-field').value="1";
        const addToCartButton = document.querySelector('.ff-add-to-cart-button');
        const amountInput = document.querySelector('.ff-ammount-input-field');
        const sideDishDiv = document.querySelector('.ff-side-dish');
        const serialNumber = document.querySelector('.ff-serial-number').innerText;
        const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
        const productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;
        const ingredientsList = document.querySelector('.ff-ingredets').innerText;

        addToCartButton.addEventListener('click', function(e) {
            e.preventDefault();

            const amount = amountInput.value;
            let sideDishes = [];

            // Check for selected side dishes
            if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
                const sideDishCheckboxes = sideDishDiv.querySelectorAll('input[type="checkbox"]:checked');
                sideDishCheckboxes.forEach(function(checkbox) {
                    sideDishes.push(checkbox.value);
                });
            }

            // Create cart item object
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            const cartItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount,
                ingredients: ingredientsList,
                sideDishes: sideDishes || undefined
            };

            // Add to cart and update localStorage
            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            alert('Item added to cart!');
        });
});
