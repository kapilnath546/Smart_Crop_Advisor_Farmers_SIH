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
  CheckCircle,
  TestTube
} from "lucide-react";

import { translations } from "@/utils/translations";

interface SoilScanProps {
  onBack: () => void;
  language: string;
}

const soilTypes = [
  { name: "Black Soil", confidence: 85, suitable: ["Cotton", "Sugarcane", "Sunflower"] },
  { name: "Red Soil", confidence: 72, suitable: ["Groundnut", "Millets", "Cotton"] },
  { name: "Loamy Soil", confidence: 68, suitable: ["Wheat", "Rice", "Vegetables"] },
];

const mockResults = {
  soilType: "Black Soil",
  confidence: 85,
  ph: 7.2,
  nutrients: {
    nitrogen: "Medium",
    phosphorus: "High",
    potassium: "Low"
  },
  recommendedCrops: [
    { name: "Cotton", suitability: 95, season: "Kharif", icon: "🌱" },
    { name: "Sugarcane", suitability: 88, season: "Year-round", icon: "🎋" },
    { name: "Sunflower", suitability: 82, season: "Rabi", icon: "🌻" },
    { name: "Soybean", suitability: 76, season: "Kharif", icon: "🫘" }
  ],
  fertilizers: [
    { name: "Urea", quantity: "120 kg/acre", timing: "Before sowing" },
    { name: "DAP", quantity: "80 kg/acre", timing: "At sowing" },
    { name: "Potash", quantity: "60 kg/acre", timing: "After 30 days" }
  ]
};

export function SoilScan({ onBack, language }: SoilScanProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = () => {
    // Simulate image upload
    setUploadedImage("/placeholder.svg");
    setScanning(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setScanning(false);
      setResults(mockResults);
    }, 3000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
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
            <h2 className="text-xl font-semibold mb-2">{language === 'en' ? 'Analyzing Soil Sample' : language === 'hi' ? 'मिट्टी के नमूने का विश्लेषण' : language === 'ta' ? 'மண் மாதிரி ஆய்வு' : language === 'te' ? 'మట్టి నమూనా విశ్లేషణ' : 'ਮਿੱਟੀ ਨਮੂਨਾ ਵਿਸ਼ਲੇਸ਼ਣ'}</h2>
            <p className="text-muted-foreground mb-6">{language === 'en' ? 'Our AI is examining your soil composition...' : language === 'hi' ? 'हमारा AI आपकी मिट्टी की संरचना की जांच कर रहा है...' : language === 'ta' ? 'எங்கள் AI உங்கள் மண் அமைப்பை ஆய்வு செய்கிறது...' : language === 'te' ? 'మా AI మీ మట్టి కూర్పును పరిశీలిస్తోంది...' : 'ਸਾਡਾ AI ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਰਚਨਾ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...'}</p>
            <Progress value={75} className="mb-4" />
            <p className="text-sm text-muted-foreground">Processing: 75%</p>
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
            <h1 className="text-xl font-semibold">{t.soilAnalysis}</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Soil Type Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detected Soil Type</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {results.confidence}% Confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{results.soilType}</h3>
                  <p className="text-muted-foreground">pH: {results.ph}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Nitrogen</div>
                  <div className="text-xs text-muted-foreground">{results.nutrients.nitrogen}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Phosphorus</div>
                  <div className="text-xs text-muted-foreground">{results.nutrients.phosphorus}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Potassium</div>
                  <div className="text-xs text-muted-foreground">{results.nutrients.potassium}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Crops */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Crops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.recommendedCrops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{crop.icon}</span>
                    <div>
                      <div className="font-medium">{crop.name}</div>
                      <div className="text-sm text-muted-foreground">{crop.season} Season</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {crop.suitability}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fertilizer Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Fertilizer Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.fertilizers.map((fertilizer, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{fertilizer.name}</div>
                    <div className="text-sm text-muted-foreground">{fertilizer.quantity}</div>
                  </div>
                  <Badge variant="outline">{fertilizer.timing}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleSpeak(`Soil type detected: ${results.soilType} with ${results.confidence}% confidence`)}
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
          <h1 className="text-xl font-semibold">{t.soilAnalysis}</h1>
        </div>
        <p className="text-white/90">{t.soilAnalysisDesc}</p>
      </div>

      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-secondary rounded-full flex items-center justify-center">
              <TestTube className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Soil Sample</h2>
            <p className="text-muted-foreground mb-6">
              Take a clear photo of your soil sample for accurate analysis
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
            <CardTitle className="text-lg">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Take photos in good lighting conditions</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Clean the soil surface of debris and stones</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">Capture from 6-8 inches above the surface</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}