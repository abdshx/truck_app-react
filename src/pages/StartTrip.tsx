import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Truck, Clock, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartTrip = () => {
  const { toast } = useToast();
  const [isDriving, setIsDriving] = useState(false);
  const [drivingTime, setDrivingTime] = useState(0);
  const [drivingInterval, setDrivingInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [isActivity, setIsActivity] = useState(false);
  const [activityTime, setActivityTime] = useState(0);
  const [activityInterval, setActivityInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [activityType, setActivityType] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [showRefuelAlert, setShowRefuelAlert] = useState(false);
  
  const [previousDistance, setPreviousDistance] = useState(0);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle driving button click
  const handleDrivingToggle = () => {
    if (!isDriving) {
      // Start driving
      setIsDriving(true);
      const interval = setInterval(() => {
        setDrivingTime(prev => prev + 1);
      }, 1000);
      setDrivingInterval(interval);
    } else {
      // Stop driving
      setIsDriving(false);
      if (drivingInterval) {
        clearInterval(drivingInterval);
        setDrivingInterval(null);
      }
    }
  };

  // Handle activity button click
  const handleActivityToggle = () => {
    if (!isActivity) {
      // Start activity
      setIsActivity(true);
      const interval = setInterval(() => {
        setActivityTime(prev => prev + 1);
      }, 1000);
      setActivityInterval(interval);
    } else {
      // Stop activity
      setIsActivity(false);
      if (activityInterval) {
        clearInterval(activityInterval);
        setActivityInterval(null);
      }
    }
  };

  // Handle distance input change
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistance(value);
    
    // Check if distance exceeds 100 miles from previous stop
    const currentDistance = parseFloat(value);
    if (!isNaN(currentDistance) && currentDistance - previousDistance > 100) {
      setShowRefuelAlert(true);
    } else {
      setShowRefuelAlert(false);
    }
  };

  // Handle activity submission
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType) {
      toast({
        title: "Activity type required",
        description: "Please select an activity type",
        variant: "destructive",
      });
      return;
    }
    
    if (!distance) {
      toast({
        title: "Distance required",
        description: "Please enter the distance covered",
        variant: "destructive",
      });
      return;
    }
    
    // Save the current distance as previous for next comparison
    setPreviousDistance(parseFloat(distance));
    
    toast({
      title: "Activity Recorded",
      description: `${activityType} activity recorded at ${distance} miles`,
    });
    
    // Reset form
    setActivityType("");
    setDistance("");
    setActivityTime(0);
    if (activityInterval) {
      clearInterval(activityInterval);
      setActivityInterval(null);
    }
    setIsActivity(false);
  };

  // Clean up intervals on component unmount
  useEffect(() => {
    return () => {
      if (drivingInterval) clearInterval(drivingInterval);
      if (activityInterval) clearInterval(activityInterval);
    };
  }, [drivingInterval, activityInterval]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Active Trip
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your driving time and activities
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Driving Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Driving Status</CardTitle>
              <CardDescription>Track your driving time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl font-mono">{formatTime(drivingTime)}</div>
                <Button 
                  size="lg" 
                  className={`w-full ${isDriving ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  onClick={handleDrivingToggle}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  {isDriving ? "Stop Driving" : "Start Driving"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Form */}
          <Card>
            <CardHeader>
              <CardTitle>Record Activity</CardTitle>
              <CardDescription>Log stops and activities during your trip</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger id="activity-type">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fueling">Fueling</SelectItem>
                      <SelectItem value="rest">Rest</SelectItem>
                      <SelectItem value="rest">Sleep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance Covered (miles)</Label>
                  <Input 
                    id="distance" 
                    type="number" 
                    step="0.1" 
                    placeholder="Enter distance in miles" 
                    value={distance}
                    onChange={handleDistanceChange}
                  />
                </div>

                {showRefuelAlert && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Refueling Required</AlertTitle>
                    <AlertDescription>
                      You've traveled over 100 miles since your last stop. Please refuel soon.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Activity Timer</Label>
                    <div className="font-mono">{formatTime(activityTime)}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button"
                      variant={isActivity ? "destructive" : "default"}
                      onClick={handleActivityToggle}
                    >
                      <Timer className="mr-2 h-4 w-4" />
                      {isActivity ? "Stop Activity" : "Start Activity"}
                    </Button>
                    
                    <Button type="submit">Record Activity</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Built for internship project – No authentication required
        </div>
      </footer>
    </div>
  );
};

export default StartTrip;