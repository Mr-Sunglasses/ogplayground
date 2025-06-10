# 🧪 OGPlayground – The Open Graph Protocol Testing Playground

<div align="center">
  <h3>🎯 Test, validate, and perfect your Open Graph tags with real-time social media previews</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
</div>

---

## 🚀 Features

### 🎨 **Live Social Media Previews**
- **Facebook** - Real-time preview with authentic styling
- **Twitter/X** - Support for both summary and large image cards
- **LinkedIn** - Professional preview layout
- **Discord** - Gaming-focused embed styling

### 🛠️ **Advanced Editor**
- **Monaco Editor** - VS Code-like editing experience
- **Syntax Highlighting** - HTML syntax highlighting for OG tags
- **Live Validation** - Real-time error detection and suggestions
- **Template System** - Pre-built templates for blog, product, and event pages

### 🔍 **Smart Validation**
- **Comprehensive Checks** - Validates all major OG properties
- **Intelligent Suggestions** - Actionable recommendations with code examples
- **Character Limits** - Optimal length validation for titles and descriptions
- **Image Validation** - URL format and dimension recommendations

### 🌐 **URL Fetcher**
- **Analyze Existing Sites** - Fetch OG tags from any URL
- **CORS Handling** - Server-side fetching to avoid browser limitations
- **Demo Mode** - Sample data for testing when URLs are unavailable
- **Error Handling** - Graceful fallbacks and error messages

### 📝 **Form-Based Generator**
- **User-Friendly Interface** - Easy form inputs for all OG properties
- **Character Counters** - Real-time length tracking
- **Helpful Tips** - Inline guidance for best practices
- **Export Options** - Copy generated HTML tags

### 🎭 **Modern UI/UX**
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Mobile-first approach
- **Collapsible Sections** - Space-efficient layout
- **Accessibility** - WCAG compliant components

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework with App Router | 15.3.3 |
| **TypeScript** | Type Safety | 5.0+ |
| **Tailwind CSS** | Utility-First Styling | 3.0+ |
| **shadcn/ui** | Component Library | Latest |
| **Monaco Editor** | Code Editor | Latest |
| **Lucide React** | Icon Library | Latest |
| **React Hot Toast** | Notifications | Latest |

---

## 📦 Installation

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Mr-Sunglasses/ogplayground.git
cd ogplayground

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 🎮 Usage Guide

### 1. **Monaco Editor**
The main editor provides a VS Code-like experience for editing HTML with OG tags:

```html
<!-- Example OG tags -->
<meta property="og:title" content="Amazing Product Launch" />
<meta property="og:description" content="Discover our revolutionary new product that will change everything." />
<meta property="og:image" content="https://example.com/product-image.jpg" />
<meta property="og:url" content="https://example.com/product" />
<meta property="og:type" content="website" />
```

**Features:**
- Real-time syntax highlighting
- Auto-completion for OG properties
- Error detection and warnings
- Template insertion

### 2. **Templates**
Choose from pre-built templates:

- **📝 Blog Post** - Article-focused OG tags
- **🛍️ Product Page** - E-commerce optimized tags
- **🎟️ Event Page** - Event-specific properties

### 3. **Validation System**
The validation panel provides:

- **Errors** - Critical issues that must be fixed
- **Warnings** - Optimization suggestions
- **Info** - Best practice recommendations

Each issue includes:
- Clear description of the problem
- Suggested fix with HTML code
- Copy-to-clipboard functionality

### 4. **Social Previews**
See real-time previews for:

| Platform | Preview Type | Special Features |
|----------|--------------|------------------|
| Facebook | Link Card | Blue accent, engagement buttons |
| Twitter/X | Summary/Large Image | Dark theme, retweet UI |
| LinkedIn | Professional Card | Business-focused styling |
| Discord | Rich Embed | Gaming aesthetic, purple accents |

### 5. **URL Fetcher**
Analyze existing websites:

