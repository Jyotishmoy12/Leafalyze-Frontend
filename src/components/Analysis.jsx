import React, { useState } from 'react';
import Navbar from './Navbar';

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

//comments

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
  // Helper functions for color calculations
  const getHealthColor = (value) => {
    if (value >= 80) return '#22c55e'; // green-500
    if (value >= 60) return '#84cc16'; // lime-500
    if (value >= 40) return '#eab308'; // yellow-500
    if (value >= 20) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };
  
  const getDiseaseColor = (value) => {
    if (value >= 80) return '#ef4444'; // red-500
    if (value >= 60) return '#f97316'; // orange-500
    if (value >= 40) return '#eab308'; // yellow-500
    if (value >= 20) return '#84cc16'; // lime-500
    return '#22c55e'; // green-500
  };
  const [rgbImage, setRgbImage] = useState(null);
  const [trimImage, setTrimImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({
    chlorophyll: null,
    nitrogen: null,
    moisture: null,
    health: null,
    disease_probability: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [roboflowResult, setRoboflowResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown');

  // Check server health on component mount
  React.useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/health");
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('error');
      }
    } catch (err) {
      console.error("Server health check failed:", err);
      setServerStatus('offline');
    }
  };

  const processAnalysisResults = (data) => {
    // Extract meaningful analysis metrics from Roboflow prediction data
    try {
      if (!data || !data.predictions || data.predictions.length === 0) {
        console.log("No predictions found in data");
        return;
      }
      
      // Initialize results object
      const results = {
        chlorophyll: null,
        nitrogen: null,
        moisture: null,
        health: null,
        disease_probability: null
      };
      
      // Process predictions to extract metrics
      const predictions = data.predictions;
      
      // Calculate disease probability based on classes found
      const diseaseClasses = predictions.filter(p => 
        p.class.toLowerCase().includes('disease') || 
        p.class.toLowerCase().includes('blight') || 
        p.class.toLowerCase().includes('spot')
      );
      
      if (diseaseClasses.length > 0) {
        // Average confidence of disease predictions
        results.disease_probability = diseaseClasses.reduce((sum, p) => sum + p.confidence, 0) / diseaseClasses.length * 100;
      } else {
        results.disease_probability = 5; // Low baseline if no disease detected
      }
      
      // Calculate overall health score (inverse of disease probability with some baseline)
      results.health = Math.max(0, Math.min(100, 100 - results.disease_probability - Math.random() * 10));
      
      // Mock other values based on class and confidence
      // In a real app, these would come from actual analysis of leaf color, etc.
      if (predictions.some(p => p.class.toLowerCase().includes('leaf'))) {
        const leafPrediction = predictions.find(p => p.class.toLowerCase().includes('leaf'));
        const confidence = leafPrediction ? leafPrediction.confidence : 0.5;
        
        // Generate somewhat realistic values based on confidence and random variation
        results.chlorophyll = Math.min(100, Math.max(0, 70 + (confidence * 20) + (Math.random() * 10 - 5)));
        results.nitrogen = Math.min(100, Math.max(0, 65 + (confidence * 25) + (Math.random() * 10 - 5)));
        results.moisture = Math.min(100, Math.max(0, 60 + (confidence * 20) + (Math.random() * 15 - 7.5)));
      }
      
      console.log("Processed analysis results:", results);
      setAnalysisResults(results);
    } catch (err) {
      console.error("Error processing analysis results:", err);
    }
  };

  const startNewAnalysis = async () => {
    try {
      // Reset all states
      setRgbImage(null);
      setTrimImage(null);
      setImageFile(null);
      setImagePreview(null);
      setRoboflowResult(null);
      setError(null);
      setAnalysisResults({
        chlorophyll: null,
        nitrogen: null,
        moisture: null,
        health: null,
        disease_probability: null
      });
      
      // Clear file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Failed to reset analysis. Please refresh the page.');
      console.error('Reset error:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for form submission
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToRoboflow = async () => {
    if (!imageFile) {
      setError("Please select an image file first");
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      setRoboflowResult(null);
      
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setRoboflowResult(data);
      
      // Set the original image
      if (imagePreview) {
        setRgbImage(imagePreview);
      }
      
      // Generate thermal/analysis visualization
      generateAnalysisVisualization(data);
      
      // Process the data to extract meaningful metrics
      processAnalysisResults(data);
      
      console.log("Roboflow result:", data);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Failed to analyze image: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate a visualization based on the detection results
  const generateAnalysisVisualization = (data) => {
    if (!imagePreview || !data || !data.predictions) {
      return;
    }
    
    try {
      // Create a canvas element to draw the visualization
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply a thermal filter effect
        applyThermalEffect(ctx, canvas.width, canvas.height);
        
        // Draw bounding boxes for predictions
        if (data.predictions && data.predictions.length > 0) {
          data.predictions.forEach(pred => {
            // Draw bounding box
            const x = pred.x - pred.width/2;
            const y = pred.y - pred.height/2;
            const w = pred.width;
            const h = pred.height;
            
            ctx.strokeStyle = getClassColor(pred.class);
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);
            
            // Draw label
            ctx.fillStyle = getClassColor(pred.class);
            ctx.font = '16px Arial';
            const confidence = Math.round(pred.confidence * 100);
            const text = `${pred.class} (${confidence}%)`;
            const textWidth = ctx.measureText(text).width;
            
            ctx.fillRect(x, y - 25, textWidth + 10, 25);
            ctx.fillStyle = '#fff';
            ctx.fillText(text, x + 5, y - 7);
          });
        }
        
        // Convert canvas to data URL and set as visualization image
        setTrimImage(canvas.toDataURL('image/png'));
      };
      
      img.src = imagePreview;
    } catch (err) {
      console.error("Error generating visualization:", err);
    }
  };
  
  // Apply a thermal-like effect to show "hot spots" in the image
  const applyThermalEffect = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate grayscale value
      const gray = 0.3 * r + 0.59 * g + 0.11 * b;
      
      // Apply thermal color mapping
      if (gray < 50) {
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 128; // B
      } else if (gray < 100) {
        data[i] = 0;       // R
        data[i + 1] = gray; // G
        data[i + 2] = 255; // B
      } else if (gray < 150) {
        data[i] = 0;       // R
        data[i + 1] = 255; // G
        data[i + 2] = 255 - gray; // B
      } else if (gray < 200) {
        data[i] = gray;    // R
        data[i + 1] = 255; // G
        data[i + 2] = 0;   // B
      } else {
        data[i] = 255;     // R
        data[i + 1] = 255 - (gray - 200) * 2; // G
        data[i + 2] = 0;   // B
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  // Get color for a specific class
  const getClassColor = (className) => {
    const classColors = {
      'leaf': '#00FF00',
      'disease': '#FF0000',
      'healthy': '#00AA00',
      'blight': '#FF5500',
      'spot': '#FFAA00',
      'default': '#0088FF'
    };
    
    // Find the matching class (case insensitive)
    const lowerClassName = className.toLowerCase();
    for (const [key, value] of Object.entries(classColors)) {
      if (lowerClassName.includes(key)) {
        return value;
      }
    }
    
    return classColors.default;
  };

  return (
    <>
      <Navbar />
      <div className="border-t-2 border-white mx-4"></div>
      <main className="min-h-screen bg-gray-50">
        <div className="bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-light">Leaf Analysis Results</h1>
            <p className="text-gray-400 mt-2">Detailed analysis and health assessment</p>
            
            {serverStatus === 'offline' && (
              <div className="mt-4 bg-red-900 p-4 rounded">
                <p className="font-medium">Server appears to be offline</p>
                <p className="text-sm mt-1">Make sure your backend server is running at http://localhost:5000</p>
              </div>
            )}
            
            <button
              onClick={startNewAnalysis}
              className="mt-6 px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Reset Analysis
            </button>

            <div className="mt-6">
              <input 
                id="file-input"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="bg-gray-800 text-white p-2 rounded"
              />
              <button
                onClick={sendToRoboflow}
                disabled={!imageFile || isProcessing || serverStatus === 'offline'}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">Original Image</h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {isProcessing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                  ) : imagePreview ? (
                    <img src={imagePreview} alt="Original Image" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image uploaded
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-light">Analysis Visualization</h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {isProcessing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                  ) : trimImage ? (
                    <img src={trimImage} alt="Analysis Visualization" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No analysis available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {roboflowResult && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <h3 className="text-xl font-light">Detection Results</h3>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {roboflowResult.predictions && roboflowResult.predictions.length > 0 ? (
                      <>
                        <p className="font-medium mb-2">Detected {roboflowResult.predictions.length} object(s):</p>
                        <ul className="list-disc pl-6">
                          {roboflowResult.predictions.map((pred, index) => (
                            <li key={index} className="mb-1">
                              {pred.class} (Confidence: {Math.round(pred.confidence * 100)}%)
                            </li>
                          ))}  
                        </ul>
                      </>
                    ) : (
                      <p>No objects detected in the image.</p>
                    )}
                  </div>
                  
                  <details>
                    <summary className="cursor-pointer font-medium text-blue-600 mb-2">View Raw JSON Result</summary>
                    <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                      {JSON.stringify(roboflowResult, null, 2)}
                    </pre>
                  </details>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-xl font-light">Leaf Analysis Metrics</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Health Score */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="text-lg font-light mb-1">Overall Health</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                          <div 
                            className="h-4 rounded-full" 
                            style={{
                              width: `${analysisResults.health || 0}%`,
                              backgroundColor: getHealthColor(analysisResults.health || 0)
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">{analysisResults.health ? analysisResults.health.toFixed(1) : '?'}%</span>
                      </div>
                    </div>

                    {/* Disease Probability */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="text-lg font-light mb-1">Disease Probability</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                          <div 
                            className="h-4 rounded-full" 
                            style={{
                              width: `${analysisResults.disease_probability || 0}%`,
                              backgroundColor: getDiseaseColor(analysisResults.disease_probability || 0)
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">{analysisResults.disease_probability ? analysisResults.disease_probability.toFixed(1) : '?'}%</span>
                      </div>
                    </div>

                    {/* Chlorophyll Content */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="text-lg font-light mb-1">Chlorophyll Content</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                          <div 
                            className="h-4 rounded-full bg-green-500" 
                            style={{
                              width: `${analysisResults.chlorophyll || 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">{analysisResults.chlorophyll ? analysisResults.chlorophyll.toFixed(1) : '?'}%</span>
                      </div>
                    </div>

                    {/* Nitrogen Level */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="text-lg font-light mb-1">Nitrogen Level</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                          <div 
                            className="h-4 rounded-full bg-blue-500" 
                            style={{
                              width: `${analysisResults.nitrogen || 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">{analysisResults.nitrogen ? analysisResults.nitrogen.toFixed(1) : '?'}%</span>
                      </div>
                    </div>

                    {/* Moisture Content */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="text-lg font-light mb-1">Moisture Content</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                          <div 
                            className="h-4 rounded-full bg-blue-400" 
                            style={{
                              width: `${analysisResults.moisture || 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">{analysisResults.moisture ? analysisResults.moisture.toFixed(1) : '?'}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Analysis;