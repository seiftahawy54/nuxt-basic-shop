<script lang="ts">
import {defineComponent} from 'vue'
import type {Category, Product} from "~/types/global";
import axios, {AxiosError} from "axios";
import {toast} from "vue3-toastify";

export default defineComponent({
    name: "Category",
    data() {
        return {
            currentCategory: '' as string,
            categories: [] as Category[],
            selectedSubCategory: '' as string,
            fetchedProducts: [] as Product[],
        }
    },
    methods: {
        fetchProductsByCategory(id: string) {
            console.log(id)
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/products/category/${id}`)
                .then(response => {
                    console.log(response)
                    this.fetchedProducts = response.data
                })
                .catch((error) => {
                    this.fetchedProducts = [];
                    if (error.response.status === 404) {
                        toast.info('No products found in this category')
                    }
                    console.log(error)
                })
        },
        deleteCategory(categoryId: string) {
            if (confirm('Are you sure you want to delete this category?')) {
                axios
                    .delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`)
                    .then(() => {
                        toast.success('Category deleted successfully')
                        this.fetchCategories()
                    })
                    .catch((error: AxiosError) => {
                        if (error.response?.status === 404) {
                            toast.info('Category not found')
                        } else if (error.response?.status === 400) {
                            const errorData = error.response?.data as {
                                message: string | undefined
                            };
                            if (typeof errorData.message === 'string') {
                                toast.error(errorData.message as string)
                            } else {
                                toast.error('Failed to delete category')
                            }
                        } else {
                            toast.error('Failed to delete category')
                        }
                    })
            }
        },
        fetchCategories() {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`)
                .then(response => {
                    this.categories = response.data.categories
                })
        },
    },
    mounted() {
        this.fetchCategories();
    },
})
</script>

<template>
    <div class="container my-3">
        <h2>Categories</h2>
        <div class="accordion" v-for="category in categories">
            <!--            <label class="input-group-text">
                            <span>
                                {{ category.name }} 🔄️ {{ category.parentCategory.children.length }}
                            </span>
                        </label>
                        <select v-model="currentCategory" class="form-select" @change="fetchProductsByCategory()">
                            <option :value="subcategory.id" v-for="subcategory in category.parentCategory.children">
                                {{ subcategory.name }}
                            </option>
                        </select>-->
            <div class="accordion-item mb-3">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            :data-bs-target="`#collapse-${category.id}`" aria-expanded="true"
                            :aria-controls="`collapse-${category.id}`">
                        {{ category.name }}
                    </button>
                </h2>
                <div :id="`collapse-${category.id}`" class="accordion-collapse collapse show"
                     data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div v-for="subcategory in category.parentCategory.children"
                             class="d-flex justify-content-between w-100"
                             v-if="category.parentCategory.children.length > 0"
                             @click="fetchProductsByCategory(subcategory.id)"
                        >
                            <div>
                                {{ subcategory.name }}
                            </div>
                            <div>
                                <button class="btn btn-danger" @click="deleteCategory(subcategory.id)">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div v-if="category.parentCategory.children.length === 0"
                             class="d-flex justify-content-between w-100">
                            <button class="btn btn-danger" @click="deleteCategory(category.id)"
                                    v-if="category.parentCategory.children.length === 0">
                                Delete Category
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <Products :products="fetchedProducts" v-show="fetchedProducts.length > 0"/>
    </div>
</template>

<style scoped>

</style>
