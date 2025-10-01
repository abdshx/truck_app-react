import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  day: number;
  driving: number;
  rest: number;
  cycleHoursUsed: number;
}

interface ELDLogsProps {
  logs: LogEntry[];
}

export const ELDLogs = ({ logs }: ELDLogsProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    // In production, this would call: /api/logs/:trip_id/pdf
    toast({
      title: "Downloading Logs",
      description: "Your ELD logs PDF is being prepared...",
    });

    // Simulate PDF download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "ELD logs saved successfully.",
      });
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>ELD Daily Logs</CardTitle>
        <Button onClick={handleDownloadPDF} size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Day {log.day}</h3>
                <span className="text-sm font-medium text-muted-foreground">
                  Total Cycle: {log.cycleHoursUsed.toFixed(1)}h
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driving</p>
                    <p className="text-lg font-semibold">{log.driving}h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rest</p>
                    <p className="text-lg font-semibold">{log.rest}h</p>
                  </div>
                </div>
              </div>

              {/* Progress bar showing cycle hours */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Cycle Progress</span>
                  <span>{((log.cycleHoursUsed / 70) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((log.cycleHoursUsed / 70) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
