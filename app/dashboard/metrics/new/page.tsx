"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const metricsSchema = z.object({
  metricType: z.string(),
  value: z.string(),
  unit: z.string(),
  notes: z.string().optional(),
});

const metricOptions = {
  diabetes: [
    { value: "bloodGlucose", label: "blood glucose", unit: "mg/dL" },
    { value: "hba1c", label: "HbA1c", unit: "%" },
    { value: "bloodPressure", label: "blood pressure", unit: "mmHg" },
  ],
  hypertension: [
    { value: "systolic", label: "systolic pressure", unit: "mmHg" },
    { value: "diastolic", label: "diastolic pressure", unit: "mmHg" },
    { value: "heartRate", label: "heart rate", unit: "bpm" },
  ],
  copd: [
    { value: "oxygenSaturation", label: "oxygen saturation", unit: "%" },
    { value: "peakFlow", label: "peak flow", unit: "L/min" },
    { value: "respiratoryRate", label: "respiratory rate", unit: "breaths/min" },
  ],
  ckd: [
    { value: "creatinine", label: "creatinine", unit: "mg/dL" },
    { value: "gfr", label: "GFR", unit: "mL/min" },
    { value: "bloodPressure", label: "blood pressure", unit: "mmHg" },
  ],
  chf: [
    { value: "weight", label: "weight", unit: "kg" },
    { value: "bloodPressure", label: "blood pressure", unit: "mmHg" },
    { value: "heartRate", label: "heart rate", unit: "bpm" },
  ],
};

export default function NewMetricPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  const form = useForm<z.infer<typeof metricsSchema>>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      metricType: "",
      value: "",
      unit: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof metricsSchema>) {
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "metrics"), {
        ...values,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Health metric added successfully",
        variant: "default",
      });

      form.reset();
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleMetricTypeChange = (value: string) => {
    setSelectedMetric(value);
    const metric = Object.values(metricOptions)
      .flat()
      .find((m) => m.value === value);
    if (metric) {
      form.setValue("unit", metric.unit);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>add new health metric</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="metricType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>metric type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleMetricTypeChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select metric type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(metricOptions).map(([category, metrics]) => (
                          <div key={category}>
                            <div className="font-bold p-2">{category}</div>
                            {metrics.map((metric) => (
                              <SelectItem key={metric.value} value={metric.value}>
                                {metric.label}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>value</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="enter value!!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>notes (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="add any additional notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "adding..." : "add metric"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
