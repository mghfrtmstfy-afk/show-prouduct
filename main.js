const showProductsBtn = document.querySelector("#showProductsBtn");
const loading = document.querySelector("#loading");
const productsContainer = document.querySelector("#productsContainer");

const API_URL = "https://dummyjson.com/products";

function showLoading() {
  loading.classList.remove("d-none");

  showProductsBtn.disabled = true;
}

function hideLoading() {
  loading.classList.add("d-none");

  showProductsBtn.disabled = false;
}

function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(function (product) {
      const { id, title, description, category, price, thumbnail } = product;

      return `
            <div class="col-12 col-md-6 col-lg-3">

                <div class="card h-100 shadow-sm">

                    <img
                        src="${thumbnail}"
                        class="card-img-top product-image"
                        alt="${title}"
                    >

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">
                            ${title}
                        </h5>

                        <p class="text-secondary">
                            ${category}
                        </p>

                        <p class="card-text">
                            ${description ?? "No description available"}
                        </p>

                        <p class="fw-bold text-success">
                            $${price}
                        </p>

                        <button
                            class="btn btn-primary mt-auto view-product"
                            data-id="${id}"
                        >
                            View Product
                        </button>

                    </div>

                </div>

            </div>
        `;
    })
    .join("");

  addViewProductEvents();
}

function addViewProductEvents() {
  const viewButtons = document.querySelectorAll(".view-product");

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = button.dataset.id;

      getProduct(productId);
    });
  });
}

function getProduct(productId) {
  fetch(`${API_URL}/${productId}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Product not found");
      }

      return response.json();
    })

    .then(function (product) {
      alert(`Product: ${product.title}\nPrice: $${product.price}`);
    })

    .catch(function (error) {
      console.log(error);
    });
}

showProductsBtn.addEventListener("click", function () {
  showLoading();

  fetch(API_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      return response.json();
    })

    .then(function (data) {
      const { products } = data;

      displayProducts(products);
    })

    .catch(function (error) {
      productsContainer.innerHTML = `
                <div class="col-12">

                    <div class="alert alert-danger text-center">

                        Failed to load products.
                        Please try again.

                    </div>

                </div>
            `;

      console.log(error);
    })

    .finally(function () {
      hideLoading();
    });
});
