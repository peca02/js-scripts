Webflow.push(function () {
  
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

// remove specific item from cart
document.addEventListener('click', (event) => {
    let svgElement = event.target.closest('.ff-cart-display-recycle-bin'); 
    
    if (svgElement) {  // Ako je kliknuto na SVG ili neki njegov child (path, g...)
        console.log("Kliknuto!");
        
        let indexToRemove = svgElement.getAttribute('data-index');
        if (indexToRemove !== null) {
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.splice(indexToRemove, 1);
            updateCartInLocalStorage(cartItems);
            updateTotalPrice();
            renderCartItems();
        }
    }
});


  function validateAmount(amount) {
      return Number.isInteger(amount) && amount > 0;
  }

  // Sanitize input to prevent XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
  
function validateAndSanitizeCart(cartItems) {
    let isValid = true;

    const sanitizedCart = cartItems.map(item => {
        const productSerialNumber = sanitizeInput(item.productSerialNumber);
        const amount = validateAmount(item.amount) ? item.amount : null;
        const sideDishes = Array.isArray(item.sideDishes) ? item.sideDishes.map(dish => sanitizeInput(dish)) : null;

        if (!productSerialNumber || amount === null || sideDishes === null) {
            isValid = false;
        }

        return { productSerialNumber, amount, sideDishes };
    });

    if (!isValid) {
        alert("Greška u podacima. Resetujemo korpu...");
        localStorage.removeItem("cartItems");
        location.reload();
        return null; // Ne šaljemo zahtev!
    }

    return sanitizedCart;
}
  
    // Function to render cart items from localStorage
function renderCartItems() {
    const navbar = document.querySelector('.ff-navbar');
    const emptyCartSection = document.querySelector('.ff-checkout-empty-cart-section');
    const orderSection = document.querySelector('#order-section');
    const gridContainer = document.querySelector('.ff-checkout-grid');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const validatedCartItems = validateAndSanitizeCart(cartItems);

    // If the cart is empty
    if (cartItems.length === 0) {
        navbar.style.position = 'fixed';
        emptyCartSection.style.display = 'flex';
        orderSection.style.display = 'none';
    } else {
        // Display the grid and hide the empty cart section
        navbar.style.position = 'sticky';
        emptyCartSection.style.display = 'none';
        orderSection.style.display = 'block';

        let requestData = validatedCartItems.map(item => ({
            serialNumber: item.productSerialNumber, 
            amount: item.amount, 
            sideDishes: item.sideDishes || [] // Ako nema priloga, šaljemo prazan niz
        }));
      
        const cachedCart = localStorage.getItem("cachedCart");
        const cachedPrice = localStorage.getItem("cachedPrice");
      
        // Provera da li postoji keširana cena i korpa
        if (cachedCart && cachedPrice && JSON.stringify(requestData) === cachedCart) {
            // Ako je korpa ista kao keširana, koristimo keširanu cenu
            document.querySelector('.ff-cart-display-total-price').innerText = `Total price: $${parseFloat(cachedPrice).toFixed(2)}`;
          }
        else {
           // SERVER BEGINS
    
          // Šaljemo podatke na backend
          fetch("https://ordering-production.up.railway.app/cart-validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ cart: requestData })
          })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  // Ako server vraća grešku, brišemo korpu i prikazujemo upozorenje
                  alert(data.error);
                  localStorage.removeItem("cartItems");
                  localStorage.removeItem("cachedCart");
                  localStorage.removeItem("cachedPrice");
                  location.reload(); // Osvježavamo stranicu da korisnik vidi praznu korpu
              } else {
                  // Ako je sve okej, prikazujemo ukupnu cenu
                  document.querySelector('.ff-cart-display-total-price').innerText = `Total price: $${data.totalPrice.toFixed(2)}`;

                  // Sačuvamo nove podatke u kešu
                  localStorage.setItem("cachedCart", JSON.stringify(requestData));
                  localStorage.setItem("cachedPrice", data.totalPrice);
              }
          })
          .catch(error => {
              console.error("Greška pri komunikaciji sa serverom:", error);
          });
      }
        // SERVER ENDS
      
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
        let index = 0;
        cartItems.forEach(item => {
            const svgNS = "http://www.w3.org/2000/svg";
            const svgElement = document.createElementNS(svgNS, "svg");
            const gElement = document.createElementNS(svgNS, "g");
            const path1 = document.createElementNS(svgNS, "path");
            const path2 = document.createElementNS(svgNS, "path");
            const image = document.createElement('img');
            const nameDiv = document.createElement('div');
            const priceDiv = document.createElement('div');
            const amountContainer = document.createElement('div');
            const minusDiv = document.createElement('div');
            const input = document.createElement('input');
            const plusDiv = document.createElement('div');

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
            svgElement.setAttribute('data-index', index);
            index++;
            
            image.src = item.productImageUrl;
            image.alt = item.productName;
            image.classList.add('ff-cart-display-item-image');
            
            // Check if the item has side dishes and render them accordingly
            if (item.sideDishes && item.sideDishes.length > 0) {
                const sideDishesText = item.sideDishes.join(', '); // Join side dishes with commas
                nameDiv.innerText = `${item.productName}\nSide dishes: ${sideDishesText}`;
            } else {
                nameDiv.innerText = item.productName;
            }

            priceDiv.innerText = item.productPrice;
            
            // Create the input field for quantity
            input.type = 'number';
            input.value = item.amount;
            input.min = '1'; // Minimum quantity is 1
            input.classList.add('ff-cart-display-quantity-input'); // Add a class for easy styling

            // Create the minus and plus buttons
            minusDiv.classList.add('ff-cart-display-minus');
            minusDiv.innerText = '-';
            plusDiv.classList.add('ff-cart-display-plus');
            plusDiv.innerText = '+';

            // Add event listeners for input change and button clicks
            input.addEventListener('input', (e) => {
                const newAmount = parseInt(e.target.value);
                if (newAmount >= 1) {
                    item.amount = newAmount; // Update the item amount
                    updateCartInLocalStorage(cartItems); // Update localStorage
                    updateTotalPrice();
                }
            });

            minusDiv.addEventListener('click', () => {
                if (item.amount > 1) {
                    item.amount -= 1; // Decrease the quantity
                    input.value = item.amount;
                    updateCartInLocalStorage(cartItems); // Update localStorage
                    updateTotalPrice();
                }
            });

            plusDiv.addEventListener('click', () => {
                item.amount += 1; // Increase the quantity
                input.value = item.amount;
                updateCartInLocalStorage(cartItems); // Update localStorage
                updateTotalPrice();
            });

            // Append the quantity controls to the container
            amountContainer.appendChild(minusDiv);
            amountContainer.appendChild(input);
            amountContainer.appendChild(plusDiv);
            
            // Append each cell directly to the grid container
            gridContainer.appendChild(svgElement);
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

    // Strict validation rules
    function isValidName(name) {
        return /^[A-Za-zČĆŽŠĐčćžšđ\s]{2,50}$/.test(name); // Samo slova i razmak, min 2 karaktera
    }
    
    function isValidAddress(address) {
        return /^[A-Za-z0-9čćžšđČĆŽŠĐ\s,.-]{5,100}$/.test(address); // Slova, brojevi i osnovna interpunkcija
    }
    
    function isValidPhone(phone) {
        return /^[0-9]{6,15}$/.test(phone); // Samo brojevi, minimalno 6 cifara
    }

  
    document.querySelector('#ff-order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        // Grab and sanitize inputs
        const name = sanitizeInput(document.querySelector('#ff-name').value.trim());
        const surname = sanitizeInput(document.querySelector('#ff-surname').value.trim());
        const address = sanitizeInput(document.querySelector('#ff-address').value.trim());
        const phone = sanitizeInput(document.querySelector('#ff-phone').value.trim());
    
        // Validate inputs
        if (!isValidName(name)) {
            alert("Dont do that");
            return;
        }
    
        if (!isValidName(surname)) {
            alert("Dont do that");
            return;
        }
    
        if (!isValidAddress(address)) {
            alert("Dont do that");
            return;
        }
    
        if (!isValidPhone(phone)) {
            alert("Dont do that");
            return;
        }
    
        // Ako sve prođe, šaljemo podatke (pretpostavljamo da API već postoji)
        const data = { name, surname, address, phone };
    
       try {
            const response = await fetch('https://ordering-production.up.railway.app/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                alert('Narudžbina uspešno poslata!');
                document.querySelector('#ff-order-form').reset();
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cachedCart");
                localStorage.removeItem("cachedPrice");
                location.reload();
            } else {
                alert('Greška pri slanju narudžbine.');
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cachedCart");
                localStorage.removeItem("cachedPrice");
                location.reload();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Greška pri slanju narudžbine.');
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cachedCart");
            localStorage.removeItem("cachedPrice");
            location.reload();
        }
    });

    
    // Update total price and render items when the page loads
    updateTotalPrice()
    renderCartItems();
});
