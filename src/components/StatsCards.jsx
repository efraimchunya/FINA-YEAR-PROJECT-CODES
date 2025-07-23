import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, MessageSquare, Star } from "lucide-react";
import { Card, CardContent } from "./ui/Card";

interface StatsData {
  totalSites: number;
  activeSites: number;
  activeEvents: number;
  feedbackCount: number;
  unreadFeedback: number;
  avgRating: string;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<StatsData>(
    {
      queryKey: ["/api/stats"],
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse shadow-md rounded-lg">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-300 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Sites",
      value: stats.totalSites,
      icon: MapPin,
      colorBg: "bg-red-100",
      colorText: "text-red-600",
      trend: "+12%",
      trendText: "from last month",
      trendColor: "text-green-600",
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: Calendar,
      colorBg: "bg-yellow-100",
      colorText: "text-yellow-600",
      trend: "+3",
      trendText: "this week",
      trendColor: "text-green-600",
    },
    {
      title: "User Feedback",
      value: stats.feedbackCount,
      icon: MessageSquare,
      colorBg: "bg-green-100",
      colorText: "text-green-600",
      trend: `${stats.unreadFeedback} new`,
      trendText: "pending review",
      trendColor: "text-red-500",
    },
    {
      title: "Avg. Rating",
      value: stats.avgRating,
      icon: Star,
      colorBg: "bg-yellow-100",
      colorText: "text-yellow-600",
      trend: "+0.2",
      trendText: "improvement",
      trendColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, value, icon: Icon, colorBg, colorText, trend, trendText, trendColor }, idx) => (
        <Card
          key={idx}
          className="border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">{title}</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
              </div>
              <div
                className={`${colorBg} ${colorText} w-14 h-14 rounded-xl flex items-center justify-center drop-shadow-md`}
              >
                <Icon className="h-7 w-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm font-medium">
              <span className={trendColor}>{trend}</span>
              <span className="text-gray-500">{trendText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
