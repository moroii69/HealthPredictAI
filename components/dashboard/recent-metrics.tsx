"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentMetrics() {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const metricsRef = collection(db, "users", user.uid, "metrics");
    const metricsQuery = query(
      metricsRef,
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(metricsQuery, (snapshot) => {
      const metricsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: format(new Date(doc.data().timestamp), "PPP"),
      }));
      setMetrics(metricsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Loading recent metrics...</div>;
  }

  if (metrics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          no metrics available  D:  start tracking your health metrics now!!
        </p>
        <Button onClick={() => router.push("/dashboard/metrics/new")}>
          add your first metric
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => (
          <TableRow key={metric.id}>
            <TableCell>{metric.date}</TableCell>
            <TableCell>{metric.metricType}</TableCell>
            <TableCell>{metric.value} {metric.unit}</TableCell>
            <TableCell>{metric.notes || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}