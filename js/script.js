const countCounter = document.querySelector(".cart__count");
const cartDOM = document.querySelector(".cart__items");
const addToCartBtn = document.querySelectorAll(".btn_add_to_cart");
const totalCount = document.querySelector(".total__counter");
const totalCost = document.querySelector(".total__cost");
const check_out_btn = document.querySelector(".check_out_btn");

let cartItems = JSON.parse(localStorage.getItem("cart___items")) || [];

document.addEventListener("DOMContentLoaded", loadData);

check_out_btn.addEventListener("click", function () {
    if (confirm("آیا از حذف محصولات در سبد خرید مطمئنید؟")) {
        clearCatItems();
    }
});

countCounter.addEventListener("click", function () {
    cartDOM.classList.toggle("active");
});

addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;
        const product = {
            id: parentElement.querySelector("#product_id").value,
            name: parentElement.querySelector(".product__name").innerText,
            image: parentElement.querySelector("#image").getAttribute("src"),
            price: parentElement.querySelector(".product__price").innerText,
            quantity: 1,
        };

        let IsInCart = cartItems.filter((item) => item.id === product.id).length > 0;

        if (!IsInCart) {
            addItemToTheDom(product);
        } else {
            alert("این محصول در سبد خرید موجود است.");
            return;
        }

        const cartDOMItems = document.querySelectorAll(".cart__item");

        cartDOMItems.forEach((inItem) => {
            if (inItem.querySelector("#product__id").value === product.id) {
                increaseItem(inItem, product);
                decreaseItem(inItem, product);
                removeItem(inItem, product);
            }
        });

        cartItems.push(product);
        calculateTotal();
        saveToLocalStorage();
    });
});

function saveToLocalStorage() {
    localStorage.setItem("cart___items", JSON.stringify(cartItems));
}

function addItemToTheDom(product) {
    cartDOM.insertAdjacentHTML(
        "afterbegin",
        `
            <div class="cart__item">
            <input type="hidden" id="product__id" value="${product.id}">
            <img src="${product.image}" id="product__" alt="">
            <h4 class="product__name">${product.name}</h4>
            <a  class="btn__small" action="decrease">&minus;</a>
            <h4 class="product__quantity">${product.quantity}</h4>
            <a class="btn__small" action="increase">&plus;</a>
            <h4 class="product_price">${product.price}</h4>
            <a class="btn__small btn__remove " action="remove">&times;</a>
        </div>
    `
    );
}

function calculateTotal() {
    let total = 0;
    cartItems.forEach((item) => {
        total += item.quantity * item.price;
    });
    totalCost.innerText = total;
    totalCount.innerText = cartItems.length;
}

function increaseItem(inItem, product) {
    inItem.querySelector("[action='increase']").addEventListener("click", function () {
        cartItems.forEach((cartItem) => {
            if (cartItem.id === product.id) {
                inItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();
                saveToLocalStorage();
            }
        });
    });
}

function decreaseItem(inItem, product) {
    inItem.querySelector("[action='decrease']").addEventListener("click", function () {
        cartItems.forEach((cartItem) => {
            if (cartItem.id === product.id) {
                if (cartItem.quantity > 1) {
                    inItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                } else {
                    cartItems = cartItems.filter((newElement) => newElement.id !== product.id);
                    inItem.remove();
                }
                calculateTotal();
                saveToLocalStorage();
            }
        });
    });
}

function removeItem(inItem, product) {
    inItem.querySelector("[action='remove']").addEventListener("click", function () {
        cartItems.forEach((cartItem) => {
            if (cartItem.id === product.id) {
                cartItems = cartItems.filter((newElement) => newElement.id !== product.id);
                inItem.remove();
                calculateTotal();
                saveToLocalStorage();
            }
        });
    });
}

function loadData() {
    if (cartItems.length > 0) {
        cartItems.forEach((product) => {
            addItemToTheDom(product);

            const cartDOMItems = document.querySelectorAll(".cart__item");

            cartDOMItems.forEach((inItem) => {
                if (inItem.querySelector("#product__id").value === product.id) {
                    increaseItem(inItem, product);
                    decreaseItem(inItem, product);
                    removeItem(inItem, product);
                }
            });
        });
        calculateTotal();
        saveToLocalStorage();
    }
}

function clearCatItems() {
    localStorage.clear();
    cartItems = [];

    document.querySelectorAll(".cart__item").forEach((item) => {
        item.remove();
    });
    calculateTotal();
}
