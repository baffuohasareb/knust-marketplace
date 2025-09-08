import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, User, Mail, School, BadgeCheck, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { state } = useApp();
  const user = state.user;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No profile found</h2>
          <Link to="/buyer/home" className="text-green-600 hover:text-green-700">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                alt={user.name}
                className="w-16 h-16 rounded-full border border-gray-200 object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <BadgeCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Index Number</p>
                <p className="font-medium text-gray-900">{user.indexNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <School className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Programme</p>
                <p className="font-medium text-gray-900">{user.programme}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium text-gray-900">{user.year}</p>
              </div>
            </div>

            {user.hall && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Hall</p>
                  <p className="font-medium text-gray-900">{user.hall}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">Your information is based on your KNUST login.</div>
            <div className="flex gap-3">
              <Link
                to="/buyer/orders"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                View Orders
              </Link>
              <Link
                to="/notifications"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
