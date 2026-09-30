import api from "../../../lib/api";
import type { IProduct } from "../product/product.type";
import type { ICart, ICartStore } from "./cart.type";

let cart_section = document.getElementById('cart_section');
let cart_togglers = document.querySelectorAll(".cart-toggler");
let product_grid = document.getElementById('product_grid');
let cart_container = document.getElementById('cart_container');


cart_togglers.forEach(element => {
    element?.addEventListener("click", () => {
        cart_section?.classList.toggle('hidden')
    })
})

// Add item to cart;
if (product_grid) {

    product_grid.addEventListener("click", async (event) => {
        let addToCartBtn = ((event.target) as HTMLElement).classList.contains('add-to-cart');

        if (addToCartBtn) {

            let dataId = ((event.target) as HTMLElement).dataset.id;

            let res = await api.get(`/products/${dataId}`);

            if (res.status == 200) {

                let myCartProduct = res.data;

                addCartToLocalStorage(myCartProduct)

                renderCartItems();


            }



        }

    })
}


if (cart_container) {

    cart_container.addEventListener('click', (event) => {
        let deleteBtn = ((event.target) as HTMLElement).classList.contains('delete-btn');
        let incrementBtn = ((event.target) as HTMLElement).classList.contains('increment-btn');
        let decrementBtn = ((event.target) as HTMLElement).classList.contains('decrement-btn');

        // Delete item from cart;
        if (deleteBtn) {
            let dataId = ((event.target) as HTMLElement).dataset.id;


            let oldCartData = JSON.parse(localStorage.getItem('cart') as string).data


            let updateCartDataWithOldProductItem = oldCartData.filter((item: ICart) => item.id != dataId);

            let grandTotalPriceCalculation = updateCartDataWithOldProductItem.reduce((total: number, current: ICart) => {
                return total + Number(current.totalPrice);
            }, 0);


            let updateCartData: ICartStore = {
                data: updateCartDataWithOldProductItem,
                totalPrice: grandTotalPriceCalculation
            }

            localStorage.setItem('cart', JSON.stringify(updateCartData))

            renderCartItems()
        }

        // Increment quantity;
        if (incrementBtn) {
            let dataId = ((event.target) as HTMLElement).dataset.id;
            console.log(dataId);


            let oldCartData = JSON.parse(localStorage.getItem('cart') as string).data


            let updateCartDataWithOldProductItem = oldCartData.map((item: ICart) => {
                if (item.id == dataId) {
                    return {
                        ...item,
                        quantity: Number(item.quantity) + 1,
                        totalPrice: Number(item.price) * (Number(item.quantity) + 1)
                    }
                }

                return item;
            })

            let grandTotalPriceCalculation = updateCartDataWithOldProductItem.reduce((total: number, current: ICart) => {
                return total + Number(current.totalPrice);
            }, 0);


            let updateCartData: ICartStore = {
                data: updateCartDataWithOldProductItem,
                totalPrice: grandTotalPriceCalculation
            }

            localStorage.setItem('cart', JSON.stringify(updateCartData))

            renderCartItems()
        }


        if (decrementBtn) {
            let dataId = ((event.target) as HTMLElement).dataset.id;
            console.log(dataId);


            let oldCartData = JSON.parse(localStorage.getItem('cart') as string).data


            let updateCartDataWithOldProductItem = oldCartData.map((item: ICart) => {
                if (item.id == dataId) {
                    return {
                        ...item,
                        quantity: item.quantity == 1 ? 1 : Number(item.quantity) - 1,
                        totalPrice: Number(item.price) * (item.quantity == 1 ? 1 : Number(item.quantity) - 1)
                    }
                }

                return item;
            })

            let grandTotalPriceCalculation = updateCartDataWithOldProductItem.reduce((total: number, current: ICart) => {
                return total + Number(current.totalPrice);
            }, 0);


            let updateCartData: ICartStore = {
                data: updateCartDataWithOldProductItem,
                totalPrice: grandTotalPriceCalculation
            }

            localStorage.setItem('cart', JSON.stringify(updateCartData))

            renderCartItems()
        }


    })



}




