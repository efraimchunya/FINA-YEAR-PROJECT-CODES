import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { z } from "zod";

// Assuming you have a base insertFeedbackSchema defined somewhere
// import { insertFeedbackSchema } from "../schemas/feedbackSchemas"; 
// If not, define it or replace with a simple zod schema here:

const insertFeedbackSchema = z.object({
  siteId: z.number(),
  message: z.string().min(5, "Message must be at least 5 characters").max(500),
});

// Extend schema to include rating with validation
const feedbackFormSchema = insertFeedbackSchema.extend({
  rating: z.number().min(1, "Please select a rating").max(5),
});

// No TypeScript types here, just infer the form data type from the schema (optional)
  
export function FeedbackForm({ siteId, onSuccess }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      siteId,
      message: "",
      rating: undefined,
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/feedback/site", siteId] });
      queryClient.invalidateQueries({ queryKey: ["/api/feedback/operator"] });
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! It helps improve the experience for other travelers.",
      });
      onSuccess();
      form.reset({ siteId, message: "", rating: undefined });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to leave feedback.",
        variant: "destructive",
      });
      return;
    }
    createFeedbackMutation.mutate(data);
  };

  // StarRating component for rating selection
  const StarRating = ({ value, onChange }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors ${
              value && star <= value
                ? "text-yellow-500"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-slate-600">Please log in to leave feedback</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <div className="flex items-center space-x-2">
          <StarRating
            value={form.watch("rating")}
            onChange={(rating) => form.setValue("rating", rating)}
          />
          {form.watch("rating") && (
            <span className="text-sm text-slate-600">
              {form.watch("rating")} out of 5 stars
            </span>
          )}
        </div>
        {form.formState.errors.rating && (
          <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Feedback</Label>
        <Textarea
          id="message"
          placeholder="Share your experience about this location..."
          rows={4}
          {...form.register("message")}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-coral hover:bg-orange-600"
          disabled={createFeedbackMutation.isLoading}
        >
          {createFeedbackMutation.isLoading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  );
}
