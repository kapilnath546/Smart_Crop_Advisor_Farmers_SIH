import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets,
  Thermometer,
  Eye,
  AlertTriangle,
  Calendar
} from "lucide-react";

import { translations } from "@/utils/translations";

interface WeatherProps {
  onBack: () => void;
  language: string;
}

const currentWeather = {
  location: "Rajkot, Gujarat",
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  visibility: 8,
  uvIndex: 6,
  rainChance: 20
};

const forecast = [
  { day: "Today", date: "Mar 15", icon: Sun, temp: { max: 32, min: 22 }, rain: 10, condition: "Sunny" },
  { day: "Tomorrow", date: "Mar 16", icon: CloudRain, temp: { max: 29, min: 20 }, rain: 85, condition: "Heavy Rain" },
  { day: "Wednesday", date: "Mar 17", icon: CloudRain, temp: { max: 26, min: 18 }, rain: 70, condition: "Rain" },
  { day: "Thursday", date: "Mar 18", icon: Cloud, temp: { max: 30, min: 21 }, rain: 30, condition: "Cloudy" },
  { day: "Friday", date: "Mar 19", icon: Sun, temp: { max: 33, min: 23 }, rain: 5, condition: "Sunny" },
  { day: "Saturday", date: "Mar 20", icon: Sun, temp: { max: 34, min: 24 }, rain: 0, condition: "Clear" },
  { day: "Sunday", date: "Mar 21", icon: Cloud, temp: { max: 31, min: 22 }, rain: 25, condition: "Partly Cloudy" },
];

const advisories = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Heavy Rain Alert",
    message: "Heavy rainfall expected tomorrow. Avoid field operations and chemical spraying.",
    action: "Postpone spraying activities"
  },
  {
    type: "info", 
    icon: Droplets,
    title: "Irrigation Advisory",
    message: "Reduce irrigation as soil moisture will increase due to expected rainfall.",
    action: "Adjust irrigation schedule"
  },
  {
    type: "info",
    icon: Calendar,
    title: "Best Time for Field Work",
    message: "Today and Friday are ideal for field operations with clear weather conditions.",
    action: "Plan field activities"
  }
];

export function Weather({ onBack, language }: WeatherProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.weatherForecast}</h1>
        </div>
        <p className="text-white/90">7-day weather outlook with farming advisories</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Weather */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Weather</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-3xl font-bold">{currentWeather.temperature}°C</h2>
              <p className="text-muted-foreground">{currentWeather.condition}</p>
              <p className="text-sm text-muted-foreground">{currentWeather.location}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="text-lg font-bold">{currentWeather.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Wind className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Wind</div>
                  <div className="text-lg font-bold">{currentWeather.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Eye className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Visibility</div>
                  <div className="text-lg font-bold">{currentWeather.visibility} km</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Rain Chance</div>
                  <div className="text-lg font-bold">{currentWeather.rainChance}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Advisories */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Advisories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisories.map((advisory, index) => {
              const IconComponent = advisory.icon;
              return (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${
                    advisory.type === 'warning' 
                      ? 'border-warning/20 bg-warning/5' 
                      : 'border-blue-200 bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-5 h-5 mt-1 ${
                      advisory.type === 'warning' ? 'text-warning' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{advisory.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{advisory.message}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 text-xs ${
                          advisory.type === 'warning' 
                            ? 'border-warning text-warning' 
                            : 'border-blue-600 text-blue-600'
                        }`}
                      >
                        {advisory.action}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecast.map((day, index) => {
                const IconComponent = day.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-8 h-8 ${
                        day.condition.includes('Rain') ? 'text-blue-600' :
                        day.condition.includes('Cloud') ? 'text-gray-500' :
                        'text-yellow-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{day.day}</div>
                        <div className="text-xs text-muted-foreground">{day.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm">{day.condition}</div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <CloudRain className="w-3 h-3" />
                        <span>{day.rain}%</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-sm">{day.temp.max}°</div>
                      <div className="text-xs text-muted-foreground">{day.temp.min}°</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Refresh Weather
          </Button>
        </div>
      </div>
    </div>
  );
}