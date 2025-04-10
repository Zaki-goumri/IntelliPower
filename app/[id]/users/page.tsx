import UserManagement from "@/components/user-management"
import UserRoles from "@/components/user-roles"
import UserActivity from "@/components/user-activity"

export default function UsersPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserManagement />
        </div>
        <div className="space-y-6">
          <UserRoles />
          <UserActivity />
        </div>
      </div>
    </main>
  )
}
