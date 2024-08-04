<script lang="ts">
import {defineComponent} from 'vue'
import type {Product} from "~/types/global";
import axios from "axios";
import {toast} from "vue3-toastify";

export default defineComponent({
    name: "Products",
    props: {
        productId: {
            type: String,
            required: false
        },
        products: {
            type: Array as () => Product[],
            required: false,
            default: () => []
        },
    },
    data() {
        return {
            fetchedProducts: [] as Product[],
            staticURL: import.meta.env.VITE_STATIC_URL
        };
    },
    methods: {
        async fetchAllProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);

                if (response.status === 200) {
                    this.fetchedProducts = response.data
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        },
        deleteResource(resource: string, id: string) {
            if (confirm('Are you sure you want to delete this resource?')) {
                axios
                    .delete(`${import.meta.env.VITE_BACKEND_URL}/${resource}/${id}`)
                    .then(() => {
                        toast.success('Resource deleted successfully');
                        this.fetchAllProducts();
                    })
                    .catch((error) => {
                        console.error('Failed to delete resource:', error);
                        toast.error('Failed to delete resource');
                    });
            }
        }
    },
    mounted() {
        if (this.products.length === 0) {
            this.fetchAllProducts()
        } else {
            console.log(this)
            this.fetchedProducts = this.$props.products
        }
    }
})
</script>

<template>
    <div class="container my-2">
        <h1 v-if="fetchedProducts.length === 0">No Products Found</h1>
        <h1 v-else>Products</h1>
        <div v-if="fetchedProducts.length > 0" class="row g-1">
            <div class="card col-3" v-for="product in fetchedProducts">
                <div>
                    <img :src="`${staticURL}${product.picture}`" class="card-img-top" :alt="product.name"/>
                    <button class="btn" @click="deleteResource('products', product.id)">
                        <i class="bi bi-trash text-danger"></i>
                    </button>
                </div>
                <div class="card-body">
                    <h4 class="card-title">
                        {{ product.name }}
                    </h4>
                    <p class="card-text">
                        <button class="btn btn-primary btn-sm">
                            {{ product?.category.name ? product.category.name : 'No Category' }}
                        </button>
                        <br/>
                        {{ product.description }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
