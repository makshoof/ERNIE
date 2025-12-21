# ERNIE Inspection Assistant

An AI-powered multimodal inspection assistant that analyzes images of machines, objects, or workspaces using ERNIE through the Novita API.

## Features

- 🖼️ **Image Upload**: Drag and drop or click to upload images
- 💬 **Interactive Q&A**: Ask questions about uploaded images
- 🤖 **AI Analysis**: Powered by ERNIE 4.5 Vision model
- ✨ **Beautiful UI**: Modern, animated interface with smooth transitions
- 🔍 **Safety Insights**: Identifies issues, risks, and provides actionable suggestions

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Make sure your `.env` file contains:
   ```
   NOVITA_API_KEY=your_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Upload an image of a machine, object, or workspace
2. Enter your question in the text box
3. Click "Analyze Image" to get AI-powered insights
4. Review the analysis for issues, risks, and suggestions

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Novita API** - ERNIE multimodal AI

## Build for Production

```bash
npm run build
npm start
```

