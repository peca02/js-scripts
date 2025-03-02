Webflow.push(function () {
    document.querySelector('.ff-ammount-input-field').value = "1";

    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    let productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;
    productPrice = `$${productPrice}`; // Dodajemo $ ispred cene

    function getImageUrl(element) {
        let style = window.getComputedStyle(element);
        let backgroundImage = style.getPropertyValue('background-image');
        let url = backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
        return url ? url[1] : null;
    }

    function updateCartNumber() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalAmount = cartItems.reduce((sum, item) => sum + parseInt(item.amount, 10), 0);
        const cartNumber = document.querySelector('.ff-cart-number');
        if (cartNumber) cartNumber.innerText = totalAmount;
    }

    function renderCartItems() {
        const gridContainer = document.querySelector('.ff-cart-display-grid');
        const emptyCartMessage = document.querySelector('.ff-emply-cart');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length === 0) {
            gridContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        gridContainer.style.display = 'grid';
        emptyCartMessage.style.display = 'none';
        gridContainer.innerHTML = '';

        const headers = ['Image', 'Product', 'Price', 'Amount'];
        headers.forEach(text => {
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('ff-cart-dislay-grid-header');
            headerDiv.innerText = text;
            gridContainer.appendChild(headerDiv);
        });

        let groupedCart = {};
        cartItems.forEach(item => {
            if (groupedCart[item.productSerialNumber]) {
                groupedCart[item.productSerialNumber].amount += item.amount;
            } else {
                groupedCart[item.productSerialNumber] = { ...item };
            }
        });

        Object.values(groupedCart).forEach(item => {
            const imageDiv = document.createElement('div');
            imageDiv.innerHTML = `<img src="${item.productImageUrl}" class="ff-cart-display-item-image" alt="${item.productName}" />`;
            
            const nameDiv = document.createElement('div');
            nameDiv.innerText = item.productName;
            headerDiv.classList.add('ff-cart-dislay-text-centered');
            
            const priceDiv = document.createElement('div');
            priceDiv.innerText = item.productPrice;
            priceDiv.classList.add('ff-cart-dislay-text-centered');

            const amountDiv = document.createElement('div');
            amountDiv.innerText = item.amount;
            amountDiv.classList.add('ff-cart-dislay-text-centered');

            gridContainer.appendChild(imageDiv);
            gridContainer.appendChild(nameDiv);
            gridContainer.appendChild(priceDiv);
            gridContainer.appendChild(amountDiv);
        });
    }

    addToCartButton.addEventListener('click', function () {
        const amount = parseInt(amountInput.value, 10);
        let sideDishes = [];

        if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
            sideDishDiv.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                sideDishes.push(checkbox.value);
            });
        }

        const productImageUrl = getImageUrl(document.querySelector('.ff-food-item-image'));
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
                productImageUrl: productImageUrl,
                sideDishes: sideDishes.length > 0 ? sideDishes : undefined
            };
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
