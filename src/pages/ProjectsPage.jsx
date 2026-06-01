import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoSection from '../components/VideoSection'
import { useSEO } from '../hooks/useSEO'

gsap.registerPlugin(ScrollTrigger)

function galleryGridStyle(count) {
  if (count <= 2) return { gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: '480px' }
  if (count <= 4) return { gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: '380px 380px' }
  return { gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '480px 320px 380px 260px' }
}

function galleryItemStyle(i, count) {
  if (count <= 2) return {}
  if (count <= 4) {
    if (i === 0) return { gridColumn: '1 / 3' }
    if (i === count - 1 && count === 4) return { gridColumn: '1 / 3' }
    return {}
  }
  // 5–7 items: editorial 3-col layout
  if (i === 0) return { gridColumn: '1 / 3' }
  if (i === 1) return { gridColumn: '3', gridRow: '1 / 3' }
  if (i === 4) return { gridColumn: '1 / 3' }
  if (i === count - 1) return { gridColumn: '1 / 4' }
  return {}
}

const PROJECTS = [
  {
    id:       'canopus',
    name:     'PK Canopus',
    location: 'Wakad · Pune',
    year:     '2026',
    heroBg:   'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/hero.jpg',
    sub:      '3 & 4 BHK ultra-luxurious apartments rising above Wakad. Live close to everything — Hinjawadi, Phoenix Mall, top schools — and shine above all.',
    seo: {
      title:       'PK Canopus Wakad | 3 & 4 BHK Ultra-Luxury Apartments Pune',
      description: 'PK Canopus — a landmark 24-floor mixed-use address in Wakad, Pune. 120 ultra-luxury 3 & 4 BHK residences, 5.7 km from Hinjawadi. Resort-style pool, fitness studio, padel court & more.',
      image:       'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building.jpg',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemPage',
        'url': 'https://www.pkgroupcompanies.com/projects',
        'name': 'PK Canopus | 3 & 4 BHK Ultra-Luxury Apartments Wakad Pune',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': 'https://www.pkgroupcompanies.com/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': 'https://www.pkgroupcompanies.com/projects' },
            { '@type': 'ListItem', 'position': 3, 'name': 'PK Canopus' },
          ],
        },
        'mainEntity': {
          '@type': 'Residence',
          'name': 'PK Canopus',
          'description': 'Ultra-luxury 3 & 4 BHK apartments across 24 floors in Wakad, Pimpri Chinchwad. 120 exclusive units with resort-style pool, professional fitness studio, padel court, home theatre, and curated retail.',
          'numberOfRooms': '3-4',
          'floorLevel': '24',
          'image': 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building.jpg',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Wakad',
            'addressRegion': 'Pimpri Chinchwad, Maharashtra',
            'postalCode': '411057',
            'addressCountry': 'IN',
          },
          'containsPlace': [
            { '@type': 'ApartmentComplex', 'name': 'PK Canopus', 'numberOfAccommodationUnits': 120 },
          ],
          'amenityFeature': [
            { '@type': 'LocationFeatureSpecification', 'name': 'Resort-style swimming pool', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Professional-grade fitness studio', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Padel & tennis court', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'In-house home theatre', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Clubhouse & games lounge', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': "Dedicated kids' play zone", 'value': true },
          ],
        },
      },
    },
    stats: [
      { num: '24',   label: 'Floors'     },
      { num: '120',  label: 'Units'      },
      { num: '3.2L', label: 'Sq. Ft.'   },
      { num: '2026', label: 'Completion' },
    ],
    infoHeading: ['Designed for', 'the way you live.'],
    infoBody: 'PK Canopus rises above Wakad as a landmark mixed-use address — 3 & 4 BHK ultra-luxurious residences above a curated ground-floor precinct of boutique retail, restaurants, and workspaces. Positioned 5.7 km from Hinjawadi Phase 1, 170 m from EuroSchool, and 1.9 km from Phoenix Mall of the Millennium, every detail of the location has been considered as carefully as the architecture itself.',
    amenities: [
      'Ground-floor retail & boutique shops',
      'Restaurant & dining outlets',
      'Resort-style swimming pool',
      'Professional-grade fitness studio',
      'Padel & tennis court',
      'In-house home theatre',
      'Clubhouse & games lounge',
      'Dedicated kids\' play zone',
    ],
    gallery: [
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building.jpg',     caption: 'Exterior'        },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/pool-day.jpg',     caption: 'Aqua'            },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building-2.jpg',   caption: 'Elevation'       },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/gym.jpg',          caption: 'Fitness Studio'  },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/clubhouse.jpg',    caption: 'Clubhouse'       },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/theatre.jpg',      caption: 'Private Theatre' },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/tennis-court.jpg', caption: 'Sport Court'     },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.1.png',  caption: 'Project Overview' },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.2.png',  caption: 'Location Map'     },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.3.png',  caption: 'Floor Plan'       },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.4.png',  caption: 'View 04'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.5.png',  caption: 'View 05'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.6.png',  caption: 'View 06'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.7.png',  caption: 'View 07'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.8.png',  caption: 'View 08'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.9.png',  caption: 'View 09'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.10.png', caption: 'View 10'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.11.png', caption: 'View 11'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.12.png', caption: 'View 12'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.13.png', caption: 'View 13'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.14.png', caption: 'View 14'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.15.png', caption: 'View 15'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.16.png', caption: 'View 16'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.17.png', caption: 'View 17'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.18.png', caption: 'View 18'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.19.png', caption: 'View 19'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.20.png', caption: 'View 20'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.21.png', caption: 'View 21'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.22.png', caption: 'View 22'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.23.png', caption: 'View 23'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.24.png', caption: 'View 24'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.25.png', caption: 'View 25'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.26.png', caption: 'View 26'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.27.png', caption: 'View 27'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.28.png', caption: 'View 28'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.29.png', caption: 'View 29'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.30.png', caption: 'View 30'          },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/ebsite%202/Still%202026-05-23%20010129_1.1.31.png', caption: 'View 31'          },
    ],
    video: {
      ytId:    'hGmHAxVMwiQ',
      thumb:   'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building-2.jpg',
      tagline: 'Ours changes how.',
      lines: [
        { text: 'Some addresses',    indent: 0, italic: false },
        { text: "don't just change", indent: 1, italic: false },
        { text: 'where you live.',   indent: 2, italic: true  },
      ],
      cardMeta: { label: 'PK Canopus — Wakad, Pune', year: '2026' },
    },
  },
  {
    id:       'ornate',
    name:     'PK Ornate',
    location: 'Pimple Saudagar · Pune',
    year:     '2025',
    sub:      '2 & 2.5 BHK premium residences in the heart of Pimple Saudagar. Surrounded by lush greenery — a private oasis designed for families who refuse to compromise.',
    seo: {
      title:       'PK Ornate Pimple Saudagar | 2 & 2.5 BHK Premium Homes Pune',
      description: 'PK Ornate — premium 2 & 2.5 BHK residences from 775 sq. ft. in Pimple Saudagar, Pune. Customizable interiors, yoga plaza, party lawn, senior sitout. Designed for families who refuse to compromise.',
      image:       'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/hero.png',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemPage',
        'url': 'https://www.pkgroupcompanies.com/projects',
        'name': 'PK Ornate | 2 & 2.5 BHK Premium Residences Pimple Saudagar Pune',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': 'https://www.pkgroupcompanies.com/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': 'https://www.pkgroupcompanies.com/projects' },
            { '@type': 'ListItem', 'position': 3, 'name': 'PK Ornate' },
          ],
        },
        'mainEntity': {
          '@type': 'Residence',
          'name': 'PK Ornate',
          'description': 'Premium 2 & 2.5 BHK residences from 775 sq. ft. in Pimple Saudagar, Pune. Surrounded by greenery with customizable interiors, yoga & meditation plaza, party lawn, gazebo, and senior citizen sitout.',
          'numberOfRooms': '2-2.5',
          'image': 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/hero.png',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Pimple Saudagar',
            'addressRegion': 'Pune, Maharashtra',
            'postalCode': '411027',
            'addressCountry': 'IN',
          },
          'amenityFeature': [
            { '@type': 'LocationFeatureSpecification', 'name': 'Yoga & meditation plaza', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Party lawn', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Gazebo', 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Senior citizen sitout', 'value': true },
            { '@type': 'LocationFeatureSpecification', "name": "Children's play area", 'value': true },
            { '@type': 'LocationFeatureSpecification', 'name': 'Customizable modern interiors', 'value': true },
          ],
        },
      },
    },
    stats: [
      { num: '1',    label: 'Tower'      },
      { num: '775',  label: 'Sq. Ft. from' },
      { num: '938',  label: 'Sq. Ft. to' },
      { num: '2027', label: 'Completion' },
    ],
    infoHeading: ['Prelude to an', 'Unparalleled Life.'],
    infoBody: 'PK Ornate is a premium single-tower development in Pimple Saudagar offering spacious 2 & 2.5 BHK residences from 775 sq. ft. Every home is your private oasis — customizable interiors, generous living zones, and natural light throughout. Surrounded by greenery and built around family wellness, Ornate is crafted for those upgrading to a life without compromise.',
    amenities: [
      'Senior citizen sitout',
      "Children's play area",
      'Yoga & meditation plaza',
      'Party lawn',
      'Gazebo',
      'Customizable modern interiors',
      'Premium design flexibility',
      'Green & serene surroundings',
    ],
    heroBg: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/hero.jpg',
    gallery: [
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/PK%20Ornate%20Brochure%20(1).pdf%20(2).jpg',  caption: 'Overview'    },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/PK%20Ornate%20Brochure%20(1).pdf%20(6).jpg',  caption: 'Design'      },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/PK%20Ornate%20Brochure%20(1).pdf%20(7).jpg',  caption: 'Elevation'   },
      { src: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/PK%20Ornate%20Brochure%20(1).pdf%20(8).jpg',  caption: 'Perspective' },
    ],
    video: {
      ytId:    '',
      thumb:   'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-ornate/PK%20Ornate%20Brochure%20(1).pdf%20(2).jpg',
      tagline: 'Prelude to an Unparalleled Life.',
      lines: [
        { text: 'Not every home',      indent: 0, italic: false },
        { text: 'feels like a',        indent: 1, italic: false },
        { text: 'private oasis.',      indent: 2, italic: true  },
      ],
      cardMeta: { label: 'PK Ornate — Pimple Saudagar, Pune', year: '2027' },
    },
  },{
  id: 'hillcrest',
  name: 'PK Hillcrest',
  location: 'Pimple Saudagar · Pune',
  year: '2027',
  sub: '3 & 4 BHK premium homes crafted for elevated urban living. A landmark lifestyle destination where South Pune comes to live, shop, and play.',
  seo: {
    title:       'PK Hillcrest Pimple Saudagar | 3 & 4 BHK Luxury Homes Pune',
    description: 'PK Hillcrest — premium 3 & 4 BHK lifestyle residences in South Pune. Infinity pool, sky-level fitness, luxury clubhouse, retail boulevard, and 20+ world-class amenities. Completion 2027.',
    image:       '/carousel-hillcrest/hero.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      'url': 'https://www.pkgroupcompanies.com/projects',
      'name': 'PK Hillcrest | 3 & 4 BHK Premium Luxury Homes Pimple Saudagar Pune',
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': 'https://www.pkgroupcompanies.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': 'https://www.pkgroupcompanies.com/projects' },
          { '@type': 'ListItem', 'position': 3, 'name': 'PK Hillcrest' },
        ],
      },
      'mainEntity': {
        '@type': 'Residence',
        'name': 'PK Hillcrest',
        'description': '3 & 4 BHK premium lifestyle residences in South Pune with infinity swimming pool, sky-level fitness center, luxury clubhouse, retail boulevard, and 20+ curated amenities. Expected completion 2027.',
        'numberOfRooms': '3-4',
        'image': 'https://www.pkgroupcompanies.com/carousel-hillcrest/hero.png',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Pimple Saudagar',
          'addressRegion': 'Pune, Maharashtra',
          'postalCode': '411027',
          'addressCountry': 'IN',
        },
        'amenityFeature': [
          { '@type': 'LocationFeatureSpecification', 'name': 'Infinity swimming pool', 'value': true },
          { '@type': 'LocationFeatureSpecification', 'name': 'Sky-level fitness center', 'value': true },
          { '@type': 'LocationFeatureSpecification', 'name': 'Luxury clubhouse', 'value': true },
          { '@type': 'LocationFeatureSpecification', 'name': 'Retail boulevard', 'value': true },
          { '@type': 'LocationFeatureSpecification', 'name': 'Premium rooftop amenities', 'value': true },
        ],
      },
    },
  },
  stats: [
    { num: '1', label: 'Tower' },
    { num: '3 & 4', label: 'BHK Homes' },
    { num: '20+', label: 'Lifestyle Amenities' },
    { num: '2027', label: 'Completion' }
  ],
  infoHeading: ['Where South Pune comes to', 'live, shop, and play.'],
  infoBody: 'PK Hillcrest is a premium lifestyle development in South Pune offering expansive 3 & 4 BHK residences paired with curated retail and elevated luxury experiences. Designed to uplift every sense, Hillcrest blends landmark architecture, rooftop indulgence, world-class amenities, and thoughtfully planned living spaces to create a destination for those who expect more from life.',
  amenities: [
    'Infinity swimming pool',
    'Sky-level fitness center',
    'Premium rooftop amenities',
    'Retail boulevard',
    'Landscaped leisure zones',
    'Luxury clubhouse',
    'Children’s recreation spaces',
    'Modern expansive interiors',
    'High-street shopping access',
    'Designer architectural elevation'
  ],
  heroBg: '/carousel-hillcrest/hero.png',
  gallery: [
    { src: '/carousel-hillcrest/PK Hill Crest Mini Brochure (1).png', caption: 'Overview' },
    { src: '/carousel-hillcrest/PK Hill Crest Mini Brochure (2).png', caption: 'Elevation' },
    { src: '/carousel-hillcrest/PK Hill Crest Mini Brochure (3).png', caption: 'Lifestyle' },
    { src: '/carousel-hillcrest/PK Hill Crest Mini Brochure (4).png', caption: 'Amenities' }
  ],
  video: {
    ytId: '',
    thumb: '/carousel-hillcrest/PK Hill Crest Mini Brochure (1).png',
    tagline: 'Uplifting in every sense.',
    lines: [
      { text: 'Not every address', indent: 0, italic: false },
      { text: 'becomes a lifestyle', indent: 1, italic: false },
      { text: 'destination.', indent: 2, italic: true }
    ],
    cardMeta: {
      label: 'PK Hillcrest — Pimple Saudagar, Pune',
      year: '2027'
    }
  }
}

]