1. Enter any URL in the fetcher
2. Click "Fetch OG Tags"
3. View extracted tags in the editor
4. See how they render in social previews

---

## 🏗️ Project Structure

```
ogplayground/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── fetch-url/     # URL fetching endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── header.tsx        # App header
│   │   ├── og-editor.tsx     # Monaco editor wrapper
│   │   ├── og-validation.tsx # Validation panel
│   │   ├── social-previews.tsx # Preview components
│   │   ├── url-fetcher.tsx   # URL analysis tool
│   │   └── og-generator.tsx  # Form-based generator
│   └── lib/
│       ├── og-parser.ts      # OG tag parsing logic
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json             # Dependencies
└── README.md               # Documentation
```

---

## 🧩 Components Documentation

### `OGEditor`
Monaco editor component for HTML editing.

**Props:**
- `value: string` - HTML content
- `onChange: (value: string) => void` - Change handler
- `className?: string` - Additional CSS classes

**Features:**
- Syntax highlighting
- Template system
- Auto-formatting
- Error detection

### `SocialPreviews`
Renders social media previews for all platforms.

**Props:**
- `ogData: OGData` - Parsed OG tag data

**Platforms:**
- Facebook preview with engagement UI
- Twitter card with dark theme
- LinkedIn professional layout
- Discord rich embed

### `OGValidation`
Validation panel with collapsible suggestions.

**Props:**
- `issues: ValidationIssue[]` - Array of validation issues

**Features:**
- Error/warning/info categorization
- Collapsible suggestions
- Copy-to-clipboard functionality
- Responsive design

### `URLFetcher`
Tool for fetching OG tags from external URLs.

**Features:**
- Server-side CORS handling
- Error handling with fallbacks
- Loading states
- Demo mode

---

## 🔧 API Documentation

### `POST /api/fetch-url`

Fetches OG tags from a given URL using server-side rendering to avoid CORS issues.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "url": "https://example.com"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch URL"
}
```

---

## 🎨 Styling System

### Tailwind Configuration
The project uses a custom Tailwind configuration with:

- **Custom Colors** - Extended palette for better theming
- **Typography** - Optimized font scales
- **Animations** - Smooth transitions
- **Dark Mode** - Automatic theme switching

### Component Styling
- **shadcn/ui** - Pre-styled, accessible components
- **CSS Modules** - Scoped styling where needed
- **Utility Classes** - Tailwind-first approach

---

## 🔍 Validation Rules

### Required Tags
- `og:title` - Page title (40-60 characters recommended)
- `og:description` - Page description (120-160 characters recommended)
- `og:image` - Preview image (1200x630px recommended)
- `og:url` - Canonical URL

### Optional but Recommended
- `og:type` - Content type (website, article, product, etc.)
- `og:site_name` - Website name
- `twitter:card` - Twitter card type
- `twitter:title` - Twitter-specific title
- `twitter:description` - Twitter-specific description

### Image Validation
- Must be absolute URL (https://)
- Recommended dimensions: 1200x630px
- Supported formats: JPG, PNG, WebP
- Maximum file size: 8MB

---

## 🚀 Deployment

### Netlify
```bash
# Build
npm run build

# Deploy to Netlify (drag and drop .next folder)
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- **TypeScript** - All code must be typed
- **ESLint** - Follow the provided linting rules
- **Testing** - Add tests for new features
- **Documentation** - Update docs for API changes

### Code Style
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - For the beautiful component library
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - For the powerful code editor
- **[Next.js](https://nextjs.org/)** - For the amazing React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first styling
- **[Lucide](https://lucide.dev/)** - For the consistent icon set

---

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/Mr-Sunglasses/ogplayground/issues)
- **Discussions** - [GitHub Discussions](https://github.com/Mr-Sunglasses/ogplayground/discussions)
- **Email** - itskanishkp.py@gmail.com

---

<div align="center">
  <p>Made with ❤️ for the web development community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
