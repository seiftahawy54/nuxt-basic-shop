<script lang="ts">
import axios from "axios";
import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import {defineComponent} from "vue";
import type {Category, Product} from "~/types/global";

export default defineComponent({
    name: 'App',
    data(): {
        products: Product[],
        categories: Category[],
        selectedTab: string,
        currentCategory: string,
        imageDataURL: any,
        pageCanvas: any,
        productNameInput: string,
        descriptionInput: string,
        categoryInput: string,
        selectedForm: string,
        categoryName: string,
        categoryDescription: string,
        isParentCategory: boolean,
        selectedSubCategory: string,
        children: Category[],
    } {
        return {
            products: [] as Product[],
            categories: [] as Category[],
            selectedTab: 'products' as string,
            currentCategory: '' as string,
            imageDataURL: null as string | null,
            pageCanvas: null as HTMLCanvasElement | null,
            productNameInput: '' as string,
            descriptionInput: '' as string,
            categoryInput: '' as string,
            selectedForm: '' as string,
            categoryName: '' as string,
            categoryDescription: '' as string,
            isParentCategory: false as boolean,
            selectedSubCategory: '' as string,
            children: [] as any[],
        }
    },
    methods: {
        fetchHomePage() {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/products`).then(response => {
                this.products = response.data.products
            })
                .catch((error) => {
                    console.log(error)
                })

            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/categories`).then(response => {
                this.categories = response.data.categories
            })
                .catch((error) => {
                    console.log(error)
                })
        },
        changeTab(tab: string) {
            this.selectedTab = tab
        },
        clearCategory() {
            this.selectedTab = ''
        },
        handleImageUpload(event: Event) {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files ? fileInput.files[0] : '';

            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                this.imageDataURL = event.target?.result as string;
                this.resizeImage(this.imageDataURL, 3200, 3200);
            };
            reader.readAsDataURL(file);
        },
        resizeImage(imageDataURL: string, maxWidth: number, maxHeight: number) {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                this.pageCanvas = canvas

                // Calculate new dimensions with aspect ratio
                let width = image.width;
                let height = image.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);

                // Get resized image as data URL (for preview or upload)
                this.imageDataURL = canvas.toDataURL();
            };
            image.src = imageDataURL;
        },
        async submitProductForm() {

            if (!this.imageDataURL || !this.productNameInput || !this.descriptionInput || !this.categoryInput) {
                toast.error('Failed to add product');
                return;
            }

            const resizedImageData = this.pageCanvas.toDataURL('image/jpeg'); // Or your preferred image format

            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                    picture: resizedImageData,
                    name: this.productNameInput,
                    description: this.descriptionInput,
                    categoryId: this.categoryInput
                });
                console.log(
                    {
                        picture: resizedImageData,
                        name: this.productNameInput,
                        description: this.descriptionInput,
                        categoryId: this.categoryInput
                    }
                )
                if (response.status === 200 || response.status === 201) {
                    this.fetchHomePage();
                    this.productNameInput = '';
                    this.descriptionInput = '';
                    this.categoryInput = '';
                    this.imageDataURL = null;
                    this.pageCanvas = null;

                    toast.success('Product added successfully');
                }
            } catch (error) {
                console.error('Form data upload error:', error);
                toast.error('Failed to add product');
            }
        },
        async submitCategoryForm() {
            try {
                console.log(this.categoryInput)
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
                    name: this.categoryName,
                    description: this.categoryDescription,
                    isParent: this.isParentCategory,
                    parentCategoryId: this.categoryInput,
                    picture: this.imageDataURL,
                });

                if (response.status === 200 || response.status === 201) {
                    this.categoryName = '';
                    this.categoryDescription = '';
                    this.isParentCategory = false;
                    this.imageDataURL = null;
                    this.selectedForm = '';

                    this.fetchHomePage();
                    toast.success('Category added successfully');
                }
            } catch (error) {
                console.error('Form data upload error:', error);
                toast.error('Failed to add category');
            }
        },
        selectForm(form: string) {
            this.selectedForm = form
        },
        fetchProductsByCategory(subCategory: string) {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/products/${subCategory}`)
                .then(response => {
                    this.products = response.data.products
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        async fetchAllProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);

                if (response.status === 200) {
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }
    },
    mounted() {
        this.fetchHomePage()
        this.fetchAllProducts()
    }
})

</script>

<template>
    <!--
      Add product or category
    -->
    <section class="container my-3">
        <div class="row">
            <div class="">
                <div class="btn-group">
                    <button type="button" class="btn btn-primary" @click="selectForm('product')">Add Product</button>
                    <button type="button" class="btn btn-primary" @click="selectForm('category')">Add Category</button>
                    <button type="button" class="btn btn-danger" @click="selectForm('')">Clear</button>
                </div>
                <!-- Add new product -->
                <div v-show="categories.length === 0">
                    <div class="alert alert-warning my-3" role="alert">No categories found. Please add categories first.</div>
                </div>
                <div v-show="categories.length > 0 && categories[0]?.parentCategory.children.length === 0 && categories.length === 1">
                    <div class="alert alert-warning my-3" role="alert">No sub-categories found. Please add sub-categories first.</div>
                </div>
                <div class="container-fluid g-0 my-2" v-if="selectedForm === 'product'">
                    <div class="mb-3">
                        <label for="productName" class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="productName" placeholder="Product Name"
                               v-model="productNameInput">
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" rows="3" v-model="descriptionInput"></textarea>
                    </div>
                    <div class="mb-3">
                        <input type="file" @change="handleImageUpload" accept="image/*" class="form-control"/>
                        <img :src="imageDataURL" alt="Uploaded Image Preview" v-if="imageDataURL"/>
                    </div>
                    <div class="mb-3">
                        <select class="form-select" v-model="categoryInput">
                            <optgroup :label="category.name" v-for="category in categories">
                                <option
                                    v-for="subCategory in category.parentCategory.children"
                                    :value="subCategory.id"
                                >
                                    {{ subCategory.name }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" @click="submitProductForm">Submit</button>
                </div>

                <!-- Add new category -->
                <div class="container-fluid g-0 my-2" v-if="selectedForm === 'category'">
                    <div class="mb-3">
                        <label for="categoryName" class="form-label">Category Name</label>
                        <input type="text" class="form-control" id="productName" placeholder="Category Name"
                               v-model="categoryName">
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Category Description</label>
                        <textarea class="form-control" id="description" rows="3"
                                  v-model="categoryDescription"></textarea>
                    </div>
                    <div class="mb-3">
                        <input type="file" @change="handleImageUpload" accept="image/*"/>
                        <img :src="imageDataURL" alt="Uploaded Image Preview" v-if="imageDataURL"/>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="isParent" v-model="isParentCategory">
                        <label class="form-check-label" for="isParent">
                            Is Parent?
                        </label>
                    </div>
                    <div class="mb-3" v-if="isParentCategory">
                        <label class="form-label">Select Sub-Category for this category</label>
                        <div class="form-check"
                             v-for="category in categories.map((c: Category) => c.parentCategory.children).flat()">
                            <input :key="category.id"
                                   :value="category.id"
                                   :id="category.id"
                                   v-model="children"
                                   type="checkbox"
                                   class="btn-check"
                                   :name="category.id"
                                   autocomplete="off">
                            <label :key="category.id"
                                   :for="category.id"
                                   :id="category.id"
                                   class="btn btn-outline-primary">
                                {{ category.name }}
                            </label>
                        </div>
                    </div>
                    <div class="mb-3" v-else>
                        <select class="form-select" v-model="categoryInput">
                            <option selected value="" disabled>Select Parent</option>
                            <option v-for="category in categories" :value="category.parentCategoryId">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary" @click="submitCategoryForm">Submit</button>
                </div>
            </div>
        </div>

        <!--
          If there is no product or category, show the form
        -->
        <div class="container-fluid g-0 my-2" v-if="selectedForm.length === 0">
            <div class="alert alert-info my-3" role="alert">
                ℹ️ Select add product or category to get started
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>
