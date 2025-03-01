Webflow.push(function () {
    // Početna vrednost za amount
    document.querySelector('.ff-ammount-input-field').value = "1";
    
    const addToCartButton = document.querySelector('.ff-add-to-cart-button');
    const amountInput = document.querySelector('.ff-ammount-input-field');
    const sideDishDiv = document.querySelector('.ff-side-dish');
    const serialNumber = document.querySelector('.ff-serial-number').innerText;
    const productName = document.querySelector('.ff-heading-1-colection-food-item').innerText;
    const productPrice = document.querySelectorAll('.ff-heading-2-colection-food-item')[1].innerText;

    // Funkcija za ažuriranje broja u korpi
    function updateCartNumber() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalAmount = 0;

        // Sabiramo amount za svaku stavku u korpi
        cartItems.forEach(item => {
            totalAmount += parseInt(item.amount, 10); // Saberemo količine
        });

        // Ažuriramo broj u korpi
        const cartNumber = document.querySelector('.FF Cart number');
        if (cartNumber) {
            cartNumber.innerText = totalAmount;  // Postavimo broj u korpi
        }
    }

    addToCartButton.addEventListener('click', function () {
        const amount = parseInt(amountInput.value, 10);
        let sideDishes = [];

        // Provera za izabrane priloge
        if (sideDishDiv && sideDishDiv.innerHTML.trim() !== "") {
            const sideDishCheckboxes = sideDishDiv.querySelectorAll('input[type="checkbox"]:checked');
            sideDishCheckboxes.forEach(function (checkbox) {
                sideDishes.push(checkbox.value);
            });
        }

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Provera da li se proizvod već nalazi u korpi
        let existingItem = cartItems.find(item => 
            item.productSerialNumber === serialNumber && 
            JSON.stringify(item.sideDishes || []) === JSON.stringify(sideDishes)
        );

        if (existingItem) {
            // Ako postoji, povećavamo količinu
            existingItem.amount = (parseInt(existingItem.amount, 10) + amount).toString();
        } else {
            // Ako je novi proizvod, dodajemo ga u niz
            let cartItem = {
                productSerialNumber: serialNumber,
                productName: productName,
                productPrice: productPrice,
                amount: amount.toString()
            };

            // Dodajemo priloge ako ih ima
            if (sideDishes.length > 0) {
                cartItem.sideDishes = sideDishes;
            }

            cartItems.push(cartItem);
        }

        // Skladištimo ažurirani niz u localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Ažuriramo broj u korpi nakon dodavanja proizvoda
        updateCartNumber();

        alert('Item added to cart!');
    });

    // Ažuriramo broj u korpi prilikom učitavanja stranice
    updateCartNumber();
});
