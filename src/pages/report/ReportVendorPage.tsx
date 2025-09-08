import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Upload, X } from 'lucide-react';

export default function ReportVendorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'false_advertising', label: 'False Advertising', description: 'Product/service not as described' },
    { id: 'poor_service', label: 'Poor Service', description: 'Unprofessional behavior or poor quality service' },
    { id: 'delayed_delivery', label: 'Delayed Delivery', description: 'Unreasonable delays without communication' },
    { id: 'quality_issues', label: 'Quality Issues', description: 'Defective or damaged products' },
    { id: 'inappropriate_behavior', label: 'Inappropriate Behavior', description: 'Harassment or inappropriate conduct' },
    { id: 'other', label: 'Other', description: 'Other issues not listed above' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEvidence([...evidence, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !description.trim()) return;

    setLoading(true);

    // Simulate report submission
    setTimeout(() => {
      alert('Report submitted successfully. We will review your complaint and take appropriate action.');
      navigate('/buyer/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-900">Report Vendor</h1>
                <p className="text-sm text-red-700">Help us maintain a safe marketplace for all students</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of issue are you reporting? *
              </label>
              <div className="space-y-3">
                {reportTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                      reportType === type.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type.id}
                      checked={reportType === type.id}
                      onChange={(e) => setReportType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${reportType === type.id ? 'text-red-900' : 'text-gray-900'}`}>
                        {type.label}
                      </h3>
                      <p className={`text-sm mt-1 ${reportType === type.id ? 'text-red-700' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </div>
                    <div className={`ml-4 w-4 h-4 rounded-full border-2 ${
                      reportType === type.id ? 'border-red-600 bg-red-600' : 'border-gray-300'
                    }`}>
                      {reportType === type.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue in detail *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible about the issue you experienced..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include dates, times, and any relevant details that can help us investigate
              </p>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload screenshots, photos, or documents to support your report
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <label
                  htmlFor="evidence-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max 5 files, 10MB each. Supported: JPG, PNG, PDF, DOC
                </p>
              </div>

              {evidence.length > 0 && (
                <div className="mt-4 space-y-2">
                  {evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Information */}
            {orderId && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-1">Related Order</h3>
                <p className="text-sm text-blue-700">Order #{orderId}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Important Notice</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• False reports may result in account suspension</li>
                <li>• We will investigate all reports thoroughly</li>
                <li>• You may be contacted for additional information</li>
                <li>• Reports are confidential and anonymous to the vendor</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !reportType || !description.trim()}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  loading || !reportType || !description.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {loading ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}