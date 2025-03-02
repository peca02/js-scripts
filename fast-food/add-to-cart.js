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
            totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`; // Format to two decimals
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

            // Add header items with separate divs for each element
            const blankDiv = document.createElement('div');
            blankDiv.classList.add('ff-cart-dislay-grid-header');
            blankDiv.innerText = '';
            
            const imageHeaderDiv = document.createElement('div');
            imageHeaderDiv.classList.add('ff-cart-dislay-grid-header');
            imageHeaderDiv.innerText = 'Image';

            const productHeaderDiv = document.createElement('div');
            productHeaderDiv.classList.add('ff-cart-dislay-grid-header');
            productHeaderDiv.innerText = 'Product';

            const priceHeaderDiv = document.createElement('div');
            priceHeaderDiv.classList.add('ff-cart-dislay-grid-header');
            priceHeaderDiv.innerText = 'Price';

            const amountHeaderDiv = document.createElement('div');
            amountHeaderDiv.classList.add('ff-cart-dislay-grid-header');
            amountHeaderDiv.innerText = 'Amount';

            // Append header items to the grid container
            gridContainer.appendChild(blankDiv);
            gridContainer.appendChild(imageHeaderDiv);
            gridContainer.appendChild(productHeaderDiv);
            gridContainer.appendChild(priceHeaderDiv);
            gridContainer.appendChild(amountHeaderDiv);

            // Render each cart item directly into the grid container
            cartItems.forEach(item => {
                const svgNS = "http://www.w3.org/2000/svg";
                const svgElement = document.createElementNS(svgNS, "svg");
                const gElement = document.createElementNS(svgNS, "g");
                const path1 = document.createElementNS(svgNS, "path");
                const path2 = document.createElementNS(svgNS, "path");
                const image = document.createElement('img');
                const nameDiv = document.createElement('div');
                const priceDiv = document.createElement('div');
                const amountDiv = document.createElement('div');

                // Set content for each cell
                svgElement.setAttribute("xmlns", svgNS);
                svgElement.setAttribute("fill", "currentColor");
                svgElement.setAttribute("width", "100%");
                svgElement.setAttribute("viewBox", "0 0 408.483 408.483");
                svgElement.setAttribute("class", "ff-cart-display-recycle-bin");
                path1.setAttribute("d", "M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316 H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293 c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329 c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355 c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356 c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z");
                path2.setAttribute("d", "M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916 c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z");
                gElement.appendChild(path1);
                gElement.appendChild(path2);
                svgElement.appendChild(gElement);
                
                image.src = item.productImageUrl;
                image.alt = item.productName;
                image.classList.add('ff-cart-display-item-image');
                nameDiv.innerText = item.productName;
                priceDiv.innerText = item.productPrice;
                amountDiv.innerText = item.amount;

                // Append each cell directly to the grid container
                gridContainer.appendChild(svgElement);
                gridContainer.appendChild(image);
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
