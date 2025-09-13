import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Star,
  StarOff,
  MapPin,
  Clock,
  Wheat,
  RefreshCw
} from "lucide-react";

import { translations } from "@/utils/translations";

interface MarketPricesProps {
  onBack: () => void;
  language: string;
}

const mandis = [
  { id: "rajkot", name: "Rajkot APMC", distance: "5 km" },
  { id: "ahmedabad", name: "Ahmedabad APMC", distance: "35 km" },
  { id: "gondal", name: "Gondal Market", distance: "12 km" },
  { id: "junagadh", name: "Junagadh APMC", distance: "28 km" },
];

const cropPrices = [
  {
    id: "cotton",
    name: "Cotton",
    icon: "🌱",
    prices: { min: 5800, max: 6200, modal: 6000 },
    trend: "up",
    change: 150,
    unit: "per quintal",
    starred: true,
    lastUpdated: "2 hours ago"
  },
  {
    id: "groundnut", 
    name: "Groundnut",
    icon: "🥜",
    prices: { min: 4500, max: 4800, modal: 4650 },
    trend: "down", 
    change: 80,
    unit: "per quintal",
    starred: true,
    lastUpdated: "1 hour ago"
  },
  {
    id: "wheat",
    name: "Wheat",
    icon: "🌾",
    prices: { min: 2200, max: 2350, modal: 2275 },
    trend: "up",
    change: 25,
    unit: "per quintal", 
    starred: false,
    lastUpdated: "3 hours ago"
  },
  {
    id: "sugarcane",
    name: "Sugarcane", 
    icon: "🎋",
    prices: { min: 280, max: 320, modal: 300 },
    trend: "stable",
    change: 0,
    unit: "per quintal",
    starred: false,
    lastUpdated: "4 hours ago"
  },
  {
    id: "soybean",
    name: "Soybean",
    icon: "🫘", 
    prices: { min: 3800, max: 4100, modal: 3950 },
    trend: "up",
    change: 120,
    unit: "per quintal",
    starred: false,
    lastUpdated: "2 hours ago"
  },
  {
    id: "sunflower",
    name: "Sunflower",
    icon: "🌻",
    prices: { min: 5200, max: 5600, modal: 5400 },
    trend: "down",
    change: 200,
    unit: "per quintal", 
    starred: false,
    lastUpdated: "5 hours ago"
  }
];

export function MarketPrices({ onBack, language }: MarketPricesProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const [selectedMandi, setSelectedMandi] = useState("rajkot");
  const [starredCrops, setStarredCrops] = useState(new Set(cropPrices.filter(c => c.starred).map(c => c.id)));

  const toggleStar = (cropId: string) => {
    setStarredCrops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cropId)) {
        newSet.delete(cropId);
      } else {
        newSet.add(cropId);
      }
      return newSet;
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.marketPricesTitle}</h1>
        </div>
        <p className="text-white/90">Latest mandi rates and price trends</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Mandi Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Select Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedMandi} onValueChange={setSelectedMandi}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mandis.map((mandi) => (
                  <SelectItem key={mandi.id} value={mandi.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{mandi.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{mandi.distance}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Starred Crops */}
        {Array.from(starredCrops).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Your Favorites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cropPrices
                .filter(crop => starredCrops.has(crop.id))
                .map((crop) => (
                  <div key={crop.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{crop.icon}</span>
                      <div>
                        <h3 className="font-semibold">{crop.name}</h3>
                        <p className="text-sm text-muted-foreground">{crop.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatPrice(crop.prices.modal)}</div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(crop.trend)}
                        <span className={`text-sm ${getTrendColor(crop.trend).split(' ')[0]}`}>
                          {crop.change > 0 ? `+${crop.change}` : crop.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* All Crops */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Wheat className="w-5 h-5 mr-2" />
                All Crops
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cropPrices.map((crop) => (
                <div key={crop.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{crop.icon}</span>
                      <div>
                        <h3 className="font-semibold">{crop.name}</h3>
                        <p className="text-sm text-muted-foreground">{crop.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatPrice(crop.prices.modal)}</div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(crop.trend)}
                          <span className={`text-sm ${getTrendColor(crop.trend).split(' ')[0]}`}>
                            {crop.trend === 'stable' ? 'Stable' : 
                             crop.change > 0 ? `+${formatPrice(crop.change)}` : 
                             formatPrice(crop.change)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(crop.id)}
                        className="p-2"
                      >
                        {starredCrops.has(crop.id) ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-red-600 font-medium">Min</div>
                      <div className="font-semibold">{formatPrice(crop.prices.min)}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-green-600 font-medium">Max</div>
                      <div className="font-semibold">{formatPrice(crop.prices.max)}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-blue-600 font-medium">Modal</div>
                      <div className="font-semibold">{formatPrice(crop.prices.modal)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Updated {crop.lastUpdated}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTrendColor(crop.trend)}`}
                    >
                      {crop.trend === 'up' ? 'Rising' : 
                       crop.trend === 'down' ? 'Falling' : 'Stable'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Alert Info */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Price Alerts</p>
                <p className="text-sm text-blue-700 mt-1">
                  Star your favorite crops to track them easily and get price notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}