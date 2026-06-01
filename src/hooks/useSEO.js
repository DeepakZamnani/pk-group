import { useEffect } from 'react'

const SITE_NAME  = 'PK Group'
const BASE_URL   = 'https://www.pkgroupcompanies.com'
const DEFAULT_IMAGE = 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/hero.jpg'

/**
 * Sets per-page <head> SEO — title, description, canonical, OG, Twitter, JSON-LD.
 * @param {object} opts
 * @param {string}  opts.title       - Page-specific title (appended with " | PK Group")
 * @param {string}  opts.description - 150-160 char page description
 * @param {string}  [opts.image]     - Absolute URL for OG/Twitter image
 * @param {string}  opts.path        - Route path e.g. "/about"
 * @param {object}  [opts.jsonLd]    - Page-level JSON-LD object (schema.org)
 */
export function useSEO({ title, description, image, path, jsonLd }) {
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    const fullTitle    = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Real Estate Developer in Pune`
    const canonicalUrl = `${BASE_URL}${path || '/'}`
    const ogImage      = image || DEFAULT_IMAGE

    document.title = fullTitle

    const setMeta = (attr, key, value) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    const setLink = (rel, value) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.rel = rel
        document.head.appendChild(el)
      }
      el.href = value
    }

    // Description
    if (description) {
      setMeta('name',     'description',       description)
      setMeta('property', 'og:description',    description)
      setMeta('name',     'twitter:description', description)
    }

    // Title
    setMeta('property', 'og:title',        fullTitle)
    setMeta('name',     'twitter:title',   fullTitle)

    // URL + canonical
    setMeta('property', 'og:url', canonicalUrl)
    setLink('canonical', canonicalUrl)

    // Image
    setMeta('property', 'og:image',          ogImage)
    setMeta('property', 'og:image:secure_url', ogImage)
    setMeta('name',     'twitter:image',     ogImage)

    // JSON-LD
    if (jsonLdStr) {
      const existing = document.getElementById('page-jsonld')
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id   = 'page-jsonld'
      script.textContent = jsonLdStr
      document.head.appendChild(script)
    }

    return () => {
      const script = document.getElementById('page-jsonld')
      if (script) script.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, path, jsonLdStr])
}
