import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-100">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const Analysis = () => {
  // State for image data and analysis results
  const [rgbImage, setRgbImage] = useState(null);
  const [trimImage, setTrimImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({
    chlorophyll: 78.5,
    nitrogen: 82.3,
    moisture: 65.8,
    health: 88.2,
    disease_probability: 12.5
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle incoming image data from Raspberry Pi
  const handleImageReceived = async (imageData) => {
    try {
      setIsProcessing(true);
      setError(null);

      // In future, replace this with actual image processing logic
      // Example structure for future implementation:
      /*
      const response = await fetch('your-raspberry-pi-endpoint/process-image', {
        method: 'POST',
        body: imageData
      });
      const result = await response.json();
      setRgbImage(result.rgbImage);
      setTrimImage(result.trimImage);
      setAnalysisResults(result.analysis);
      */

      // For now, using placeholder
      setRgbImage('/api/placeholder/400/400');
      setTrimImage('/api/placeholder/400/400');
      
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to start new analysis
  const startNewAnalysis = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // In future, replace with actual Raspberry Pi communication
      // Example structure:
      /*
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
      const photo = await imageCapture.takePhoto();
      await handleImageReceived(photo);
      */

      // Simulating processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await handleImageReceived(null);

    } catch (err) {
      setError('Failed to start analysis. Please check the connection and try again.');
      console.error('Analysis error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="border-t-2 border-white mx-4"></div>
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-light">Leaf Analysis Results</h1>
            <p className="text-gray-400 mt-2">Detailed analysis and health assessment</p>
            <button
              onClick={startNewAnalysis}
              disabled={isProcessing}
              className="mt-6 px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Start New Analysis'}
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Image Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* RGB Scan */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">RGB Scan</h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {isProcessing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                  ) : rgbImage ? (
                    <img 
                      src={rgbImage}
                      alt="RGB Scan" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trim Scan */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">Thermal Analysis</h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {isProcessing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                  ) : trimImage ? (
                    <img 
                      src={trimImage}
                      alt="Trim Scan" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Metrics */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">Key Metrics</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(analysisResults).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-black rounded-full h-2 transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">Health Trend</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
                      <div key={week} className="text-center p-4 border border-gray-100 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">{week}</div>
                        <div className="text-xl font-light">
                          {[85, 88, 82, 88.2][index]}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-600 mt-4">
                    Average Health Score: 85.8%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Assessment */}
          <Card className="mb-12">
            <CardHeader>
              <h3 className="text-xl font-light">Assessment Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border border-gray-100 rounded-lg">
                  <h4 className="text-lg font-light mb-2">Overall Health</h4>
                  <div className="text-3xl font-light text-green-600">Excellent</div>
                  <p className="text-gray-600 mt-2">
                    Leaf shows optimal health indicators with strong chlorophyll levels.
                  </p>
                </div>
                <div className="p-6 border border-gray-100 rounded-lg">
                  <h4 className="text-lg font-light mb-2">Recommendations</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Maintain current irrigation schedule</li>
                    <li>• Continue regular nutrient applications</li>
                    <li>• Monitor for early signs of stress</li>
                  </ul>
                </div>
                <div className="p-6 border border-gray-100 rounded-lg">
                  <h4 className="text-lg font-light mb-2">Next Analysis</h4>
                  <div className="text-xl font-light">7 Days</div>
                  <p className="text-gray-600 mt-2">
                    Schedule next analysis to track progress and maintain health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Analysis;