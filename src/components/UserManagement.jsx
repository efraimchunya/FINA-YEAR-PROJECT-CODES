import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "../hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin: Date | null;
  loginAttempts: number;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@zanzibar-tourism.com",
      fullName: "System Administrator",
      role: "admin",
      isActive: true,
      isVerified: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      loginAttempts: 0,
      twoFactorEnabled: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      username: "tour_operator_1",
      email: "operator@stonetown-tours.co.tz",
      fullName: "Amina Hassan",
      role: "operator",
      isActive: true,
      isVerified: true,
      lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000),
      loginAttempts: 0,
      twoFactorEnabled: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      username: "spice_guide",
      email: "guide@spice-tours.co.tz",
      fullName: "Mohammed Ali",
      role: "operator",
      isActive: false,
      isVerified: true,
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      loginAttempts: 3,
      twoFactorEnabled: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      username: "beach_resort_mgr",
      email: "manager@nungwi-resort.co.tz",
      fullName: "Sarah Johnson",
      role: "tourist",
      isActive: true,
      isVerified: false,
      lastLogin: null,
      loginAttempts: 0,
      twoFactorEnabled: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      // Real app: await updateUserStatus(userId, !currentStatus);
      toast({
        title: "User Status Updated",
        description: `User ${currentStatus ? "deactivated" : "activated"} successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "operator":
        return "bg-blue-100 text-blue-700";
      case "tourist":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeColor = (isActive: boolean, loginAttempts: number) => {
    if (!isActive) return "bg-red-100 text-red-700";
    if (loginAttempts >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl font-semibold">User Management</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            <Button className="tourism-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total Users" color="blue" count={users.length} />
            <SummaryCard
              label="Active Users"
              color="green"
              count={users.filter((u) => u.isActive).length}
            />
            <SummaryCard
              label="2FA Enabled"
              color="yellow"
              count={users.filter((u) => u.twoFactorEnabled).length}
            />
            <SummaryCard
              label="Security Alerts"
              color="red"
              count={users.filter((u) => u.loginAttempts >= 3).length}
            />
          </div>

          {/* User Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadgeColor(user.isActive, user.loginAttempts)}>
                          {!user.isActive ? "Inactive" : user.loginAttempts >= 3 ? "Locked" : "Active"}
                        </Badge>
                        {!user.isVerified && (
                          <Badge variant="outline" className="text-yellow-600">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.twoFactorEnabled ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" title="2FA Enabled" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" title="2FA Disabled" />
                        )}
                        {user.loginAttempts > 0 && (
                          <span className="text-sm text-red-600">
                            {user.loginAttempts} attempts
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.lastLogin
                          ? formatDistanceToNow(user.lastLogin, { addSuffix: true })
                          : "Never"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 👇 Reusable summary card
function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "blue" | "green" | "yellow" | "red";
}) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <h3 className={`text-sm font-medium text-${color}-900`}>{label}</h3>
      <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
    </div>
  );
}