// =================== Helper function =======================

function addCartToLocalStorage(product: IProduct) {
    let checkLocalStorage = localStorage.getItem('cart');

    // Add new cart;
    if (!checkLocalStorage) {
        let newCartData: ICartStore = {
            data: [
                {
                    id: product.id as string,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: 1,
                    totalPrice: product.price
                }
            ],
            totalPrice: product.price
        }
        localStorage.setItem('cart', JSON.stringify(newCartData))
    }

    // Update cart;

    else {
        let oldCartFromLocalStorage = localStorage.getItem('cart');

        let oldCartData = JSON.parse(oldCartFromLocalStorage as string).data

        let ifExist = oldCartData.find((item: ICart) => item.id == product.id);

        if (ifExist) return;

        let updateCartDataWithOldProductItem = [
            ...oldCartData,
            {
                id: product.id as string,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: 1,
                totalPrice: product.price
            }
        ]

        let grandTotalPriceCalculation = updateCartDataWithOldProductItem.reduce((total, current) => {
            return total + Number(current.totalPrice);
        }, 0);


        let updateCartData: ICartStore = {
            data: updateCartDataWithOldProductItem,
            totalPrice: grandTotalPriceCalculation
        }

        localStorage.setItem('cart', JSON.stringify(updateCartData))

    }




}

function renderCartItems() {

    let sub_total = document.getElementById('sub_total');
    let cart_total_count = document.getElementById('cart_total_count');

    let cartHTML = "";

    let getCartDataFromLocalStorage = localStorage.getItem('cart');

    if (!getCartDataFromLocalStorage) return;

    let getDataItems = JSON.parse(getCartDataFromLocalStorage as string).data;

    getDataItems.forEach((item: ICart) => {
        cartHTML += `<div class="flex items-center gap-4 p-5">

         
          <img src="/src/assets/images/foods/${item.image}" alt="Product" class="h-20 w-20 shrink-0 rounded-lg object-cover" />

          <!-- Product Info -->
          <div class="min-w-0 flex-1">
            <h3 class="truncate font-medium text-gray-900">
              Premium Cotton T-Shirt
            </h3>

            <p class="mt-1 text-sm text-gray-500">
              $${Number(item.price).toFixed(2)} each
            </p>
          </div>

          <!-- Quantity -->
          <div class="flex items-center rounded-lg border border-gray-200">
            <button type="button"
            data-id="${item.id}"
              class="flex h-9 w-9 decrement-btn items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100">
              −
            </button>

            <span class="w-10 text-center text-sm font-medium text-gray-900">
              ${item.quantity}
            </span>

            <button type="button"
            data-id="${item.id}"
              class="flex h-9 w-9 increment-btn items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100">
              +
            </button>
          </div>

          <!-- Price -->
          <div class="w-24 text-right">
            <p class="text-xs text-gray-500">Price</p>
            <p class="mt-1 font-medium text-gray-700">$${Number(item.price).toFixed(2)}</p>
          </div>

          <!-- Total -->
          <div class="w-24 text-right">
            <p class="text-xs text-gray-500">Total</p>
            <p class="mt-1 font-semibold text-gray-900">$${Number(item.totalPrice).toFixed(2)}</p>
          </div>

          <!-- Action -->
          <div class="w-24 text-right">
            <button class="text-red-500 delete-btn cursor-pointer" data-id="${item.id}">Delete</button>
          </div>

        </div>`
    })

    if (cart_container) cart_container.innerHTML = cartHTML;
    if (sub_total) sub_total.innerHTML = JSON.parse(getCartDataFromLocalStorage as string).totalPrice;
    if (cart_total_count) cart_total_count.innerHTML = getDataItems.length


}

renderCartItems();


