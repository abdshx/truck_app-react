import { useState } from "react";
import { TripForm } from "@/components/TripForm";
import { MapView } from "@/components/MapView";
import { StopsTimeline } from "@/components/StopsTimeline";
import { ELDLogs } from "@/components/ELDLogs";
import { Truck } from "lucide-react";

const Index = () => {
  const [tripData, setTripData] = useState<any>(null);
  const [tripUpdateTrigger, setTripUpdateTrigger] = useState<number>(0);

  const handleTripPlanned = (data: any) => {
    setTripData(data);
    setTripUpdateTrigger(prev => prev + 1); // Increment trigger to force update
  };

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
                Driver Trip Planner & ELD Logs
              </h1>
              <p className="text-sm text-muted-foreground">
                Plan routes, stops, and download log sheets
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Trip Form */}
          <div>
            <TripForm onTripPlanned={handleTripPlanned} />
          </div>

          {/* Stops Timeline */}
          {tripData && (
            <div>
              <StopsTimeline stops={tripData.stops} />
            </div>
          )}
        </div>

        {/* Map View */}
        {tripData && (
          <div className="mb-6">
            <MapView route={tripData.route}  updateTrigger={tripUpdateTrigger} />
            <div className="mt-4 flex justify-center">
              <a href="/start-trip" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Start Trip
              </a>
            </div>
          </div>
        )}

        {/* ELD Logs */}
        {tripData && (
          <div>
            <ELDLogs logs={tripData.logs} />
          </div>
        )}

        {/* Empty State */}
        {!tripData && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-muted/30 rounded-full inline-block mb-4">
                <Truck className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ready to Plan Your Trip?</h2>
              <p className="text-muted-foreground">
                Fill out the form above to generate your route, stops schedule, and ELD logs.
              </p>
            </div>
          </div>
        )}
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

export default Index;
