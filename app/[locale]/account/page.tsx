"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Lock,
  User,
  Save,
  X,
  Shield,
  Calendar,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  Address,
  updateAddress,
  updateProfile,
} from "@/lib/store/auth/authSlice";
import { updateProfileThunk } from "@/lib/store/auth/authThunks";

export default function AccountPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  console.log(user);

  // State management
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "security"
  >("profile");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const [addressForm, setAddressForm] = useState<Address>({
    label: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  // Calculate member since date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  // Address handlers
  const handleAddAddress = async () => {
    try {
      if (
        addressForm.firstName &&
        addressForm.lastName &&
        addressForm.phone &&
        addressForm.street &&
        addressForm.city &&
        addressForm.state &&
        addressForm.zipCode &&
        addressForm.country
      ) {
        const newId = crypto.randomUUID();
        const newAddress = { ...addressForm, id: newId };

        let updatedAddresses = [...(user?.addresses || [])];

        if (newAddress.isDefault) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }

        updatedAddresses.push(newAddress);

        const updatedData = await dispatch(
          updateProfileThunk({ userData: { addresses: updatedAddresses } }),
        ).unwrap();

        if (updatedData.data) {
          toast.success("Address added successfully");
          resetAddressForm();
          setIsAddingAddress(false);
        } else {
          toast.error(updatedData.message || "Failed to add address");
        }
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Something went wrong while adding address");
    }
  };

  const handleUpdateAddress = async () => {
    if (editingAddressId) {
      try {
        const updatedAddress = { ...addressForm, id: editingAddressId };
        let updatedAddresses = [...(user?.addresses || [])];

        if (updatedAddress.isDefault) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }

        updatedAddresses = updatedAddresses.map((addr) =>
          addr.id === editingAddressId ? updatedAddress : addr,
        );

        const updatedData = await dispatch(
          updateProfileThunk({
            userData: { addresses: updatedAddresses },
          }),
        ).unwrap();

        if (updatedData.data) {
          toast.success("Address updated successfully");
          resetAddressForm();
          setEditingAddressId(null);
          setIsAddingAddress(false);
        } else {
          toast.error(updatedData.message || "Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Something went wrong while updating address");
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const updatedAddresses = (user?.addresses || []).filter(
        (addr) => addr.id !== id,
      );

      const updatedData = await dispatch(
        updateProfileThunk({
          userData: { addresses: updatedAddresses },
        }),
      ).unwrap();

      if (updatedData.data) {
        toast.success("Address deleted successfully");
      } else {
        toast.error(updatedData.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Something went wrong while deleting address");
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm(address);
    setEditingAddressId(address.id || null);
    setIsAddingAddress(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      label: "",
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      isDefault: false,
    });
  };

  const handleCancelAddress = () => {
    resetAddressForm();
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  // Profile handlers
  const handleUpdateProfile = async () => {
    try {
      const updatedData = await dispatch(
        updateProfileThunk({ userData: profileForm }),
      ).unwrap();

      if (updatedData.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(updatedData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setIsEditingProfile(false);
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    });
    setIsEditingProfile(false);
  };

  // Password handlers
  const handleChangePassword = () => {
    if (passwordForm.newPassword === passwordForm.confirmPassword) {
      // TODO: Call API to change password
      console.log("Changing password");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div className="min-h-screen bg-ink py-12 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={32} className="text-gold" />
            <h1 className="font-head text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider">
              Mission Control
            </h1>
          </div>
          <p className="text-white/60 italic text-sm sm:text-base">
            Manage your tactical operations and account settings
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-charcoal border-2 border-olive/30 rounded-[3px] p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-olive/20 border-2 border-olive rounded-full flex items-center justify-center">
                <User size={32} className="text-gold" />
              </div>
              <div>
                <h2 className="font-head text-xl sm:text-2xl font-bold text-white uppercase">
                  {user?.first_name} {user?.last_name}
                </h2>

                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={12} className="text-gold" />
                  <p className="text-white/40 text-xs uppercase tracking-wider">
                    Member Since {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-dark border border-white/10 rounded-[3px] mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex-1 py-4 px-6 font-head text-sm font-bold uppercase tracking-wider transition-all border-b-2 sm:border-b-0 sm:border-r",
                activeTab === "profile"
                  ? "bg-olive text-white border-olive"
                  : "bg-transparent text-white/60 hover:text-white border-white/10",
              )}
            >
              <User size={16} className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={cn(
                "flex-1 py-4 px-6 font-head text-sm font-bold uppercase tracking-wider transition-all border-b-2 sm:border-b-0 sm:border-r",
                activeTab === "addresses"
                  ? "bg-olive text-white border-olive"
                  : "bg-transparent text-white/60 hover:text-white border-white/10",
              )}
            >
              <MapPin size={16} className="inline mr-2" />
              Addresses
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex-1 py-4 px-6 font-head text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === "security"
                  ? "bg-olive text-white border-olive border-b-2"
                  : "bg-transparent text-white/60 hover:text-white",
              )}
            >
              <Lock size={16} className="inline mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-charcoal border border-white/10 rounded-[3px] p-6 sm:p-8">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-head text-xl font-bold text-white uppercase tracking-wider border-b-2 border-gold pb-2">
                  Profile Information
                </h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-olive text-white font-head text-sm font-bold uppercase tracking-wider rounded-[3px] hover:bg-olive-lt transition-all"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                      First Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            first_name: e.target.value,
                          })
                        }
                        className="w-full bg-dark border border-white/20 text-white px-4 py-3 rounded-[3px] outline-none focus:border-olive transition-all italic"
                      />
                    ) : (
                      <p className="text-white text-lg italic">
                        {user?.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                      Last Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            last_name: e.target.value,
                          })
                        }
                        className="w-full bg-dark border border-white/20 text-white px-4 py-3 rounded-[3px] outline-none focus:border-olive transition-all italic"
                      />
                    ) : (
                      <p className="text-white text-lg italic">
                        {user?.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gold" />
                    <p className="text-white text-lg italic">{user?.email}</p>
                  </div>
                  <p className="text-white/40 text-xs mt-1 italic">
                    Email cannot be changed for security reasons
                  </p>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-olive text-white font-head text-sm font-bold uppercase tracking-wider rounded-[3px] hover:bg-olive-lt transition-all"
                    >
                      <Save size={14} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelProfileEdit}
                      className="flex items-center gap-2 px-6 py-3 bg-dark border border-white/20 text-white/80 font-head text-sm font-bold uppercase tracking-wider rounded-[3px] hover:bg-white/5 transition-all"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-head text-xl font-bold text-white uppercase tracking-wider border-b-2 border-gold pb-2">
                  Saved Addresses
                </h3>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-olive text-white font-head text-sm font-bold uppercase tracking-wider rounded-[3px] hover:bg-olive-lt transition-all"
                  >
                    <Plus size={14} />
                    Add Address
                  </button>
                )}
              </div>

              {/* Add/Edit Address Form */}
              {isAddingAddress && (
                <div className="bg-dark border border-white/20 rounded-[3px] p-6 mb-6">
                  <h4 className="font-head text-lg font-bold text-white uppercase mb-4">
                    {editingAddressId ? "Edit Address" : "New Address"}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="sm:col-span-2">
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Label (e.g., Home, Work) *
                      </label>
                      <input
                        type="text"
                        value={addressForm.label}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            label: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                        placeholder="Home"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.firstName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.lastName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Phone *
                      </label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine2: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/40 text-white px-6 py-4 rounded-full outline-none focus:border-gold transition-all"
                        placeholder="India"
                      />
                    </div>

                    <div className="sm:col-span-2 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-olive"
                        />
                        <span className="text-white/80 text-sm italic">
                          Set as default address
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={
                        editingAddressId
                          ? handleUpdateAddress
                          : handleAddAddress
                      }
                      className="px-8 py-3 bg-gold text-dark font-head text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gold-lt transition-all"
                    >
                      {editingAddressId ? "Update" : "Save"} Address
                    </button>
                    <button
                      onClick={handleCancelAddress}
                      className="px-8 py-3 bg-transparent border border-white/20 text-white/80 font-head text-sm font-bold uppercase tracking-wider rounded-full hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {user && user.addresses && user.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 italic">
                      No addresses saved yet
                    </p>
                    <p className="text-white/30 text-sm italic mt-2">
                      Add an address to get started
                    </p>
                  </div>
                ) : (
                  user &&
                  user.addresses &&
                  user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-dark border border-white/10 rounded-[3px] p-5 hover:border-olive/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-head text-lg font-bold text-white uppercase">
                              {address.label}
                            </h4>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider rounded-[2px] border border-gold/30">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-white font-bold mb-1">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-white/70 italic">
                            {address.phone}
                          </p>
                          <p className="text-white/70 italic">
                            {address.street}
                          </p>
                          {address.addressLine2 && (
                            <p className="text-white/70 italic">
                              {address.addressLine2}
                            </p>
                          )}
                          <p className="text-white/70 italic">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-white/70 italic">
                            {address.country}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 bg-olive/20 text-olive hover:bg-olive hover:text-white rounded-[3px] transition-all"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id!)}
                            className="p-2 bg-red/20 text-red hover:bg-red hover:text-white rounded-[3px] transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div>
              <h3 className="font-head text-xl font-bold text-white uppercase tracking-wider border-b-2 border-gold pb-2 mb-6">
                Change Password
              </h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-white/20 text-white px-4 py-3 rounded-[3px] outline-none focus:border-olive transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-white/20 text-white px-4 py-3 rounded-[3px] outline-none focus:border-olive transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 italic">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-white/20 text-white px-4 py-3 rounded-[3px] outline-none focus:border-olive transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-6 py-3 bg-olive text-white font-head text-sm font-bold uppercase tracking-wider rounded-[3px] hover:bg-olive-lt transition-all mt-6"
                >
                  <Lock size={14} />
                  Update Password
                </button>

                <div className="mt-8 p-4 bg-gold/10 border border-gold/30 rounded-[3px]">
                  <div className="flex gap-3">
                    <Shield size={20} className="text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gold font-bold text-sm uppercase mb-1">
                        Security Tips
                      </p>
                      <ul className="text-white/70 text-xs space-y-1 italic">
                        <li>• Use at least 8 characters</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Add numbers and special characters</li>
                        <li>• Avoid common words or patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
