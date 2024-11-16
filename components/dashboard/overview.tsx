"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export function Overview() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const metricsRef = collection(db, "users", user.uid, "metrics");
    const metricsQuery = query(
      metricsRef,
      orderBy("timestamp", "desc"),
      limit(7)
    );

    const unsubscribe = onSnapshot(metricsQuery, (snapshot) => {
      const metricsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: format(new Date(doc.data().timestamp), "MMM dd"),
          value: parseFloat(doc.data().value),
        }))
        .reverse();
      setMetrics(metricsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>loading metrics...</div>;
  }

  if (metrics.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            no metrics available. start by adding some health metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={metrics}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}