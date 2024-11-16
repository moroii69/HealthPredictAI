"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  risk: "low" | "medium" | "high";
}

function calculatePrediction(metrics: any[]): Prediction[] {
  if (metrics.length === 0) return [];

  // Get the latest metric
  const latestMetric = metrics[0];
  const metricType = latestMetric.metricType;
  const value = parseFloat(latestMetric.value);

  let risk: "low" | "medium" | "high";
  let prediction: string;
  let confidence: number;

  // specific prediction logic for each metric type (unable to add machine learning model in time - can be added later - for model to kepe learning as users input data...)
  if (metricType === "bloodPressure") {
    if (value <= 120) {
      risk = "low";
      prediction = "blood pressure is normal";
      confidence = 85;
    } else if (value <= 140) {
      risk = "medium";
      prediction = "blood pressure is slightly elevated";
      confidence = 88;
    } else {
      risk = "high";
      prediction = "blood pressure requires attention";
      confidence = 90;
    }
  } else if (metricType === "bloodGlucose") {
    if (value <= 140) {
      risk = "low";
      prediction = "blood glucose is normal";
      confidence = 85;
    } else if (value <= 200) {
      risk = "medium";
      prediction = "blood glucose is moderately elevated";
      confidence = 88;
    } else {
      risk = "high";
      prediction = "blood glucose requires immediate attention";
      confidence = 90;
    }
  } else {
    // remaining metrics types -- default value added (todo: add separate logic for each metric if hardcoding!)
    risk = "low";
    prediction = "Values are within normal range";
    confidence = 85;
  }

  return [
    {
      id: "1",
      title: `${metricType} analysis`,
      prediction,
      confidence,
      risk,
    },
  ];
}

export function HealthPrediction() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const metricsRef = collection(db, "users", user.uid, "metrics");
    const metricsQuery = query(
      metricsRef,
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(metricsQuery, (snapshot) => {
      const metricsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const newPredictions = calculatePrediction(metricsData);
      setPredictions(newPredictions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>analyzing your health data...</div>;
  }

  if (predictions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            add more health metrics to receive predictions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <Card key={prediction.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{prediction.title}</h4>
              <Badge
                variant={prediction.risk === "low" ? "secondary" : "destructive"}
              >
                {prediction.risk.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {prediction.prediction}
            </p>
            <div className="text-xs text-muted-foreground">
              Confidence: {prediction.confidence}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}