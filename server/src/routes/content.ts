import { Router } from 'express'
import { news } from '../data/news.js'
import { rules } from '../data/rules.js'
import { aboutContent } from '../data/about.js'

const router = Router()

router.get('/news', (_req, res) => res.json({ news }))
router.get('/rules', (_req, res) => res.json({ rules }))
router.get('/about', (_req, res) => res.json(aboutContent))

export default router
