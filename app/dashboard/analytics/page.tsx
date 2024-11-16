"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const metricsRef = collection(db, "users", user.uid, "metrics");
    const metricsQuery = query(metricsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(metricsQuery, (snapshot) => {
      const metricsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMetrics(metricsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metricType]) {
      acc[metric.metricType] = [];
    }
    acc[metric.metricType].push({
      ...metric,
      date: format(new Date(metric.timestamp), "MMM dd"),
      value: parseFloat(metric.value),
    });
    return acc;
  }, {});

  if (loading) {
    return <div>loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">analytics</h1>

      {Object.entries(groupedMetrics).map(([metricType, data]: [string, any]) => (
        <Card key={metricType}>
          <CardHeader>
            <CardTitle>{metricType} graphical view</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}

      {metrics.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              no metrics data available. start adding metrics to see analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}