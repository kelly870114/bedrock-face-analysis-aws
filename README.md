> <div style="color: #007EB9;">
> 
> ## README created by Amazon Q Developer
> </div>
> For more Amazon Q Developer's new feature: https://aws.amazon.com/blogs/aws/new-amazon-q-developer-agent-capabilities-include-generating-documentation-code-reviews-and-unit-tests/
&nbsp;
# Physiognomy & Fortune Telling Web Application

A comprehensive web application powered by Amazon Bedrock AI for facial analysis and fortune telling, featuring multi-language support and interactive modes.

This React-based frontend provides face analysis and fortune telling capabilities. Users can access the application via desktop (event code entry) or mobile (camera capture and analysis).

## Features

- **Face Analysis**: AI-powered facial feature analysis with personalized interpretations
- **Fortune Telling**: Traditional fortune telling combined with modern AI technology
- **Multi-language Support**: Chinese and English interfaces
- **Cross-platform**: Optimized for both desktop and mobile experiences
- **Result Export**: Screenshot capture and QR code sharing capabilities

## Repository Structure

```
.
├── package.json
├── public/
│   ├── jenn-ai/           # AI avatar images
│   ├── *.png              # App icons and backgrounds
│   └── index.html
├── README.md
└── src/
    ├── App.jsx
    ├── components/
    │   ├── common/         # Shared components
    │   │   ├── Camera/
    │   │   ├── DesktopView/
    │   │   └── LanguageSwitcher.jsx
    │   ├── face/           # Face analysis components
    │   │   ├── AnalysisResult.jsx
    │   │   ├── MobileView.jsx
    │   │   └── styles-*.js
    │   └── fortune/        # Fortune telling components
    │       ├── FortuneMobileView.jsx
    │       ├── FortuneInterpret.jsx
    │       └── styles-*.js
    ├── config/
    │   └── index.js
    ├── i18n/               # Internationalization
    │   ├── translations/
    │   └── config.js
    └── index.js
```

### Key Components:

- `src/App.jsx`: Main application with multi-language routing
- `src/components/face/MobileView.jsx`: Mobile face analysis interface with camera functionality
- `src/components/face/AnalysisResult.jsx`: Analysis results display with download capabilities
- `src/components/fortune/FortuneMobileView.jsx`: Fortune telling mobile interface
- `src/components/common/DesktopView/DesktopView.jsx`: Desktop entry point with QR code generation
- `src/i18n/`: Multi-language support system
- `src/config/index.js`: API endpoint configuration

## Usage Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- Modern browser with Camera API support

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Configuration

Set the `REACT_APP_API_ENDPOINT` environment variable to your API Gateway endpoint:

```bash
export REACT_APP_API_ENDPOINT=your-api-endpoint
```

If not set, it defaults to the configured endpoint in `src/config/index.js`.

### Running the Application

1. Start the development server:
   ```
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:3000`.

### Usage

#### Desktop View:
1. Select language (Chinese/English)
2. Enter event code or choose function mode
3. Scan QR code to access mobile interface

#### Mobile Modes:

**Face Analysis Mode:**
1. Grant camera permissions
2. Capture clear facial photo
3. Wait for AI analysis results
4. View detailed face interpretation
5. Download results or retake photo

**Fortune Telling Mode:**
1. Select fortune telling type
2. Follow interactive instructions
3. Receive personalized reading

#### Multi-language Support:
- `/zh/` - Chinese interface
- `/en/` - English interface

### Testing

Run the test suite with:
```
npm test
```

## Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "styled-components": "^6.1.13",
  "html2canvas": "^1.4.1",
  "lucide-react": "^0.292.0",
  "qrcode.react": "^4.1.0"
}
```

### Troubleshooting

**Camera Access Issues:**
- Check browser permissions
- Ensure HTTPS connection
- Refresh page to re-authorize

**API Connection Errors:**
- Verify network connectivity
- Check API endpoint configuration
- Review browser developer tools

**Image Upload Failures:**
- Confirm image size limits
- Check network stability
- Retry upload operation

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/analyze` | POST | Face analysis |
| `/checkEvent` | GET | Event code validation |
| `/uploadImage` | POST/GET | Image upload/download |
| `/fortune` | POST | Fortune telling |

## Data Flow

```
[Desktop Entry] → [QR Code] → [Mobile Interface] → [Camera/Input]
                                      ↓
[API Gateway] → [Lambda Functions] → [Amazon Bedrock]
                                      ↓
[Results Display] ← [Response Processing] ← [AI Analysis]
```

## Deployment

The application is deployed on AWS Amplify with:
- Automatic CI/CD pipeline
- Multi-environment support
- Custom domain configuration
- SSL certificate management

## Security Features

- Pre-signed URLs for image uploads
- HTTPS encryption
- Secure camera permission handling
- No sensitive data stored in frontend

## Performance Optimizations

- Image compression
- Lazy loading components
- Caching strategies
- Bundle size optimization

---

*Developed with Amazon Q Developer assistance*