import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  route: {
    type: string;
    coordinates: [number, number][];
  };
  stops: Array<{
    type: string;
    location: string;
    duration: number;
    day: number;
    coordinates: [number, number];
  }>;
}

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 7);
  }, [center, map]);
  
  return null;
};

export const MapView = ({ route, stops }: MapViewProps) => {
  const centerCoordinates: [number, number] = route.coordinates[0]
    ? [route.coordinates[0][1], route.coordinates[0][0]]
    : [37.7749, -122.4194];

  const routePath: [number, number][] = route.coordinates.map(
    (coord) => [coord[1], coord[0]]
  );

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "Pickup":
        return "#f59e0b";
      case "Dropoff":
        return "#ef4444";
      case "Fueling Stop":
        return "#3b82f6";
      case "Rest":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const createCustomIcon = (type: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${getMarkerColor(type)}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Route Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
          <MapContainer
            {...{ center: centerCoordinates } as any}
            {...{ zoom: 7 } as any}
            className="h-full w-full"
            {...{ scrollWheelZoom: true } as any}
          >
            <MapController center={centerCoordinates} />
            <TileLayer
              {...{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' } as any}
              {...{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any}
            />
            
            <Polyline
              {...{ positions: routePath } as any}
              {...{ pathOptions: { color: "#2563eb", weight: 4, opacity: 0.7 } } as any}
            />

            {stops.map((stop, index) => {
              const markerIcon = createCustomIcon(stop.type);
              const position: [number, number] = [stop.coordinates[1], stop.coordinates[0]];
              return (
                <Marker
                  key={index}
                  {...{ position } as any}
                  {...{ icon: markerIcon } as any}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{stop.type}</p>
                      <p className="text-muted-foreground">{stop.location}</p>
                      <p className="text-xs">Day {stop.day} - {stop.duration}h</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
