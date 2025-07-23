import { Star, MapPin, Edit2, Eye, Trash2, Heart } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";
import type { TouristSite } from "@shared/schema";

interface SiteCardProps {
  site: TouristSite;
  onEdit: (site: TouristSite) => void;
  onView: (site: TouristSite) => void;
  onDelete: (site: TouristSite) => void;
}

export function SiteCard({ site, onEdit, onView, onDelete }: SiteCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "inactive": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryTags = (category: string) => {
    const tags = [category];
    if (category === "Nature") tags.push("Hiking");
    if (category === "Historical") tags.push("Culture");
    if (category === "Art") tags.push("Culture");
    if (category === "Coastal") tags.push("Historical");
    if (category === "Urban") tags.push("Views");
    return tags;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={site.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}
          alt={site.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getStatusColor(site.status)}>
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {site.name}
          </h3>
          <div className="flex items-center text-yellow-500 text-sm">
            <Star className="h-4 w-4 mr-1" />
            <span>{site.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {site.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="line-clamp-1">{site.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryTags(site.category).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(site)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(site)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(site)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