const GALLERY_PREVIEW = 4

export default function ProjectsPage() {
  const [active, setActive]                   = useState(0)
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const [lightboxIdx, setLightboxIdx]         = useState(null)
  const project = PROJECTS[active]

  const lbTotal   = project.gallery.length
  const lbPrev    = () => setLightboxIdx(i => (i - 1 + lbTotal) % lbTotal)
  const lbNext    = () => setLightboxIdx(i => (i + 1) % lbTotal)
  const lbClose   = () => setLightboxIdx(null)

  useEffect(() => { setGalleryExpanded(false) }, [active])

  useEffect(() => {
    if (lightboxIdx === null) return
    const onKey = e => {
      if (e.key === 'Escape')     lbClose()
      if (e.key === 'ArrowRight') lbNext()
      if (e.key === 'ArrowLeft')  lbPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, lbTotal])

  useSEO({
    title:       project.seo.title,
    description: project.seo.description,
    image:       project.seo.image,
    path:        '/projects',
    jsonLd:      project.seo.jsonLd,
  })

  const heroLine1  = useRef(null)
  const heroMeta   = useRef(null)
  const heroSub    = useRef(null)
  const heroBgRef  = useRef(null)
  const contentRef = useRef(null)
  const statsRef   = useRef([])
  const galleryRef = useRef([])
  const infoRef    = useRef(null)

  // Hero entrance — once
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (window.matchMedia('(max-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      gsap.set(heroMeta.current,  { opacity: 0, y: 10 })
      gsap.set(heroLine1.current, { yPercent: 110 })
      gsap.set(heroSub.current,   { opacity: 0, y: 16 })

      gsap.to(heroMeta.current,  { opacity: 1, y: 0, duration: 0.8,  delay: 0.15, ease: 'power3.out' })
      gsap.to(heroLine1.current, { yPercent: 0, duration: 1.2, delay: 0.28, ease: 'power4.out' })
      gsap.to(heroSub.current,   { opacity: 1, y: 0, duration: 0.9,  delay: 0.55, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  // Content animations — reruns on tab switch
  useLayoutEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )

      statsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 28 })
        ScrollTrigger.create({
          trigger: el, start: 'top 95%',
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out' }),
        })
      })

      if (infoRef.current) {
        const lines = infoRef.current.querySelectorAll('.proj-info-line')
        const body  = infoRef.current.querySelector('.proj-info-body')
        const cta   = infoRef.current.querySelector('.proj-cta')
        gsap.set(lines, { yPercent: 110 })
        gsap.set([body, cta].filter(Boolean), { opacity: 0, y: 20 })
        ScrollTrigger.create({
          trigger: infoRef.current, start: 'top 88%',
          onEnter() {
            gsap.to(lines, { yPercent: 0, duration: 1.0, stagger: 0.1, ease: 'power4.out' })
            gsap.to(body,  { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: 'power3.out' })
            if (cta) gsap.to(cta, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' })
          },
        })
      }

      galleryRef.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 32 })
        ScrollTrigger.create({
          trigger: el, start: 'top 97%',
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.0, delay: i * 0.06, ease: 'power3.out' }),
        })
      })

      const t = setTimeout(() => ScrollTrigger.refresh(), 150)
      return () => clearTimeout(t)
    })

    return () => ctx.revert()
  }, [active])

  const switchTab = (i) => {
    if (i === active) return

    if (window.matchMedia('(max-width: 768px)').matches) {
      setActive(i)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    gsap.to(heroLine1.current, {
      yPercent: -110, duration: 0.35, ease: 'power3.in',
      onComplete() {
        gsap.set(heroLine1.current, { yPercent: 110 })
        gsap.to(heroLine1.current, { yPercent: 0, duration: 0.9, delay: 0.1, ease: 'power4.out' })
      },
    })
    gsap.to(heroMeta.current, {
      opacity: 0, y: -6, duration: 0.25, ease: 'power2.in',
      onComplete() {
        gsap.set(heroMeta.current, { y: 10 })
        gsap.to(heroMeta.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' })
      },
    })
    gsap.to(contentRef.current, { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' })
    gsap.to(heroBgRef.current, {
      opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete() {
        const bg = PROJECTS[i].heroBg
        heroBgRef.current.style.backgroundImage = bg ? `url(${bg})` : 'none'
        setActive(i)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        gsap.to(heroBgRef.current, { opacity: 1, duration: 0.9, ease: 'power2.out' })
      },
    })
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="proj-hero">
        {/* Background image */}
        <div
          ref={heroBgRef}
          className="proj-hero-bg"
          style={{ backgroundImage: project.heroBg ? `url(${project.heroBg})` : 'none' }}
        />

        <div className="proj-hero-bar">
          <span className="proj-eyebrow">Our Projects</span>
          <div className="proj-tabs">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                className={`proj-tab${active === i ? ' proj-tab--active' : ''}`}
                onClick={() => switchTab(i)}
              >{p.name}</button>
            ))}
          </div>
        </div>

        <div className="proj-hero-name-area">
          <span className="proj-year-ghost" aria-hidden="true">{project.year}</span>

          <div className="proj-hero-meta" ref={heroMeta}>
            <span className="proj-location-tag">{project.location}</span>
          </div>

          <h1 className="proj-heading">
            <div className="proj-mask">
              <span ref={heroLine1}>{project.name}</span>
            </div>
          </h1>
        </div>

        <div className="proj-hero-foot">
          <div className="proj-hero-rule" />
          <p ref={heroSub} className="proj-sub">{project.sub}</p>
        </div>
      </section>

      {/* ── SWITCHABLE CONTENT ── */}
      <div ref={contentRef}>

        {/* ── SPREAD: INFO LEFT + STATS RIGHT ── */}
        <section className="proj-spread">
          <div className="proj-spread-left">
            <span className="proj-ghost-num" aria-hidden="true">01</span>
            <div ref={infoRef} className="proj-info">
              <h2 className="proj-info-heading">
                {project.infoHeading.map((l, i) => (
                  <div key={i} className={`proj-mask${i === 1 ? ' proj-mask--indent' : ''}`}>
                    <span className="proj-info-line">{l}</span>
                  </div>
                ))}
              </h2>
              <p className="proj-info-body">{project.infoBody}</p>
              <a
                href="#contact"
                className="proj-cta"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                <span>Enquire Now</span>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="proj-spread-right">
            {project.stats.map((s, i) => (
              <div key={i} ref={el => statsRef.current[i] = el} className="proj-spread-stat">
                <span className="proj-spread-stat-num">{s.num}</span>
                <span className="proj-spread-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── AMENITIES TICKER ── */}
        <div className="proj-amenities-strip">
          <span className="proj-amenities-label">Amenities</span>
          <div className="proj-ticker-track">
            <div className="proj-ticker-inner">
              {[...project.amenities, ...project.amenities, ...project.amenities].map((a, i) => (
                <span key={i} className="proj-ticker-item">
                  <span className="proj-ticker-dot" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── VIDEO ── */}
        {project.video?.ytId && (
          <VideoSection
            ytId={project.video.ytId}
            thumb={project.video.thumb}
            lines={project.video.lines}
            tagline={project.video.tagline}
            cardMeta={project.video.cardMeta}
          />
        )}

        {/* ── GALLERY ── */}
        {project.gallery.length > 0 ? (() => {
          const previewCount  = Math.min(GALLERY_PREVIEW, project.gallery.length)
          const visibleCount  = galleryExpanded ? project.gallery.length : previewCount
          const visibleItems  = project.gallery.slice(0, visibleCount)
          const hiddenCount   = project.gallery.length - previewCount

          return (
            <>
              <div
                className="proj-gallery"
                style={galleryGridStyle(visibleCount)}
              >
                {visibleItems.map((g, i) => (
                  <div
                    key={`${active}-${i}`}
                    ref={el => galleryRef.current[i] = el}
                    className={`proj-gallery-item${i >= GALLERY_PREVIEW ? ' proj-gallery-item--new' : ''}`}
                    style={{ ...galleryItemStyle(i, visibleCount), cursor: 'zoom-in' }}
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img src={g.src} alt={g.caption} loading={i === 0 ? 'eager' : 'lazy'} />
                    <span className="proj-gallery-caption">{g.caption}</span>
                  </div>
                ))}
              </div>


              {hiddenCount > 0 && (
                <div className="proj-gallery-footer">
                  {!galleryExpanded && (
                    <p className="proj-gallery-tally">
                      Showing {previewCount} of {project.gallery.length}
                    </p>
                  )}
                  <button
                    className="proj-gallery-expand-btn"
                    data-expanded={galleryExpanded}
                    onClick={() => setGalleryExpanded(e => !e)}
                  >
                    {galleryExpanded ? (
                      <>
                        <span>Show Less</span>
                        <span className="proj-gallery-expand-icon">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>View All {project.gallery.length} Photographs</span>
                        <span className="proj-gallery-expand-icon">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )
        })() : (
          <div className="proj-coming-soon">
            <span className="proj-coming-eyebrow">Gallery</span>
            <p className="proj-coming-text">Assets coming soon.</p>
          </div>
        )}

      </div>

      <Footer />

      {lightboxIdx !== null && createPortal(
        <div className="lightbox" onClick={lbClose}>
          <button className="lightbox-close" onClick={lbClose}>✕</button>

          <button className="lightbox-nav lightbox-nav--prev" onClick={e => { e.stopPropagation(); lbPrev() }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <img
            key={lightboxIdx}
            src={project.gallery[lightboxIdx].src}
            alt={project.gallery[lightboxIdx].caption}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />

          <button className="lightbox-nav lightbox-nav--next" onClick={e => { e.stopPropagation(); lbNext() }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="lightbox-caption">
            <span className="lightbox-label">{project.gallery[lightboxIdx].caption}</span>
            <span className="lightbox-sub">{lightboxIdx + 1} / {lbTotal}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
