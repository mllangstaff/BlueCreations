# BlueCreations - AI Hyper-Personalization Agent

## Project Overview

Hackathon project creating an AI agent for hyper-personalized ad text generation. The agent learns user preferences through iterative dialog selection and adapts its suggestions accordingly.

## Core Functionality

- **Product & Brand Ingestion**: Upload and process product/branding materials
- **Iterative Learning**: Present 3 dialog units per round, learn from user selections
- **3-Round Process**: Complete 3 rounds of suggestions to build user preference profile
- **Real-time Suggestions**: Dynamic ad text generation based on learned preferences
- **Hyper-Personalization**: Tailored content creation using user feedback patterns

## Tech Stack

- **Framework**: React with Vite
- **Styling**: TailwindCSS
- **Components**: ShadCN UI Component Library
- **Icons**: Lucide React Icon Library
- **Design Assets**: Figma Dev Mode MCP for design handoff
- **Focus**: Frontend implementation with real-time agent interaction

## Key Features

1. Product upload interface
2. Interactive dialog selection UI
3. Real-time suggestion engine
4. User preference learning system
5. Personalized ad text generation

# MCP Servers

## Figma Dev Mode MCP Rules

- The Figma Dev Mode MCP Server provides an assets endpoint which can serve image and SVG assets
- IMPORTANT: If the Figma Dev Mode MCP Server returns a localhost source for an image or an SVG, use that image or SVG source directly
- IMPORTANT: do NOT use or create placeholders if a localhost source is provided

## Component Development Rules

- **Always use ShadCN UI components** as the foundation for all UI elements
- **Ask before building custom components** - request approval before creating anything not available in ShadCN
- **Prefer composition over customization** - combine existing ShadCN components rather than building from scratch
- **Use Lucide React icons** for all iconography needs

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run linting
npm run typecheck  # Run TypeScript checks
```
