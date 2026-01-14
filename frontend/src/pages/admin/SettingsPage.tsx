import { useEffect, useState } from "react";
import { Save, Loader2, Building, Phone, MapPin, Utensils } from "lucide-react";
import api from "../../lib/api";

interface RestaurantSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  delivery_fee: number;
  is_open: boolean;
  cuisine_type: string[];
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<RestaurantSettings>({
    name: "",
    description: "",
    address: "",
    phone: "",
    delivery_fee: 0,
    is_open: true,
    cuisine_type: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/restaurant");
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === "delivery_fee" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await api.put("/restaurant", settings);
      setSettings(response.data);
      setMessage({ type: "success", text: "Settings updated successfully" });
    } catch (error) {
      console.error("Failed to update settings", error);
      setMessage({ type: "error", text: "Failed to update settings" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Settings
        </h1>
        <p className="text-gray-500">
          Manage your restaurant details and configurations
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={settings.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type (Comma sep)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Utensils className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="cuisine_type"
                  value={settings.cuisine_type}
                  onChange={handleChange}
                  placeholder="Indian, Chinese..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">₹</span>
                </div>
                <input
                  type="number"
                  name="delivery_fee"
                  value={settings.delivery_fee}
                  onChange={handleChange}
                  className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center pt-6">
              <input
                id="is_open"
                name="is_open"
                type="checkbox"
                checked={settings.is_open}
                onChange={(e) =>
                  setSettings({ ...settings, is_open: e.target.checked })
                }
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="is_open"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Restaurant is Currently Open
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
