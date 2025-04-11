// UserManagement.tsx
"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  MoreHorizontal,
  Search,
  UserX,
  UserCog,
  Mail,
  Upload,
  AlertCircle,
  Send,
  Download,
} from "lucide-react";
import { z } from "zod";
import { addEmployee, uploadUsersCSV } from "@/app/[id]/users/users.service";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: "active" | "inactive";
  lastActive?: string;
  avatar?: string;
  age?: number; // Optional field, may come from CSV or initial data
  gender?: "Male" | "Female"; // Optional field
  phone_number?: string; // Optional field
};

type NewUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee"; // Restricted to ADMIN or EMPLOYEE
};

type EmailData = {
  subject: string;
  message: string;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

// Updated Zod schema for NewUser (only name, email, password, role)
const newUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "EMPLOYEE"], {
    message: "Role must be ADMIN or EMPLOYEE",
  }),
});

// Schema for editing user (password is optional, but includes age, gender, phone_number)
const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["ADMIN", "EMPLOYEE"], {
    message: "Role must be ADMIN or EMPLOYEE",
  }),
  age: z
    .string()
    .regex(/^\d+$/, "Age must be a number")
    .transform(Number)
    .optional(),
  gender: z
    .enum(["Male", "Female"], {
      message: "Gender must be Male or Female",
    })
    .optional(),
  phone_number: z
    .string()
    .regex(
      /^\d{3}-\d{3}-\d{6}$/,
      "Phone number must be in format 213-661-100001",
    )
    .optional(),
});

