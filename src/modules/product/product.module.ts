import Toastify from 'toastify-js';
import type { IProduct } from "./product.type";

let add_product_form: HTMLElement | null = document.getElementById("add_product_form");


// Products rendering;
function productRender() {



    fetch("http://localhost:3000/products")
        .then((res) => res.json())
        .then(data => {

            let productWithHTML = data.map((item: IProduct) => {
                return `
                <article
          class="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <!-- Image -->
          <div class="overflow-hidden">
            <img src="/src/assets/images/foods/${item.image}" alt="Chicken Burger"
              class="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900">
              ${item.name}
            </h3>

            <!-- Rating + Price -->
            <div class="mt-4 flex items-center justify-between gap-3">

              <!-- Rating -->
              <div class="flex items-center gap-0.5">
                <span class="text-lg text-[#F0A500]">★</span>
                <span class="text-lg text-[#F0A500]">★</span>
                <span class="text-lg text-[#F0A500]">★</span>
                <span class="text-lg text-[#F0A500]">★</span>
                <span class="text-lg text-gray-300">★</span>
              </div>

              <span class="text-lg font-bold text-gray-900">
                $${Number(item.price).toFixed(2)}
              </span>
            </div>

            <!-- Button -->
            <button type="button"
              class="mt-5 w-full cursor-pointer rounded-lg bg-[#F0A500] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d99400]">
              Add to Cart
            </button>
          </div>
        </article>
                `
            });


            let product_grid = document.getElementById('product_grid');

            if (!product_grid) return;

            product_grid.innerHTML = productWithHTML.join('')


        })





}

productRender();


// Create product;
add_product_form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(add_product_form as HTMLFormElement);

    const entries = Object.fromEntries(formData.entries()) as unknown as IProduct;

    const validatedFormData = validate(entries);

    // Stop here if validation fails
    if (!validatedFormData) {
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            body: JSON.stringify(validatedFormData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        Toastify({
            text: "Product added successfully",
            className: "success",
        }).showToast();

        // Optional

    } catch (error) {
        console.error(error);

        Toastify({
            text: "Failed to add product",
            className: "error",
        }).showToast();
    }
});





function validate(formData: IProduct) {

    let conditions =
        formData.name == ""
        || !formData.image
        || Number(formData.price) <= 0
        || !formData.ratting

    if (conditions) {
        Toastify({
            text: "Please fill all required form fields.",
            className: "info",
        }).showToast();

        return null;
    }


    return formData;

}
