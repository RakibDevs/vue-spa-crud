<template>
  <div class="container">
    <div class="row justify-content-center mt-2 mb-2">
      <div class="col-10">
          
      </div>
      <div class="col-2 ">
        <input
          type="text"
          class="form-control custom-form-control"
          placeholder="Search Products..."
          @input="searchProducts"
          v-model="query.search"
        />
      </div>
    </div>
    <div class="">
      <div class="row products_grid" v-if="!isLoading">

        <div class="col-sm-4" v-for="(item, index) in productsPaginatedData.data" :key="item.id">
          <product-card :index="index" :product="item" />
        </div>
      </div>

      <div v-if="isLoading" class="text-center mt-5 mb-5">
        Loading Products...
        <div class="spinner-grow" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
       <div v-if="productsPaginatedData !== null" class="mt-2 mb-5">
            <v-pagination
              v-model="query.page"
              :pages="productsPaginatedData.pagination.total_pages"
              :range-size="2"
              active-color="#DCEDFF"
              @update:modelValue="getResults"
            />
        </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ProductCard from "./ProductCardComponent";
import VPagination from "vue3-pagination";

export default {
  data() {
    return {
      query: {
        page: 1,
        search: "",
      },
    };
  },
  components: {
    ProductCard,
    VPagination,
  },
  computed: { ...mapGetters(["productList", "productsPaginatedData", "isLoading"]) },

  methods: {
    ...mapActions(["fetchAllProducts"]),

    getResults() {
      this.fetchAllProducts(this.query);
    },
    searchProducts() {
      this.fetchAllProducts(this.query);
    },
  },

  created() {
    this.fetchAllProducts(this.query);
  },
};
</script>
