import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardContent } from "../ui/Card";
import { FeedbackForm } from "../forms/feedback-form";
import { MapPin, DollarSign, MessageSquare, Star, X } from "lucide-react";

interface SiteDetailsModalProps {
  site: TouristSiteWithActivities;
  isOpen: boolean;
  onClose: () => void;
}

export function SiteDetailsModal({ site, isOpen, onClose }: SiteDetailsModalProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "beach":
        return "🏖️";
      case "cultural":
        return "🕌";
      case "historical":
        return "🏛️";
      default:
        return "📍";
    }
  };

  const getDefaultImage = (category: string) => {
    switch (category) {
      case "beach":
        return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      case "cultural":
        return "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      case "historical":
        return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      default:
        return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Site Image */}
          <img 
            src={site.imageUrl || getDefaultImage(site.category)} 
            alt={site.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <Button 
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {site.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center text-slate-text mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{parseFloat(site.latitude).toFixed(4)}, {parseFloat(site.longitude).toFixed(4)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-4xl">{getCategoryIcon(site.category)}</span>
              <Badge className="capitalize">
                {site.category}
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {site.description}
          </p>
          
          {site.activities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Activities</h3>
              <div className="space-y-4">
                {site.activities.map((activity) => (
                  <Card key={activity.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.overview}</p>
                        </div>
                        <div className="ml-4 flex items-center space-x-1 bg-ocean-blue text-white px-3 py-1 rounded-full">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-medium">{parseFloat(activity.pricePerHead).toFixed(0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {site.operator && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Operated by</h4>
              <p className="text-sm text-gray-700">{site.operator.fullName}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-6 border-t">
            <Button 
              onClick={() => setShowFeedbackForm(true)}
              className="bg-coral hover:bg-orange-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Leave Feedback
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Feedback for {site.title}</DialogTitle>
              </DialogHeader>
              <FeedbackForm 
                siteId={site.id} 
                onSuccess={() => setShowFeedbackForm(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
