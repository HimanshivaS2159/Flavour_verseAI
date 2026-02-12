# FlavoursVerse - Culinary Intelligence Platform

A modern web application for ingredient substitution and flavor analysis powered by machine learning.

## Features

- **Ingredient Substitution**: Find perfect substitutes for any ingredient using ML-powered recommendations
- **Flavor Analysis**: Discover detailed flavor profiles and chemical compounds
- **Modern UI**: Beautiful React interface with animations and responsive design
- **Offline Support**: Works completely offline with local databases

## Project Structure

```
FlovoursVerse/
├── backend/                 # FastAPI Python backend
│   ├── app/                # Main application
│   ├── api/                # API routes
│   ├── services/           # Business logic
│   ├── ml/                 # Machine learning models
│   └── run.py              # Entry point
├── frontend/               # React TypeScript frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
└── README.md               # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
pip install fastapi uvicorn python-dotenv requests joblib scikit-learn pandas numpy==1.25.2 scipy==1.11.4
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Available Features

### Ingredient Substitution
Try these ingredients:
- `milk`, `butter`, `cheese`, `eggs`, `flour`, `sugar`, `dairy`

### Flavor Analysis
Try these ingredients:
- `vanilla`, `chocolate`, `garlic`, `lemon`, `cinnamon`, `coffee`, `basil`, `ginger`, `honey`, `mint`

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation
- **Pickle**: Model serialization

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Framer Motion**: Animations
- **Axios**: HTTP client

## API Endpoints

- `GET /substitute?ingredient=<name>` - Get ingredient substitutions
- `GET /flavor?ingredient=<name>` - Get flavor analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!