// Schema for email form
const emailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function UserManagement({
  initialUsers,
  paginationInfo,
  onPageChange,
}: {
  initialUsers: User[] | User;
  paginationInfo?: PaginationInfo;
  onPageChange?: (page: number) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE" as "ADMIN" | "EMPLOYEE",
    age: "", // Used in edit form, not in add form
    gender: "", // Used in edit form, not in add form
    phone_number: "", // Used in edit form, not in add form
  });
  const [emailData, setEmailData] = useState<EmailData>({
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize users from props
  useEffect(() => {
    if (Array.isArray(initialUsers)) {
      setUsers(initialUsers);
    } else if (initialUsers) {
      setUsers([initialUsers]);
    } else {
      setUsers([]);
    }
  }, [initialUsers]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const validateForm = () => {
    const schema = isEditUserOpen ? editUserSchema : newUserSchema;
    const result = schema.safeParse(newUser);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const validateEmailForm = () => {
    const result = emailSchema.safeParse(emailData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "subject" || name === "message") {
      setEmailData((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      // Prepare the user data to send to the API (only name, email, password, role)
      const addedUser: NewUser = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role.toString() as "admin" | "employee",
      };
      console.log({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role.toString() as "admin" | "employee",
      })
      
      const newUserFromApi = await addEmployee(addedUser);

      // Add the new user to the users state
      setUsers((prev) => [...prev, newUserFromApi]);

      // Reset the form
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        age: "",
        gender: "",
        phone_number: "",
      });

      // Close the dialog
      setIsAddUserOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) {
      return;
    }

    setIsSubmitting(true);

    try {
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              age: newUser.age ? Number(newUser.age) : user.age,
              gender: newUser.gender || user.gender,
              phone_number: newUser.phone_number || user.phone_number,
            };
          }
          return user;
        }),
      );

      toast({
        title: "Success",
        description: "User has been updated successfully",
      });

      setIsEditUserOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      setTimeout(() => {
        toast({
          title: "Success",
          description: `Email sent to ${
            selectedUserIds.length > 0
              ? `${selectedUserIds.length} users`
              : currentUser?.name
          }`,
        });

        setIsSendEmailOpen(false);
        setEmailData({
          subject: "",
          message: "",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivateUsers = async () => {
    setIsSubmitting(true);

    try {
      setUsers((prev) =>
        prev.map((user) => {
          if (
            selectedUserIds.length > 0
              ? selectedUserIds.includes(user.id)
              : user.id === currentUser?.id
          ) {
            return {
              ...user,
              status: "inactive",
            };
          }
          return user;
        }),
      );

      toast({
        title: "Success",
        description: `${
          selectedUserIds.length > 0
            ? `${selectedUserIds.length} users have`
            : `${currentUser?.name} has`
        } been deactivated`,
      });

      setIsDeactivateOpen(false);
      setSelectedUserIds([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await uploadUsersCSV(file);
      const newUsers: User[] = response.users;
      if (response.insertedRows !== 0) {
        setUsers((prev) => [...prev, ...newUsers]);
      }
      toast({
        title: "Success",
        description: `Successfully imported ${newUsers.length} users`,
      });

      setIsAddUserOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to import users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((user) => user.id));
    }
  };

  const openEditUser = (user: User) => {
    setCurrentUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role as "ADMIN" | "EMPLOYEE",
      age: user.age?.toString() || "",
      gender: user.gender || "",
      phone_number: user.phone_number || "",
    });
    setIsEditUserOpen(true);
  };

  const openSendEmail = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setSelectedUserIds([]);
    }
    setEmailData({
      subject: "",
      message: "",
    });
    setIsSendEmailOpen(true);
  };

  const openDeactivateDialog = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setSelectedUserIds([]);
    }
    setIsDeactivateOpen(true);
  };

  const downloadCSV = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      toast({
        title: "No users",
        description: "There are no users to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["employee_name", "email", "age", "gender", "phone_number"];

    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.age ?? "",
      user.gender ?? "",
      user.phone_number ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full border-purple-200 dark:border-purple-900/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">User Management</CardTitle>
            <div className="hidden sm:block"></div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={downloadCSV}
              disabled={filteredUsers.length === 0}
              className="flex items-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system or import multiple users via
                    CSV.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="single" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900/30">
                    <TabsTrigger
                      value="single"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50"
                    >
                      Add Single User
                    </TabsTrigger>
                    <TabsTrigger
                      value="import"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50"
                    >
                      Import CSV
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single">
                    <form onSubmit={handleAddUser} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={newUser.name}
                          onChange={handleInputChange}
                          placeholder="Enter user name"
                          className="focus-visible:ring-purple-500"
                        />
                        {errors.name && (
                          <div className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newUser.email}
                          onChange={handleInputChange}
                          placeholder="Enter user email"
                          className="focus-visible:ring-purple-500"
                        />
                        {errors.email && (
                          <div className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={newUser.password}
                          onChange={handleInputChange}
                          placeholder="Enter user password"
                          className="focus-visible:ring-purple-500"
                        />
                        {errors.password && (
                          <div className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          name="role"
                          value={newUser.role}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                        {errors.role && (
                          <div className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.role}
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddUserOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                        >
                          {isSubmitting ? "Adding..." : "Add User"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </TabsContent>

                  <TabsContent value="import">
                    <div className="py-6 space-y-4">
                      <div className="border-2 border-dashed border-purple-200 dark:border-purple-800/50 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-purple-500 dark:text-purple-400" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          Upload a CSV file with user data
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          CSV should contain columns: name, email, password,
                          role (optional), age (optional), gender (optional),
                          phone_number (optional)
                        </p>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="csv-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSubmitting}
                          className="border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          {isSubmitting ? "Uploading..." : "Select CSV File"}
                        </Button>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddUserOpen(false)}
                        >
                          Cancel
                        </Button>
                      </DialogFooter>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>Manage system users and permissions</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 focus-visible:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total: {paginationInfo?.totalItems || 0} users
            </span>
            {selectedUserIds.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {selectedUserIds.length} users selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  onClick={() => openSendEmail()}
                >
                  <Mail className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => openDeactivateDialog()}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="border rounded-md border-purple-200 dark:border-purple-900/50">
          <Table>
            <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
              <TableRow className="hover:bg-purple-100/50 dark:hover:bg-purple-900/30">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUserIds.length === filteredUsers.length
                    }
                    onCheckedChange={handleSelectAllUsers}
                    aria-label="Select all users"
                    className="border-purple-300 dark:border-purple-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 dark:data-[state=checked]:bg-purple-700 dark:data-[state=checked]:border-purple-700"
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/10 border-purple-100 dark:border-purple-900/30"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                        className="border-purple-300 dark:border-purple-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 dark:data-[state=checked]:bg-purple-700 dark:data-[state=checked]:border-purple-700"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-purple-200 dark:border-purple-800">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.age ?? "N/A"}</TableCell>
                    <TableCell>{user.gender ?? "N/A"}</TableCell>
                    <TableCell>{user.phone_number ?? "N/A"}</TableCell>
                    <TableCell>{user.lastActive ?? "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center"
                            onClick={() => openEditUser(user)}
                          >
                            <UserCog className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center"
                            onClick={() => openSendEmail(user)}
                          >
                            <Mail className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center text-red-500"
                            onClick={() => openDeactivateDialog(user)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                placeholder="Enter user name"
                className="focus-visible:ring-purple-500"
              />
              {errors.name && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Enter user email"
                className="focus-visible:ring-purple-500"
              />
              {errors.email && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">
                Password{" "}
                <span className="text-muted-foreground text-sm">
                  (Leave blank to keep current)
                </span>
              </Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="focus-visible:ring-purple-500"
              />
              {errors.password && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
              {errors.role && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.role}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                name="age"
                type="number"
                value={newUser.age}
                onChange={handleInputChange}
                placeholder="Enter user age"
                className="focus-visible:ring-purple-500"
              />
              {errors.age && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.age}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gender</Label>
              <select
                id="edit-gender"
                name="gender"
                value={newUser.gender}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.gender}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone_number">Phone Number</Label>
              <Input
                id="edit-phone_number"
                name="phone_number"
                value={newUser.phone_number}
                onChange={handleInputChange}
                placeholder="Enter phone number (e.g., 213-661-100001)"
                className="focus-visible:ring-purple-500"
              />
              {errors.phone_number && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone_number}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditUserOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              {selectedUserIds.length > 0
                ? `Send an email to ${selectedUserIds.length} selected users`
                : `Send an email to ${currentUser?.name}`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendEmail} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email-subject"
                name="subject"
                value={emailData.subject}
                onChange={handleInputChange}
                placeholder="Enter email subject"
                className="focus-visible:ring-purple-500"
              />
              {errors.subject && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.subject}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="email-message"
                name="message"
                value={emailData.message}
                onChange={handleInputChange}
                placeholder="Enter your message"
                className="min-h-[150px] focus-visible:ring-purple-500"
              />
              {errors.message && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.message}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSendEmailOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUserIds.length > 0
                ? `Deactivate ${selectedUserIds.length} Users`
                : `Deactivate ${currentUser?.name}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUserIds.length > 0
                ? "Are you sure you want to deactivate these users? They will no longer be able to access the system."
                : "Are you sure you want to deactivate this user? They will no longer be able to access the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-200 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateUsers}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
