import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Fuel, Bed, Package, MapPin } from "lucide-react";

interface Stop {
  type: string;
  location: string;
  duration: number;
  day: number;
}

interface StopsTimelineProps {
  stops: Stop[];
}

const getStopIcon = (type: string) => {
  switch (type) {
    case "Pickup":
      return <Package className="h-5 w-5" />;
    case "Dropoff":
      return <MapPin className="h-5 w-5" />;
    case "Driving":
      return <Truck className="h-5 w-5" />;
    case "Fueling Stop":
      return <Fuel className="h-5 w-5" />;
    case "Rest":
      return <Bed className="h-5 w-5" />;
    default:
      return <Truck className="h-5 w-5" />;
  }
};

const getStopColor = (type: string) => {
  switch (type) {
    case "Pickup":
      return "text-accent bg-accent/10";
    case "Dropoff":
      return "text-destructive bg-destructive/10";
    case "Driving":
      return "text-primary bg-primary/10";
    case "Fueling Stop":
      return "text-blue-600 bg-blue-100";
    case "Rest":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-muted-foreground bg-muted";
  }
};

export const StopsTimeline = ({ stops }: StopsTimelineProps) => {
  // Group stops by day
  const stopsByDay = stops.reduce((acc, stop) => {
    if (!acc[stop.day]) {
      acc[stop.day] = [];
    }
    acc[stop.day].push(stop);
    return acc;
  }, {} as Record<number, Stop[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trip Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(stopsByDay).map(([day, dayStops]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Day {day}
              </h3>
              <div className="relative pl-8 space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-timeline-line" />
                
                {dayStops.map((stop, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[25px] top-1">
                      <div className={`p-2 rounded-full ${getStopColor(stop.type)}`}>
                        {getStopIcon(stop.type)}
                      </div>
                    </div>
                    
                    {/* Stop content */}
                    <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{stop.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{stop.location}</p>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {stop.duration}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
