import { useState } from "react";
import axios from "axios";
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

  // Geocode address to coordinates using Google Geocoding API
  const geocodeAddress = async (address: string) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY as string;
      if (!apiKey) {
        throw new Error('Missing VITE_GOOGLE_MAP_API_KEY in environment');
      }
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
      const response = await axios.get(url);
  
      const data = response.data;
  
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
  
      throw new Error(`Geocoding failed: ${data.status}`);
    } catch (err: any) {
      console.error("Geocoding error for address:", address, err);
      const message = err?.message || "Unknown error";
      throw new Error(`Geocoding failed for "${address}": ${message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Geocode all addresses to coordinates
      let start, pickup, dropoff,first,two;
       let teststart, testpickup, testdropoff;


      try {
        // Original geocoding calls (commented out)
        
        [teststart, testpickup, testdropoff] = await Promise.all([
          geocodeAddress(formData.currentLocation),
          geocodeAddress(formData.pickupLocation),
          geocodeAddress(formData.dropoffLocation)
        ]);
        
      
        // Hardcoded coordinates instead of geocoding
        start = { lat: 31.5820, lng: 74.3294 };     // Lahore city center
        pickup = { lat: 31.5900, lng: 74.3200 };    // nearby point in Lahore
        dropoff = { lat: 31.6000, lng: 74.3400 };   // another nearby point in Lahore   // nearby point
      
      } catch (geoErr: any) {
        toast({
          title: "Geocoding failed",
          description: geoErr?.message || "Could not resolve one or more addresses.",
          variant: "destructive",
        });
        return;
      }

      // Call Django backend
      try {
        const { data } = await axios.post('http://127.0.0.1:8000/api/plan-trip/', {
          start,
          pickup,
          dropoff,
          hours_used: parseFloat(formData.cycleHoursUsed)
        });
        onTripPlanned(data);
        
        toast({
          title: "Trip Planned Successfully",
          description: "Your route and stops have been calculated.",
        });
      } catch (apiErr: any) {
        toast({
          title: "Backend request failed",
          description: apiErr?.message || "Could not plan the trip.",
          variant: "destructive",
        });
        return;
      }
    } finally {
      setIsLoading(false);
    }




    // API CALL FOR MAKING STOPS

    
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
