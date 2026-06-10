import { Router } from 'express'
import { products, categories, shopBanners } from '../data/products.js'

const router = Router()

router.get('/', (req, res) => {
  const { category, search, tag } = req.query
  let result = [...products]

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category)
  }
  if (search) {
    const q = String(search).toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  if (tag) {
    result = result.filter((p) => p.tags.includes(String(tag)))
  }

  res.json({ products: result, categories, banners: shopBanners })
})

router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Не найдено' })
  res.json({ product })
})

export default router
