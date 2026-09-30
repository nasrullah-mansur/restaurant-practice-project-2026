import Toastify from 'toastify-js';
import type { IProduct } from "./product.type";


import api from "../../../lib/api";

let add_product_form: HTMLElement | null = document.getElementById("add_product_form");
let product_grid = document.getElementById('product_grid');
let table_body = document.getElementById('table_body');
let edit_product_form: HTMLElement | null = document.getElementById('edit_product_form')

// Products rendering;
async function productRender() {
    try {
        let res = await api.get('/products');


        if (product_grid) {
            product_grid.innerHTML = makeProductHtmlCode(res.data).homePageHtml;
        };

        if (table_body) {
            table_body.innerHTML = makeProductHtmlCode(res.data).dashboardPageHtml;
        }


    } catch (error) {
        console.log(error);
    }

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

        let res = await api.post('/products', validatedFormData)

        console.log(res);

        if (res.status == 201) {
            Toastify({
                text: "Product added successfully",
                className: "success",
                style: {
                    background: "red",
                    color: "white",
                    border: "1px solid black"
                }
            }).showToast();

            (add_product_form as HTMLFormElement).reset();

            setTimeout(() => {
                window.location.replace("/dashboard")
            }, 3000);

        }


    } catch (error) {
        console.error(error);

        Toastify({
            text: "Failed to add product",
            className: "error",
        }).showToast();
    }
});


// Edit product;
if (edit_product_form) {

    let searchParams = new URLSearchParams(window.location.search)

    let productId = searchParams.get("productId");

    if (productId) {

        async function getData() {
            let response = await api.get(`/products/${productId}`);

            for (let field in response.data) {
                (document.querySelector(`[name="${field}"]`) as HTMLInputElement).value = response.data[field];
            }

            // (document.querySelector(`[name="id"]`) as HTMLInputElement).value = response.data.id;
            // (document.querySelector(`[name="name"]`) as HTMLInputElement).value = response.data.name;
            // (document.querySelector(`[name="price"]`) as HTMLInputElement).value = response.data.price;
            // (document.querySelector(`[name="ratting"]`) as HTMLInputElement).value = response.data.ratting;
            // (document.querySelector(`[name="image"]`) as HTMLInputElement).value = response.data.image;


        }

        getData()


    }


}

edit_product_form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(edit_product_form as HTMLFormElement);

    const entries = Object.fromEntries(formData.entries()) as unknown as IProduct;

    const validatedFormData = validate(entries);

    // Stop here if validation fails
    if (!validatedFormData) {
        return;
    }

    let searchParams = new URLSearchParams(window.location.search)

    let productId = searchParams.get("productId");

    if (productId) {

        try {

            let { id, ...updateFormData } = validatedFormData;

            let res = await api.put(`/products/${productId}`, updateFormData)



            if (res.status == 200) {
                Toastify({
                    text: "Product updated successfully",
                    className: "success",
                }).showToast();

                window.location.replace("/dashboard")

            }


        } catch (error) {
            console.error(error);

            Toastify({
                text: "Failed to add product",
                className: "error",
            }).showToast();
        }
    }

})


// Delete product;
table_body?.addEventListener('click', async (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const deleteBtn = target.closest(".delete-product");
    if (!(deleteBtn instanceof HTMLElement)) return;

    let deleteProductId = deleteBtn.dataset.id;

    let confirmDelete = confirm("Are you sure you want to remove this item permanently?")


    if (!confirmDelete) return;

    let deleteProduct = await api.delete(`/products/${deleteProductId}`);

    if (deleteProduct.status == 200) {
        Toastify({
            text: "Product removed successfully",
            className: "success",
        }).showToast();

        productRender()
    }

    console.log(deleteProduct);


})




// ============================ Helper Function =======================

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

function makeProductHtmlCode(arr: IProduct[]) {

    let homePageHtml = "";
    let dashboardPageHtml = "";

    arr.forEach((item, index) => {
        homePageHtml += `
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
                        ${rattingCount(item.ratting)}

                        <span class="text-lg font-bold text-gray-900">
                            $${Number(item.price).toFixed(2)}
                        </span>
                        </div>

                        <!-- Button -->
                        <button type="button"
                        data-id="${item.id}"
                        class="mt-5 w-full add-to-cart cursor-pointer rounded-lg bg-[#F0A500] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d99400]">
                        Add to Cart
                        </button>
                    </div>
                </article>
                `;

        dashboardPageHtml += `
                    <tr class="transition hover:bg-gray-50">
                        <td class="px-5 py-3">
                            ${index + 1}
                        </td>
                        <td class="px-5 py-3">
                            <img src="/src/assets/images/foods/${item.image}" alt="Product"
                                class="h-14 w-14 rounded-lg object-cover" />
                        </td>

                        <td class="px-5 py-3">
                            <p class="font-medium text-gray-900">
                                ${item.name}
                            </p>
                        </td>

                        <td class="px-5 py-3">
                            <span class="font-semibold text-gray-900">
                                $${Number(item.price).toFixed(2)}
                            </span>
                        </td>

                        <td class="px-5 py-3">
                            <div class="flex items-center gap-1">

                                <span class="ml-1 text-xs text-gray-500">
                                    ${item.ratting}
                                </span>
                            </div>
                        </td>

                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <a 
                                href="edit-product?productId=${item.id}"
                                    class="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
                                    Edit
                                </a>

                                <button
                                    data-id="${item.id}"
                                    class="cursor-pointer delete-product rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
        `
    })


    function rattingCount(n: number) {

        let starts = "";

        for (let i = 0; i <= 4; i++) {

            if (n > i) {
                starts += `<span class="text-lg text-[#F0A500]">★</span>`
            }

            else {
                starts += `<span class="text-lg text-gray-400">★</span>`
            }
        }


        return `<div class="flex items-center gap-0.5">${starts}</div>`
    }


    return {
        homePageHtml: homePageHtml,
        dashboardPageHtml: dashboardPageHtml
    };

}