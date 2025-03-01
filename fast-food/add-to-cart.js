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

        cartItems.forEach(item => {
            totalAmount += parseInt(item.amount, 10);
        });

        const cartNumber = document.querySelector('.ff-cart-number');
        if (cartNumber) {
            cartNumber.innerText = totalAmount;
        }
    }

    // Function to render cart items from localStorage
    function renderCartItems() {
        const gridContainer = document.querySelector('.ff-cart-display-grid');
        const emptyCartMessage = document.querySelector('.ff-emply-cart');

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems.length === 0) {
            gridContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        } else {
            gridContainer.style.display = 'grid';
            emptyCartMessage.style.display = 'none';
            gridContainer.innerHTML = '';

            const headers = ['Image', 'Product', 'Price', 'Amount', 'Actions'];
            headers.forEach(text => {
                const headerDiv = document.createElement('div');
                headerDiv.classList.add('ff-cart-dislay-grid-header');
                headerDiv.innerText = text;
                gridContainer.appendChild(headerDiv);
            });

            cartItems.forEach((item, index) => {
                const imageDiv = document.createElement('div');
                const nameDiv = document.createElement('div');
                const priceDiv = document.createElement('div');
                const amountDiv = document.createElement('div');
                const actionsDiv = document.createElement('div');

                imageDiv.innerHTML = `<img src="${item.productImageUrl}" alt="${item.productName}" />`;
                nameDiv.innerText = item.productName;
                priceDiv.innerText = item.productPrice;
                amountDiv.innerText = item.amount;

                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.classList.add('ff-remove-button');
                removeButton.addEventListener('click', function () {
                    cartItems.splice(index, 1);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartNumber();
                    renderCartItems();
                });

                actionsDiv.appendChild(removeButton);
                gridContainer.append(imageDiv, nameDiv, priceDiv, amountDiv, actionsDiv);
            });
        }
    }

    addToCartButton.addEventListener('click', function () {
        const amount = parseInt(amountInput.value, 10);
        let sideDishes = [];

        if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
            const sideDishCheckboxes = sideDishDiv.querySelectorAll('input[type="checkbox"]:checked');
            sideDishCheckboxes.forEach(checkbox => {
                sideDishes.push(checkbox.value);
            });
        }

        const productImageElement = document.querySelector('.ff-food-item-image');
        const productImageUrl = getImageUrl(productImageElement);
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        let existingItem = cartItems.find(item =>
            item.productSerialNumber === serialNumber &&
            JSON.stringify(item.sideDishes || []) === JSON.stringify(sideDishes)
        );

        if (existingItem) {
            existingItem.amount += amount;
        } else {
            let cartItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount,
                productImageUrl: productImageUrl
            };

            if (sideDishes.length > 0) {
                cartItem.sideDishes = sideDishes;
            }

            cartItems.push(cartItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartNumber();
        renderCartItems();
        alert('Item added to cart!');
    });

    updateCartNumber();
    renderCartItems();
});
