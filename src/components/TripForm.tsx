import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TripFormProps {
  onTripPlanned: (data: any) => void;
}

export const TripForm = ({ onTripPlanned }: TripFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    cycleHoursUsed: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to backend
      // In production, this would be: const response = await fetch('/api/plan-trip', { method: 'POST', body: JSON.stringify(formData) })
      
      // Mock response data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        route: {
          type: "LineString",
          coordinates: [
            [-122.4194, 37.7749], // San Francisco
            [-121.8863, 37.3382], // San Jose
            [-118.2437, 34.0522], // Los Angeles
          ]
        },
        stops: [
          { type: "Pickup", location: formData.pickupLocation, duration: 1, day: 1, coordinates: [-122.4194, 37.7749] },
          { type: "Driving", location: "I-5 South", duration: 8, day: 1, coordinates: [-121.8863, 37.3382] },
          { type: "Fueling Stop", location: "Rest Area", duration: 0.5, day: 1, coordinates: [-120.5, 36.5] },
          { type: "Rest", location: "Truck Stop", duration: 10, day: 1, coordinates: [-119.5, 35.5] },
          { type: "Driving", location: "I-5 South", duration: 6, day: 2, coordinates: [-118.5, 34.5] },
          { type: "Dropoff", location: formData.dropoffLocation, duration: 1, day: 2, coordinates: [-118.2437, 34.0522] },
        ],
        logs: [
          { day: 1, driving: 8.5, rest: 10, cycleHoursUsed: parseFloat(formData.cycleHoursUsed) + 8.5 },
          { day: 2, driving: 6, rest: 8, cycleHoursUsed: parseFloat(formData.cycleHoursUsed) + 14.5 },
        ]
      };

      onTripPlanned(mockResponse);
      
      toast({
        title: "Trip Planned Successfully",
        description: "Your route and stops have been calculated.",
      });
    } catch (error) {
      toast({
        title: "Error Planning Trip",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
        <CardDescription>Enter your trip details to generate route and ELD logs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-location" className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary" />
              Current Location
            </Label>
            <Input
              id="current-location"
              placeholder="Enter address or coordinates (e.g., San Francisco, CA)"
              value={formData.currentLocation}
              onChange={(e) => handleChange("currentLocation", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-location" className="flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              Pickup Location
            </Label>
            <Input
              id="pickup-location"
              placeholder="Enter pickup address or coordinates"
              value={formData.pickupLocation}
              onChange={(e) => handleChange("pickupLocation", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-destructive" />
              Dropoff Location
            </Label>
            <Input
              id="dropoff-location"
              placeholder="Enter dropoff address or coordinates"
              value={formData.dropoffLocation}
              onChange={(e) => handleChange("dropoffLocation", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycle-hours">Current Cycle Hours Used</Label>
            <Input
              id="cycle-hours"
              type="number"
              step="0.1"
              min="0"
              max="70"
              placeholder="Enter hours (e.g., 25.5)"
              value={formData.cycleHoursUsed}
              onChange={(e) => handleChange("cycleHoursUsed", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Planning..." : "Plan Trip"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
