document.addEventListener("DOMContentLoaded", () => {
  const productNameInput = document.getElementById("productName");
  const productTypeInput = document.getElementById("productType");
  const productImageInput = document.getElementById("productImage");
  const productForm = document.getElementById("productForm");
  const productTableBody = document.getElementById("productTableBody");

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let editIndex = null;

  const saveToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  const renderTable = () => {
    productTableBody.innerHTML = "";
    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.image}" alt="Product Image" class="img-thumbnail"></td>
        <td>${product.name}</td>
        <td>${product.type}</td>
        <td>${product.release}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-action" onclick="editProduct(${index})">Edit</button>
          <button class="btn btn-danger btn-sm btn-action" onclick="deleteProduct(${index})">Delete</button>
          <button class="btn btn-primary btn-sm btn-action" onclick="viewDetail(${index})">Details</button>
        </td>
      `;
      productTableBody.appendChild(row);
    });
  };

  const saveProduct = (e) => {
    e.preventDefault();

    const name = productNameInput.value.trim();
    const type = productTypeInput.value.trim();
    const imageFile = productImageInput.files[0];

    if (!name || !type || !imageFile) {
      alert("All fields are required!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageSrc = reader.result;
      const product = {
        id: products.length + 1,
        name,
        type,
        release: new Date().toLocaleDateString(),
        image: imageSrc,
      };

      if (editIndex !== null) {
        products[editIndex] = product;
        editIndex = null;
      } else {
        products.push(product);
      }

      saveToLocalStorage();
      renderTable();

      productNameInput.value = "";
      productTypeInput.value = "";
      productImageInput.value = "";
    };

    reader.readAsDataURL(imageFile);
  };

  window.editProduct = (index) => {
    const product = products[index];
    productNameInput.value = product.name;
    productTypeInput.value = product.type;
    editIndex = index;
  };

  window.deleteProduct = (index) => {
    products.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  };

  window.viewDetail = (index) => {
    localStorage.setItem("selectedProduct", JSON.stringify(products[index]));
    window.location.href = "detail.html";
  };

  productForm.addEventListener("submit", saveProduct);
  renderTable();
});
