import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Star, Reply, CheckCheck, Archive } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

export function FeedbackList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feedback = [] } = useQuery({
    queryKey: ["/api/feedback"],
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await apiRequest("PUT", `/api/feedback/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Success",
        description: "Feedback status updated successfully",
        variant: "success",
      });
    },
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "normal": return "bg-blue-100 text-blue-700";
      case "low": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-500 text-white";
      case "reviewed": return "bg-green-500 text-white";
      case "resolved": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInitialsColor = (initials) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">User Feedback</CardTitle>
          <div className="flex items-center space-x-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button className="tourism-secondary">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No feedback available
            </div>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 border rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 ${getInitialsColor(item.userInitials)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">
                      {item.userInitials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.userName}</h4>
                        <p className="text-sm text-gray-500">Site ID: {item.siteId}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(item.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-900 mb-3">{item.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.rating && (
                          <div className="flex items-center text-yellow-500 text-sm">
                            <Star className="h-4 w-4 mr-1" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateFeedbackMutation.mutate({
                            id: item.id,
                            status: item.status === "new" ? "reviewed" : "resolved"
                          })}
                          disabled={updateFeedbackMutation.isPending}
                        >
                          Mark {item.status === "new" ? "Reviewed" : "Resolved"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
