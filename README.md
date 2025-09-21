# JSON-Schema Form Builder

A powerful drag-and-drop form builder that generates TypeScript/React components and JSON Schema definitions in real-time.

## 🚀 Features

- **Drag & Drop Interface**: Intuitive field palette with visual form building
- **Live Preview**: Real-time form preview with actual validation
- **TypeScript Code Generation**: Generates fully-typed React components
- **JSON Schema Export**: Standards-compliant JSON Schema output
- **Field Validation**: Support for all common validation rules
- **Multi-Field Support**: 17+ field types including text, number, select, date, file upload
- **Professional UI**: Clean Material UI design with responsive layout

## 🎯 Use Cases

- **Dynamic Forms**: Generate forms for business applications
- **API Documentation**: Create schemas for OpenAPI/Swagger docs
- **Form Prototyping**: Quickly mock up and test form designs
- **Code Generation**: Accelerate development with auto-generated components
- **Schema Validation**: Server-side validation with JSON Schema

## 🛠️ Tech Stack

- **React 18** + **TypeScript** - Modern React with full type safety
- **Vite** - Fast build tooling and development server
- **Material UI** - Professional component library and theming
- **react-dnd** - Drag and drop functionality
- **react-hook-form** - Form state management and validation
- **AJV** - JSON Schema validation library

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.19.0+ (or 22.12.0+)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd json-schema-form-builder
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📖 How to Use

### 1. Build Your Form
- Drag field types from the left palette to the form builder
- Reorder fields by dragging within the form
- Click fields to select and configure them

### 2. Configure Fields
- Set labels, placeholders, and descriptions
- Add validation rules (required, min/max length, patterns)
- Configure options for select fields
- Set field types and formats

### 3. Preview in Real-Time
- See your form render instantly with actual validation
- Test form behavior and user experience
- Debug form values in the preview panel

### 4. Export Code & Schema
- **React Component**: Copy or download fully-typed TypeScript component
- **JSON Schema**: Export standards-compliant schema for validation
- **Both formats**: Download complete package for immediate use

## 🏗️ Project Structure

```
src/
├── components/
│   ├── FieldPalette/     # Draggable field types
│   ├── FormBuilder/      # Canvas and configuration
│   ├── FormPreview/      # Live form preview
│   └── CodeExport/       # Code generation and export
├── hooks/
│   └── useFormBuilder.ts # Form state management
├── types/
│   └── index.ts          # TypeScript definitions
├── utils/
│   └── codeGeneration.ts # Code and schema generation
└── App.tsx               # Main application