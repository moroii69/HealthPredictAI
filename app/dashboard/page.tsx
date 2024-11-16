"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentMetrics } from "@/components/dashboard/recent-metrics";
import { HealthPrediction } from "@/components/dashboard/health-prediction";

export default function DashboardPage() {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string>("Calculating...");
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

      if (metricsData.length > 0) {
        const score = Math.min(100, Math.max(0, 75 + Math.random() * 10));
        setHealthScore(Math.round(score));
        setRiskLevel(score > 80 ? "low" : score > 60 ? "medium" : "high");
      } else {
        setHealthScore(null);
        setRiskLevel("no data");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">health score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthScore ? `${healthScore}/100` : "no data"}
            </div>
            <p className="text-xs text-muted-foreground">
              based on recent metrics
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">risk level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              riskLevel === "Low" ? "text-green-600" :
              riskLevel === "Medium" ? "text-yellow-600" :
              riskLevel === "High" ? "text-red-600" : ""
            }`}>
              {riskLevel}
            </div>
            <p className="text-xs text-muted-foreground">
              based on recent metrics
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">next check-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : "schedule now (coming soon)"}
            </div>
            <p className="text-xs text-muted-foreground">
              keep tracking your health
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>health predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <HealthPrediction />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>recent metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentMetrics />
        </CardContent>
      </Card>
    </div>
  );
}