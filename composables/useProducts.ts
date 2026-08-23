export function useProducts() {
  const products = ref<any[]>([])
  const categories = ref<any[]>([])
  const loading = ref(false)

  async function fetchProducts() {
    loading.value = true
    try {
      const res = await $fetch<any>('/api/products')
      products.value = res.products || []
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res = await $fetch<any>('/api/products/categories')
      categories.value = res.categories || []
    } catch {}
  }

  return { products, categories, loading, fetchProducts, fetchCategories }
}
