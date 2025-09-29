# ConvertAnything - Free Online File Converter

A comprehensive client-side file conversion website with 185+ different file conversions that work entirely in the browser without any server processing.

## Features

- **185+ Conversion Tools** - Images, PDFs, videos, audio, documents, data formats, archives, and utilities
- **100% Private** - All conversions happen in your browser, files never leave your device
- **No Registration** - Use immediately without signing up
- **No Limits** - Convert as many files as you want
- **Modern UI** - Built with Next.js 15, TypeScript, and Tailwind CSS
- **Fast & Secure** - Lightning-fast conversions with complete privacy

## Categories

- 🖼️ **Image Tools** - Convert and optimize images (PNG, JPG, WEBP, BMP, etc.)
- 📄 **PDF Tools** - PDF conversion and manipulation
- 🎥 **Video Tools** - Video format conversions
- 🎵 **Audio Tools** - Audio format conversions
- 📝 **Document Tools** - Document conversions
- 📊 **Data Tools** - Data format conversions (CSV, JSON, XML, etc.)
- 📦 **Archive Tools** - Compression and archives
- 🔧 **Utilities** - QR codes, barcodes, color picker, etc.

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js) or **yarn**

## Quick Start

1. **Open terminal/command prompt in the project directory**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser and visit:** `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
D:/ConvertAnything/
├── app/                    # Next.js app router pages
│   ├── [conversion]/      # Dynamic conversion pages
│   ├── category/          # Category pages
│   ├── all-tools/         # All tools listing
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ConversionPage.tsx # Main conversion interface
│   ├── FileUploader.tsx   # File upload component
│   ├── SearchBar.tsx      # Search functionality
│   └── ...               # Other components
├── lib/                   # Core logic
│   ├── converters/        # Conversion modules
│   ├── conversionMap.ts   # All available conversions
│   └── types.ts          # TypeScript types
└── package.json          # Dependencies and scripts
```

## Key Technologies

- **Next.js 15** - React framework with app router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **FFmpeg.wasm** - Video/audio conversion
- **PDF-lib** - PDF manipulation
- **Mammoth** - Word document processing
- **Papa Parse** - CSV parsing
- **XLSX** - Excel file handling
- **JSZip** - Archive creation/extraction
- **Lucide React** - Icons

## Supported Conversions

### Image Conversions (20+)
- PNG ↔ JPG, WEBP, BMP, TIFF
- Image compression and resizing
- Image rotation and flipping
- HEIC to JPG/PNG
- SVG to PNG/JPG/PDF
- ICO creation

### PDF Conversions (25+)
- PDF to images (JPG, PNG)
- Images to PDF
- PDF merge and split
- PDF compression
- HTML to PDF
- Text to PDF
- PDF rotation and page deletion
- Word/Excel/PowerPoint to PDF

### Video Conversions (15+)
- MP4 ↔ WEBM, AVI, MOV, MKV
- Video compression and trimming
- Video to GIF
- Video to audio extraction
- Frame extraction

### Audio Conversions (15+)
- MP3 ↔ WAV, OGG, M4A, FLAC, AAC, WMA
- Audio trimming
- Video to audio extraction

### Document Conversions (15+)
- DOCX to PDF, HTML, TXT
- HTML to DOCX, PDF
- Markdown to PDF, HTML
- RTF, ODT, EPUB, MOBI conversions

### Data Conversions (20+)
- CSV ↔ JSON, XML, XLSX
- JSON ↔ XML, YAML, TOML, INI
- Base64 encode/decode
- URL encode/decode

### Archive Conversions (8+)
- ZIP creation and extraction
- GZIP compression/decompression
- TAR, 7Z support

### Utility Tools (10+)
- QR code generation
- Barcode generation
- Color extraction from images
- Image to ASCII art
- HTML to Markdown

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow the prompts to connect your GitHub repository**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Privacy & Security

- **No server processing** - All conversions happen in your browser
- **No file storage** - Files are never uploaded or stored
- **No tracking** - No analytics or user tracking
- **Open source** - Code is available for inspection

## Troubleshooting

If you encounter any issues:

1. **Check the browser console for errors**
2. **Ensure you're using a supported browser**
3. **Try refreshing the page**
4. **Check that all dependencies are installed correctly**
5. **Make sure Node.js version is 18 or higher**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you need help:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Ensure all dependencies are properly installed
4. Verify your Node.js version

---

**ConvertAnything** - Convert anything to anything, completely free and private! 🚀

## Quick Setup Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000` after running `npm run dev`.

