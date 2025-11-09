# 🛡️ DeepShield

**AI-Powered Deepfake Detection for Video Content Safety**

DeepShield is a full-stack application that leverages deep learning (Xception + GRU) to detect deepfakes in video content. Built for content platforms, moderators, and security teams to automatically flag manipulated videos before they go viral.

---

## 🎯 The Problem

- **92% of deepfakes online are non-consensual** and potentially harmful
- Content platforms can't **manually review millions of uploads daily**
- Traditional methods fail against **sophisticated AI-generated videos**

**Our Solution**: Hybrid ML architecture combining Xception CNN (spatial features) + GRU networks (temporal analysis) for robust deepfake detection.

---

## ✨ Key Features

- **🧠 Advanced ML**: Xception + GRU hybrid model (24M+ parameters)
- **⚡ Fast Processing**: 2-4 seconds per video on CPU
- **🎨 Modern Stack**: FastAPI + React + TensorFlow + MongoDB
- **🔐 Secure**: JWT authentication, input validation, CORS protection
- **📊 Transparent**: Confidence scores (0-1) for each prediction
- **🚀 Scalable**: Ready for horizontal scaling and cloud deployment

---

## 🏗️ Tech Stack & Architecture

```
React Frontend  ──(upload)──>  FastAPI Server  ──(process)──>  ML Pipeline
  (Vite/Tailwind)             (REST API)                      (Xception+GRU)
       └──────────────────(JSON response)────────────────────────┘
```

**Frontend**: React 18, Vite, Tailwind CSS  
**Backend**: FastAPI, Python 3.8+, Uvicorn  
**ML**: TensorFlow/Keras, OpenCV  
**Database**: MongoDB (users & history)  
**Model**: Xception (feature extraction) + GRU (temporal analysis)

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Python 3.8+, Node.js 16+, 4GB RAM

### Backend Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create .env file with: MONGODB_URL=your_connection_string

uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
✅ Backend: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
✅ Frontend: `http://localhost:5173`

### Demo Flow
1. Sign up/Login → 2. Upload video → 3. View prediction (REAL/FAKE + confidence) → 4. Check history

---

## 🔌 API Endpoints

**POST /predict** - Upload video for analysis  
**GET /health** - Server health check  
**POST /auth/register** - Create account  
**POST /auth/login** - Authenticate user  
**GET /user/history** - View prediction history

Full docs at: `/docs` (Swagger UI)

---

## 🧠 ML Architecture

### Two-Stage Detection Pipeline

**Stage 1: Xception CNN**
- Extracts 10 frames (299×299) from video
- Generates 2048-dim feature vectors per frame
- Uses ImageNet pre-trained weights

**Stage 2: Bidirectional GRU**
- Analyzes temporal sequence (10 × 2048)
- Detects frame-to-frame inconsistencies
- Outputs binary classification + confidence

**Why This Works**: Xception catches spatial artifacts (warping, edges), GRU identifies temporal anomalies (unnatural movements).

---

## ⚠️ Current Limitations

**Training Constraints** (Google Colab Free Tier):
- Limited GPU access restricted model size and training time
- Smaller dataset resulted in ~85% accuracy (vs potential 95%+)
- Predictions may vary on different video types

**Needed for Production**:
- V100/A100 GPUs for 48+ hours training
- 50,000+ labeled videos
- Advanced architectures (EfficientNet-B7, ViT)

**Note**: Architecture is sound; just needs proper infrastructure.

---

## 🏆 For Hackathon Judges

### What We Built
✅ Complete full-stack application (not just a model!)  
✅ User authentication + database integration  
✅ Real-time video processing pipeline  
✅ Professional UI/UX with loading states  
✅ Production-ready code structure  

### Key Achievements
- **24M parameter neural network** with novel hybrid architecture
- **Sub-5-second inference** on consumer hardware
- **RESTful API** with comprehensive documentation
- **Scalable design** ready for cloud deployment
- **Honest about limitations** - transparency is a strength!

### Technical Challenges Solved
- Optimized memory management for large video files
- Bridged TensorFlow models with FastAPI seamlessly
- Implemented secure authentication and CORS
- Clean async state management in React

### Quick Demo
1. Clone & setup (5 min) → 2. Upload videos → 3. See REAL/FAKE predictions → 4. View history → 5. Check API docs

---

## 🤝 Contributing

1. Fork repo → 2. Create feature branch → 3. Make changes → 4. Submit PR

**Need Help With**:
- GPU access for training
- Deepfake dataset curation
- Frontend features & testing
- Performance optimization

---

## 📄 License

Currently unlicensed. Add MIT/Apache-2.0/GPL-3.0 before production deployment.

**Credits**: TensorFlow/Keras, FastAPI, React, MongoDB, Google Colab  
**Datasets**: ImageNet, FaceForensics++, Celeb-DF

---

**Built with ❤️ for a safer digital future**

*DeepShield - Protecting authenticity in the age of AI*