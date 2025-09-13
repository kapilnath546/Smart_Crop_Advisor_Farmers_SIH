import { useEffect, useState } from "react";
import { getWeatherAdvice } from "../lib/weatherAI";

export default function WeatherNotifier() {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true"
        );
        const data = await res.json();

        const tip = await getWeatherAdvice(data);
        setAdvice(tip);

        if (Notification.permission === "granted") {
          new Notification(tip);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded mt-4">
      <h2 className="font-bold text-green-800">🌦 Live Weather Alert</h2>
      <p>{advice || "Fetching advice..."}</p>
    </div>
  );
}
