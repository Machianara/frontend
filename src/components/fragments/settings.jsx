import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Pastikan import Input ada
import { HelpCircle, Loader2 } from "lucide-react";

// --- KONFIGURASI API ---
// Menggunakan endpoint /auth karena di Postman path-nya ada di sana
const API_BASE_URL = "https://backend-dev-service.up.railway.app/auth";

// --- COMPONENT ROW ---
const SettingRow = ({ label, children, subLabelIcon }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-6 border-b border-gray-100 last:border-0">
      <div className="md:col-span-3 flex items-center gap-2">
        <label className="text-[16px] font-bold text-gray-800">{label}</label>
        {subLabelIcon && (
          <span className="text-gray-400 cursor-help">{subLabelIcon}</span>
        )}
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
};

const DashboardSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Ref untuk password
  const passwordInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    biography: "",
    password: "", // Password kosongkan defaultnya
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  // --- HELPER HEADER ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = localStorage.getItem("user_data");

        if (!storedUserData) {
          window.location.href = "/login";
          return;
        }

        const userObj = JSON.parse(storedUserData);

        setCurrentUserId(userObj.id);
        setFormData({
          name: userObj.name || "",
          phone: userObj.phone || "",
          biography: userObj.biography || "",
          password: "",
        });
      } catch (error) {
        console.error("Gagal memuat data lokal", error);
      } finally {
        setIsFetching(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUserId) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    setIsLoading(true);

    try {
      // 1. Siapkan Payload (Name & Bio selalu dikirim)
      const updatePayload = {
        name: formData.name,
        biography: formData.biography,
      };

      // 2. Password hanya dikirim jika diisi (agar tidak mereset password jadi kosong)
      if (formData.password && formData.password.trim() !== "") {
        updatePayload.password = formData.password;
      }

      // 3. Request ke Endpoint Admin (tapi dicoba akses oleh User)
      // URL: https://backend-dev-service.up.railway.app/auth/users/{id}
      const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatePayload),
      });

      // 4. Handle Error Spesifik
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));

        // Cek permission error (Admin Only?)
        if (response.status === 403 || response.status === 401) {
          throw new Error(
            "AKSES DITOLAK: Endpoint ini mungkin khusus Admin. Minta Backend Dev untuk membuka akses self-update."
          );
        }

        throw new Error(
          errData.message || `Gagal update (Status: ${response.status})`
        );
      }

      const result = await response.json();

      // 5. Update Local Storage dengan data terbaru
      // Sesuaikan 'result.data' dengan struktur respons BE Anda
      const newUserObj = result.data || result.user || result;

      const currentUserData = JSON.parse(
        localStorage.getItem("user_data") || "{}"
      );
      const updatedUserData = { ...currentUserData, ...newUserObj };

      localStorage.setItem("user_data", JSON.stringify(updatedUserData));

      setFormData((prev) => ({
        ...prev,
        name: updatedUserData.name,
        biography: updatedUserData.biography,
        password: "", // Reset field password setelah sukses
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full px-7 mx-auto pb-10 sm:pb-20">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>

      <div className="flex flex-col">
        {/* INPUT NAMA */}
        <SettingRow label="Full Name">
          <div className="flex h-12 w-full rounded-md border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-700 outline-none bg-transparent"
              placeholder="Your Name"
            />
          </div>
        </SettingRow>

        {/* PHONE (Read Only) */}
        <SettingRow label="Phone Number">
          <div className="flex h-12 w-full rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
            <input
              name="phone"
              value={formData.phone}
              readOnly
              className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-500 outline-none bg-transparent cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Contact Admin to change your login Phone Number.
          </p>
        </SettingRow>

        {/* BIOGRAPHY */}
        <SettingRow
          label="Biography"
          subLabelIcon={<HelpCircle className="h-4 w-4" />}
        >
          <div className="relative">
            <Textarea
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              className="min-h-40 bg-white resize-none text-gray-600 text-[14px] sm:text-[16px] leading-relaxed p-4 rounded-xl focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none"
              maxLength={325}
              placeholder="Tell us about yourself..."
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {325 - (formData.biography?.length || 0)} chars left
              </span>
            </div>
          </div>
        </SettingRow>

        {/* PASSWORD CHANGE (Optional) */}
        <SettingRow label="Change Password">
          <div className="flex h-12 w-full rounded-md border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
            <input
              ref={passwordInputRef}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Leave empty to keep current password"
              className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-700 outline-none bg-transparent"
            />
          </div>
        </SettingRow>
      </div>

      <div className="flex justify-end gap-4 mt-4 sm:mt-10 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="h-11 px-8 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
        >
          Cancel
          <XIcon className="ml-2 w-4 h-4" />
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-indigo-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save Changes
              <CheckIcon className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Ikon Helper
const XIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

export default DashboardSettings;
