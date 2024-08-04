<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: "Navbar"
})
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-dark" data-bs-theme="dark">
        <div class="container-fluid">
<!--            <a class="navbar-brand">Simple Shop</a>-->
            <RouterLink to="/" class="navbar-brand">Simple Shop</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <NuxtLink to="/products" class="nav-link active">Products</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<style scoped>

</style>
