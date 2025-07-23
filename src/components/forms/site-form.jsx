import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTouristSiteSchema, type TouristSiteWithActivities } from "@shared/schema";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Plus, Trash2, MapPin } from "lucide-react";
import { z } from "zod";

const siteFormSchema = insertTouristSiteSchema.extend({
  activities: z.array(z.object({
    name: z.string().min(1, "Activity name is required"),
    overview: z.string().min(1, "Activity overview is required"),
    pricePerHead: z.string().min(1, "Price is required"),
  })).optional(),
});

type SiteFormData = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  site?: TouristSiteWithActivities;
  onSuccess: () => void;
}

export function SiteForm({ site, onSuccess }: SiteFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState(
    site?.activities.map(a => ({
      name: a.name,
      overview: a.overview,
      pricePerHead: a.pricePerHead,
    })) || [{ name: "", overview: "", pricePerHead: "" }]
  );

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      title: site?.title || "",
      description: site?.description || "",
      latitude: site?.latitude || "",
      longitude: site?.longitude || "",
      category: site?.category || "beach",
      imageUrl: site?.imageUrl || "",
      operatorId: user?.role === "operator" ? user.id : site?.operatorId,
    },
  });

  const createSiteMutation = useMutation({
    mutationFn: async (data: SiteFormData) => {
      const response = await apiRequest("POST", "/api/sites", data);
      return response.json();
    },
    onSuccess: (newSite) => {
      // Create activities for the new site
      if (activities.length > 0 && activities[0].name) {
        activities.forEach(async (activity) => {
          if (activity.name && activity.overview && activity.pricePerHead) {
            await apiRequest("POST", "/api/activities", {
              siteId: newSite.id,
              name: activity.name,
              overview: activity.overview,
              pricePerHead: activity.pricePerHead,
            });
          }
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/operator/sites"] });
      toast({
        title: "Site created",
        description: "Your tourist site has been created successfully.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSiteMutation = useMutation({
    mutationFn: async (data: SiteFormData) => {
      const response = await apiRequest("PUT", `/api/sites/${site!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/operator/sites"] });
      toast({
        title: "Site updated",
        description: "Your tourist site has been updated successfully.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SiteFormData) => {
    if (site) {
      updateSiteMutation.mutate(data);
    } else {
      createSiteMutation.mutate(data);
    }
  };

  const addActivity = () => {
    setActivities([...activities, { name: "", overview: "", pricePerHead: "" }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: string, value: string) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Site Title</Label>
          <Input
            id="title"
            placeholder="Enter site title"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.watch("category")}
            onValueChange={(value) => form.setValue("category", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beach">🏖️ Beach</SelectItem>
              <SelectItem value="cultural">🕌 Cultural Site</SelectItem>
              <SelectItem value="historical">🏛️ Historical Site</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the tourist site..."
          rows={4}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="-6.1659"
            {...form.register("latitude")}
          />
          {form.formState.errors.latitude && (
            <p className="text-sm text-red-500">{form.formState.errors.latitude.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="39.1917"
            {...form.register("longitude")}
          />
          {form.formState.errors.longitude && (
            <p className="text-sm text-red-500">{form.formState.errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...form.register("imageUrl")}
        />
        {form.formState.errors.imageUrl && (
          <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
        )}
      </div>

      {/* Activities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activities</span>
            <Button type="button" variant="outline" size="sm" onClick={addActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Activity {index + 1}</h4>
                {activities.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeActivity(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Activity Name</Label>
                  <Input
                    placeholder="e.g., Snorkeling"
                    value={activity.name}
                    onChange={(e) => updateActivity(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Price per Person ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    value={activity.pricePerHead}
                    onChange={(e) => updateActivity(index, "pricePerHead", e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Overview</Label>
                <Textarea
                  placeholder="Brief description of the activity..."
                  rows={2}
                  value={activity.overview}
                  onChange={(e) => updateActivity(index, "overview", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-coral hover:bg-orange-600"
          disabled={createSiteMutation.isPending || updateSiteMutation.isPending}
        >
          {createSiteMutation.isPending || updateSiteMutation.isPending
            ? "Saving..."
            : site
            ? "Update Site"
            : "Create Site"}
        </Button>
      </div>
    </form>
  );
}
