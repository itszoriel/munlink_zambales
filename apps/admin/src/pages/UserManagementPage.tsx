import UserVerificationList from '../components/UserVerificationList'

export default function UserManagementPage() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4">Pending User Verifications</h2>
      <UserVerificationList />
    </div>
  )
}


