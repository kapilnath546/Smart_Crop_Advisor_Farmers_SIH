import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  Volume2, 
  Save, 
  Share2, 
  Search,
  Bug,
  AlertTriangle,
  CheckCircle,
  Leaf
} from "lucide-react";

import { translations } from "@/utils/translations";

interface PestScanProps {
  onBack: () => void;
  language: string;
}

const mockResults = {
  diseaseDetected: "Brown Spot Disease",
  confidence: 78,
  severity: "Medium",
  affectedArea: "45%",
  crop: "Rice",
  treatments: [
    { 
      type: "Organic", 
      name: "Neem Oil Spray", 
      dosage: "5ml per liter water", 
      frequency: "Every 7 days",
      effectiveness: 85 
    },
    { 
      type: "Chemical", 
      name: "Propiconazole", 
      dosage: "1ml per liter water", 
      frequency: "Every 10 days",
      effectiveness: 95 
    },
    { 
      type: "Preventive", 
      name: "Copper Fungicide", 
      dosage: "2gm per liter water", 
      frequency: "Monthly",
      effectiveness: 70 
    }
  ],
  prevention: [
    "Maintain proper field drainage",
    "Avoid excessive nitrogen fertilization", 
    "Remove infected plant debris",
    "Ensure proper plant spacing"
  ]
};

export function PestScan({ onBack, language }: PestScanProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = () => {
    setUploadedImage("/placeholder.svg");
    setScanning(true);
    
    setTimeout(() => {
      setScanning(false);
      setResults(mockResults);
    }, 3500);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (scanning) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Analyzing Crop Image</h2>
            <p className="text-muted-foreground mb-6">Detecting diseases and pests...</p>
            <Progress value={60} className="mb-4" />
            <p className="text-sm text-muted-foreground">Processing: 60%</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-primary text-white p-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Pest Analysis Results</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Disease Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Disease Detected</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {results.confidence}% Match
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <Bug className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{results.diseaseDetected}</h3>
                  <p className="text-muted-foreground">on {results.crop}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Severity</div>
                  <Badge className={`text-xs mt-1 ${getSeverityColor(results.severity)}`}>
                    {results.severity}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Affected Area</div>
                  <div className="text-lg font-bold text-primary">{results.affectedArea}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Options */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.treatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={
                      treatment.type === 'Organic' ? 'bg-green-100 text-green-700' :
                      treatment.type === 'Chemical' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }>
                      {treatment.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {treatment.effectiveness}% Effective
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{treatment.name}</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Dosage:</span> {treatment.dosage}</p>
                    <p><span className="font-medium">Frequency:</span> {treatment.frequency}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prevention Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-primary" />
                Prevention Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.prevention.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Important Note</p>
                <p className="text-sm text-muted-foreground">
                  Always test treatments on a small area first. Consult local agricultural experts for severe infestations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleSpeak(`${results.diseaseDetected} detected with ${results.severity} severity`)}
              variant="outline" 
              className="flex-1"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Listen
            </Button>
            <Button variant="outline" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.pestScan}</h1>
        </div>
        <p className="text-white/90">{t.pestScanDesc}</p>
      </div>

      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-secondary rounded-full flex items-center justify-center">
              <Bug className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Crop Image</h2>
            <p className="text-muted-foreground mb-6">
              Take a clear photo of affected leaves or crops for disease detection
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleImageUpload}
                className="w-full bg-gradient-primary hover:bg-primary-hover transition-smooth"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
              <Button 
                onClick={handleImageUpload}
                variant="outline" 
                className="w-full" 
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose from Gallery
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photography Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Focus on affected areas (spots, discoloration, holes)</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Take photos in natural daylight for accurate colors</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Include healthy parts for comparison</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Keep the camera steady and focus sharp</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}