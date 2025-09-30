import { useState } from 'react';
import { Heading, Button, Select } from '../../components';
import { VscAccount, VscEdit } from 'react-icons/vsc';
import { IoCamera } from 'react-icons/io5';

const Account = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Saif ur Rehman',
    email: 'saif@example.com',
    currency: 'PKR',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfile(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(userProfile);
    setIsEditing(false);
  };

  // Handler for Select component
  const handleCurrencyChange = (e) => {
    const selectedOption = e.target.value;
    // Extract currency code from the selected option string
    const currencyCode = selectedOption.split(' ')[1]; // Gets "USD" from "$ USD - US Dollar"
    setTempProfile(prev => ({
      ...prev,
      currency: currencyCode
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading className="text-xl sm:text-2xl">Account Settings</Heading>
        {!isEditing && (
          <Button 
            size="xs" 
            onClick={() => setIsEditing(true)}
            className="relative flex items-center gap-2 top-1"
          >
            <VscEdit className="text-sm" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
      </div>
      
      <div className="w-full mb-6 border-b border-[rgba(128,128,128,0.3)]"></div>

      <div className="max-w-2xl">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8 sm:flex-row sm:gap-6">
          <div className="relative group">
            <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-lg sm:w-32 sm:h-32 bg-secondary">
              {tempProfile.profileImage ? (
                <img 
                  src={tempProfile.profileImage} 
                  alt="Profile" 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-accent to-green-400">
                  <VscAccount className="text-3xl text-white sm:text-4xl" />
                </div>
              )}
            </div>
            
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 cursor-pointer bg-black/40 group-hover:opacity-100">
                <IoCamera className="text-xl text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-4 text-center sm:mt-0 sm:text-left sm:flex-1">
            <h2 className="text-lg font-bold sm:text-xl text-primary">
              {userProfile.name}
            </h2>
            <p className="mt-1 text-sm text-detail">{userProfile.email}</p>
            <div className="inline-block px-3 py-1 mt-2 text-xs font-medium rounded-full bg-accent/10 text-accent">
              {currencies.find(c => c.code === userProfile.currency)?.symbol} {userProfile.currency}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-primary">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-3 rounded-lg bg-gray-50 text-primary">
                  {userProfile.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-primary">
                Email Address
              </label>
              <div className="px-4 py-3 rounded-lg bg-gray-50 text-detail">
                {userProfile.email}
              </div>
            </div>

            {/* Currency Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-primary">
                Preferred Currency
              </label>
              {isEditing ? (
                <Select 
                  value={`${currencies.find(c => c.code === tempProfile.currency)?.symbol} ${tempProfile.currency} - ${currencies.find(c => c.code === tempProfile.currency)?.name}`}
                  onChange={handleCurrencyChange}
                  options={currencies.map(c => `${c.symbol} ${c.code} - ${c.name}`)} 
                />
              ) : (
                <div className="px-4 py-3 rounded-lg bg-gray-50 text-primary">
                  {currencies.find(c => c.code === userProfile.currency)?.symbol} {userProfile.currency} - {currencies.find(c => c.code === userProfile.currency)?.name}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col gap-3 pt-6 mt-8 border-t border-gray-100 sm:flex-row">
              <Button 
                onClick={handleSave}
                className="flex-1 sm:flex-none sm:px-8"
                size='sm'
              >
                Save Changes
              </Button>
              <Button 
                onClick={handleCancel}
                className="flex-1 bg-gray-500 sm:flex-none sm:px-8 hover:bg-gray-600"
                size='sm'
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="p-4 mt-6 border rounded-lg bg-accent/5 border-accent/10">
          <h3 className="mb-2 text-sm font-medium text-primary">Account Information</h3>
          <ul className="space-y-1 text-xs text-detail">
            <li>• Your currency preference affects how amounts are displayed throughout the app</li>
            <li>• Profile image changes are saved immediately when uploaded</li>
            <li>• Email address is linked to your account and cannot be modified here</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Account;