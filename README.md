# 🧪 OGPlayground – The Open Graph Protocol Testing Playground

The ultimate playground for testing, validating, and previewing your Open Graph meta tags with real-time social media previews.

![OGPlayground Screenshot](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=entropy&auto=format)

## ✨ Features

### 🎨 Live Social Media Previews
- **Facebook** - See how your content appears in Facebook posts
- **Twitter/X** - Preview both summary and large image card formats  
- **LinkedIn** - Professional network preview simulation
- **Discord** - Rich embed preview for Discord channels

### 🔍 Smart Validation & Diagnostics
- Real-time validation of Open Graph tags
- Character count recommendations
- Missing tag detection
- Platform-specific validation rules
- Actionable suggestions with copy-to-clipboard

### ⚡ Modern Code Editor
- Monaco Editor with syntax highlighting
- HTML/meta tag auto-completion
- Error detection and formatting
- Copy and export functionality

### 🎯 Ready-to-Use Templates
- **Blog Post** - Perfect for articles and blog content
- **Product** - E-commerce and product pages
- **Event** - Conferences, meetups, and events
- **Custom** - Build your own from scratch

### 🌐 URL Fetcher & Analyzer
- Fetch Open Graph tags from any URL
- Analyze existing implementations
- Learn from successful examples
- CORS-aware with proxy support

### 🛠️ OG Tag Generator
- User-friendly form interface
- Real-time character counting
- Field validation and tips
- Multiple content type support

### 🌙 Dark/Light Mode
- System preference detection
- Smooth theme transitions
- Consistent styling across components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ogplayground.git
cd ogplayground
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Code Editor**: Monaco Editor (VS Code)
- **Icons**: Lucide React
- **Theme**: next-themes
- **Notifications**: react-hot-toast
- **Language**: TypeScript

## 📁 Project Structure

```
ogplayground/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout with theme provider
│   │   ├── page.tsx          # Main page component
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── header.tsx        # App header with navigation
│   │   ├── og-editor.tsx     # Monaco code editor
│   │   ├── social-previews.tsx # Social media previews
│   │   ├── og-validation.tsx # Validation component
│   │   ├── url-fetcher.tsx   # URL fetching tool
│   │   ├── og-generator.tsx  # Form-based generator
│   │   ├── mode-toggle.tsx   # Theme switcher
│   │   └── theme-provider.tsx # Theme context
│   └── lib/
│       ├── og-parser.ts      # OG tag parsing & validation
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
└── package.json
```

## 🎯 Usage Examples

### 1. Testing Existing Tags
1. Open the **Editor** tab
2. Paste your HTML meta tags
3. View real-time previews in the right panel
4. Check validation results below

### 2. Generating New Tags
1. Switch to the **Generator** tab
2. Fill in the form fields
3. Click "Generate OG Tags"
4. Copy the generated HTML to your website

### 3. Analyzing URLs
1. Go to the **URL Fetcher** tab
2. Enter any website URL
3. Click "Fetch" to analyze their OG implementation
4. Learn from their setup

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configurations:

```bash
# Optional: Custom CORS proxy for URL fetching
NEXT_PUBLIC_CORS_PROXY=https://your-proxy.com/

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Customizing Templates
Add new templates in `src/components/og-editor.tsx`:

```typescript
const templates = {
  // ... existing templates
  custom: {
    name: "Custom Template",
    icon: YourIcon,
    content: `<meta property="og:title" content="..." />`
  }
}
```

## 🤝 Contributing

We love contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component names
- Add JSDoc comments for complex functions
- Ensure responsive design
- Test across different browsers

## 📚 Learn More

- [Open Graph Protocol Specification](https://ogp.me/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 🐛 Issues & Support

Found a bug or have a feature request?

1. Check existing [GitHub Issues](https://github.com/your-username/ogplayground/issues)
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open Graph Protocol](https://ogp.me/) for the specification
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Vercel](https://vercel.com/) for deployment platform
- All the amazing open source contributors

---

<div align="center">
  <p>Made with ❤️ by developers, for developers</p>
  <p>
    <a href="https://ogplayground.dev">🌐 Live Demo</a> •
    <a href="#-features">📋 Features</a> •
    <a href="#-getting-started">🚀 Get Started</a> •
    <a href="#🤝-contributing">🤝 Contribute</a>
  </p>
</div>
