import React, { useState, useEffect, useCallback } from "react";
import { Shipment, ShipmentStatus, ShipmentUpdate } from "../types"; // Assuming your types are correctly defined
import {
  CheckCircle,
  Clock,
  Truck,
  Package,
  AlertTriangle,
  Plus,
  Save,
  Search,
  Edit3,
  Trash2,
} from "lucide-react";
import Input from "../ui/Input";

const API_BASE_URL = "https://ghost.safepackglobaltravel.com/admin/tracking";

// Helper to format ISO date string to YYYY-MM-DDTHH:MM for datetime-local input
const formatDateForInput = (dateString?: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Invalid date
    // Create a date string in the local timezone format required by datetime-local
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

const AdminPage: React.FC = () => {
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const initialFormData = {
    recipient: "",
    recipientPhone: "",
    origin: "",
    destination: "",
    status: "pending" as ShipmentStatus,
    service: "",
    shipDate: formatDateForInput(new Date().toISOString()),
    estimatedDelivery: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const initialUpdateFormData = {
    status: "in_transit" as ShipmentStatus,
    description: "",
    location: "",
    notes: "",
  };
  const [newUpdate, setNewUpdate] = useState<Omit<ShipmentUpdate, "timestamp">>(
    initialUpdateFormData
  );
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthToken = () => localStorage.getItem("admin_token");

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const displayError = useCallback(
    (message: string) => {
      setError(message);
      setSuccess("");
      setTimeout(clearMessages, 5000);
    },
    [clearMessages]
  );

  const displaySuccess = useCallback(
    (message: string) => {
      setSuccess(message);
      setError("");
      setTimeout(clearMessages, 3000);
    },
    [clearMessages]
  );

  const mapBackendToFrontend = (
    backendShipment: Record<string, unknown>
  ): Shipment => {
    return {
      id: backendShipment.id as number,
      trackingId: backendShipment.trackingNumber as string,
      recipient: backendShipment.recipientName as string,
      recipientPhone: (backendShipment.recipientPhone as string) || "",
      origin: backendShipment.origin as string,
      destination: backendShipment.destination as string,
      status: backendShipment.status as ShipmentStatus,
      service: backendShipment.service as string,
      shipDate: backendShipment.shipDate as string,
      deliveryDate: backendShipment.deliveryDate as string | null,
      estimatedDelivery: backendShipment.estimatedDeliveryDate as string | null,
      updates: (backendShipment.updates || []) as ShipmentUpdate[], // Backend doesn't send this, so it will be empty
    };
  };

  const fetchShipments = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      displayError("Admin not authenticated. Please login.");
      return;
    }
    try {
      const response = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized. Please login again.");
        throw new Error(`Failed to fetch shipments: ${response.statusText}`);
      }
      const data = await response.json();
      const formattedShipments = data.map(mapBackendToFrontend);
      setAllShipments(formattedShipments);
      setFilteredShipments(formattedShipments); // Initialize filtered list

      // Update selectedShipment with the fresh version from the server, using functional update
      setSelectedShipment((currentSelected) => {
        if (currentSelected) {
          const updatedVersion = formattedShipments.find(
            (s: Shipment) => s.trackingId === currentSelected.trackingId
          );
          return updatedVersion || null; // Keep selection if found (with new data), else clear it
        }
        return null; // Was not selected, remains not selected
      });
    } catch (err: unknown) {
      displayError(
        err instanceof Error ? err.message : "Failed to fetch shipments."
      );
      console.error(err);
    }
  }, [displayError]); // Removed selectedShipment from dependencies

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    clearMessages();
    if (!selectedShipment) {
      setShowUpdateForm(false);
    }
  }, [clearMessages, selectedShipment]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredShipments(allShipments);
      return;
    }
    setFilteredShipments(
      allShipments.filter(
        (shipment) =>
          shipment.trackingId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (shipment.recipientPhone &&
            shipment.recipientPhone
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allShipments]);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditingShipment(null);
    setIsCreating(false);
    setShowUpdateForm(false);
    clearMessages();
  };

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-500" size={18} />;
      case "in_transit":
        return <Truck className="text-primary" size={18} />;
      case "processing":
        return <Package className="text-yellow-500" size={18} />;
      case "pending":
      default:
        return <Clock className="text-gray-500" size={18} />;
    }
  };

  const handleFormInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateFormInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewUpdate((prev) => ({
      ...prev,
      [name]: name === "status" ? (value as ShipmentStatus) : value,
    }));
  };

  const resetMainForm = () => {
    setFormData(initialFormData);
    setIsCreating(false);
    setEditingShipment(null);
  };

  // CREATE SHIPMENT
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const token = getAuthToken();
    if (!token) {
      displayError("Admin not authenticated.");
      return;
    }

    if (
      !formData.recipient ||
      !formData.recipientPhone ||
      !formData.origin ||
      !formData.destination ||
      !formData.service
    ) {
      displayError("Please fill all required fields.");
      return;
    }

    const payload = {
      recipientName: formData.recipient,
      recipientPhone: formData.recipientPhone,
      origin: formData.origin,
      destination: formData.destination,
      status: formData.status,
      service: formData.service,
      shipDate: formData.shipDate
        ? new Date(formData.shipDate).toISOString()
        : new Date().toISOString(),
      estimatedDeliveryDate: formData.estimatedDelivery
        ? new Date(formData.estimatedDelivery).toISOString()
        : null,
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to create shipment: ${response.statusText}`
        );
      }
      // const newShipmentFromServer = await response.json();
      displaySuccess("Shipment created successfully!");
      resetMainForm();
      fetchShipments(); // Refresh list
    } catch (err: unknown) {
      displayError(
        err instanceof Error ? err.message : "Failed to create shipment."
      );
      console.error("Error creating shipment:", err);
    }
  };

  // EDIT SHIPMENT DETAILS
  const handleEdit = (shipment: Shipment) => {
    clearMessages();
    setSelectedShipment(shipment); // Ensure it's selected if someone clicks edit directly
    setEditingShipment(shipment);
    setIsCreating(false);
    setShowUpdateForm(false);
    setFormData({
      recipient: shipment.recipient,
      recipientPhone: shipment.recipientPhone || "",
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      service: shipment.service,
      shipDate: formatDateForInput(shipment.shipDate),
      estimatedDelivery: formatDateForInput(shipment.estimatedDelivery),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const token = getAuthToken();
    if (!token) {
      displayError("Admin not authenticated.");
      return;
    }
    if (!editingShipment) {
      displayError("No shipment selected for editing.");
      return;
    }

    if (
      !formData.recipient ||
      !formData.recipientPhone ||
      !formData.origin ||
      !formData.destination ||
      !formData.service
    ) {
      displayError("Please fill all required fields.");
      return;
    }

    const payload = {
      recipientName: formData.recipient,
      recipientPhone: formData.recipientPhone,
      origin: formData.origin,
      destination: formData.destination,
      status: formData.status,
      service: formData.service,
      shipDate: formData.shipDate
        ? new Date(formData.shipDate).toISOString()
        : null,
      estimatedDeliveryDate: formData.estimatedDelivery
        ? new Date(formData.estimatedDelivery).toISOString()
        : null,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/${editingShipment.trackingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update shipment: ${response.statusText}`
        );
      }
      displaySuccess("Shipment details saved successfully!");
      resetMainForm();
      fetchShipments(); // Refresh list
    } catch (err: unknown) {
      displayError(
        err instanceof Error ? err.message : "Failed to save shipment details."
      );
      console.error("Error saving shipment details:", err);
    }
  };

  // ADD STATUS UPDATE (to selected shipment)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const token = getAuthToken();
    if (!token) {
      displayError("Admin not authenticated.");
      return;
    }
    if (!selectedShipment) {
      displayError("No shipment selected.");
      return;
    }
    if (!newUpdate.description) {
      displayError("Update description is required.");
      return;
    }

    // Prepare payload for backend (only updates fields in the 'trackings' table)
    const backendPayload = {
      status: newUpdate.status,
      recipientName: selectedShipment.recipient,
      recipientPhone: selectedShipment.recipientPhone,
      origin: selectedShipment.origin,
      destination: selectedShipment.destination,
      service: selectedShipment.service,
      shipDate: selectedShipment.shipDate
        ? new Date(selectedShipment.shipDate).toISOString()
        : null,
      estimatedDeliveryDate: selectedShipment.estimatedDelivery
        ? new Date(selectedShipment.estimatedDelivery).toISOString()
        : null,
    };

    try {
      // Update the main shipment status on the backend
      const response = await fetch(
        `${API_BASE_URL}/${selectedShipment.trackingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(backendPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update shipment status: ${response.statusText}`
        );
      }
      const updatedShipmentFromServer = await response.json();
      const serverShipment = mapBackendToFrontend(updatedShipmentFromServer);

      const localUpdateEntry: ShipmentUpdate = {
        ...newUpdate,
        timestamp: new Date().toISOString(),
      };

      const updatedLocalShipment: Shipment = {
        ...serverShipment,
        updates: [localUpdateEntry, ...(selectedShipment.updates || [])],
      };

      setSelectedShipment(updatedLocalShipment);
      setAllShipments((prev) =>
        prev.map((s) =>
          s.trackingId === updatedLocalShipment.trackingId
            ? updatedLocalShipment
            : s
        )
      );

      setNewUpdate(initialUpdateFormData);
      setShowUpdateForm(false);
      displaySuccess("Shipment status updated and log entry added locally.");
    } catch (err: unknown) {
      displayError(
        err instanceof Error ? err.message : "Failed to update shipment."
      );
      console.error("Error updating shipment status:", err);
    }
  };

  // DELETE SHIPMENT
  const handleDeleteShipment = async (trackingId: string) => {
    clearMessages();
    if (
      !window.confirm(
        `Are you sure you want to delete shipment #${trackingId}?`
      )
    )
      return;

    const token = getAuthToken();
    if (!token) {
      displayError("Admin not authenticated.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${trackingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to delete shipment: ${response.statusText}`
        );
      }
      displaySuccess(`Shipment #${trackingId} deleted successfully.`);
      setSelectedShipment(null); // Deselect
      fetchShipments(); // Refresh list
    } catch (err: unknown) {
      displayError(
        err instanceof Error ? err.message : "Failed to delete shipment."
      );
      console.error("Error deleting shipment:", err);
    }
  };

  const inputStyle = `mt-1 py-2 px-4 block w-full outline-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`;
  const inputUpdateStyle = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <button
              onClick={() => {
                clearMessages();
                setIsCreating(true);
                setEditingShipment(null);
                setSelectedShipment(null);
                setFormData(initialFormData);
              }}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-black transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" /> Create New Shipment
            </button>
          </div>

          {/* Global Error/Success Messages */}
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div
              className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {(isCreating || editingShipment) && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {isCreating
                  ? "Create New Shipment"
                  : `Edit Shipment #${editingShipment?.trackingId}`}
              </h2>
              <form
                onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tracking ID
                    </label>
                    <Input
                      type="text"
                      value={
                        isCreating
                          ? "Auto-generated"
                          : editingShipment?.trackingId
                      }
                      disabled
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Recipient Name *
                    </label>
                    <Input
                      type="text"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Recipient Phone *
                    </label>
                    <Input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Type *
                    </label>
                    <Input
                      type="text"
                      name="service"
                      value={formData.service}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Origin *
                    </label>
                    <Input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Destination *
                    </label>
                    <Input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ship Date *
                    </label>
                    <Input
                      type="datetime-local"
                      name="shipDate"
                      value={formData.shipDate}
                      onChange={handleFormInputChange}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estimated Delivery Date
                    </label>
                    <Input
                      type="datetime-local"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleFormInputChange}
                      className={inputStyle}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetMainForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary transition-all duration-300 text-white rounded-md hover:bg-black text-sm font-medium flex items-center"
                  >
                    <Save size={16} className="mr-2" />{" "}
                    {isCreating ? "Create Shipment" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shipments list */}
            <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Shipments ({filteredShipments.length})
                </h2>
                <div className="mt-3 relative">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Search shipments..."
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 380px)" }}
              >
                {filteredShipments.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredShipments.map((shipment) => (
                      <li
                        key={shipment.trackingId}
                        className={`p-4 hover:bg-gray-100 cursor-pointer transition-colors ${
                          selectedShipment?.trackingId === shipment.trackingId
                            ? "bg-primary-light border-l-4 border-primary"
                            : ""
                        }`}
                        onClick={() => handleSelectShipment(shipment)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">
                              #{shipment.trackingId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shipment.recipient}
                            </p>
                          </div>
                          <div className="flex items-center text-sm capitalize">
                            {getStatusIcon(shipment.status)}
                            <span className="ml-2">
                              {shipment.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <AlertTriangle
                      size={32}
                      className="mx-auto mb-2 text-gray-400"
                    />
                    <p>
                      {allShipments.length > 0 && searchTerm
                        ? "No shipments match your search."
                        : "No shipments found."}
                    </p>
                    {allShipments.length === 0 && !searchTerm && (
                      <p className="mt-2 text-sm">
                        Try creating a new shipment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Shipment details */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-lg">
              {selectedShipment ? (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          Shipment #{selectedShipment.trackingId}
                        </h2>
                        <p className="text-gray-600">
                          To: {selectedShipment.recipient} (
                          {selectedShipment.recipientPhone})
                        </p>
                        <p className="text-sm text-gray-500">
                          From: {selectedShipment.origin} To:{" "}
                          {selectedShipment.destination}
                        </p>
                        <p className="text-sm text-gray-500">
                          Service: {selectedShipment.service}
                        </p>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(selectedShipment)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition-colors text-sm flex items-center"
                        >
                          <Edit3 size={16} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => setShowUpdateForm(!showUpdateForm)}
                          className="bg-primary hover:bg-black text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm flex items-center"
                        >
                          {showUpdateForm ? (
                            "Cancel Update"
                          ) : (
                            <>
                              <Plus size={16} className="mr-1" /> Add Update
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteShipment(selectedShipment.trackingId)
                      }
                      className="mt-3 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete Shipment
                    </button>
                  </div>

                  {showUpdateForm && (
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Add New Status Update
                      </h3>
                      <form onSubmit={handleUpdateSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status *
                            </label>
                            <select
                              name="status"
                              className={inputUpdateStyle}
                              value={newUpdate.status}
                              onChange={handleUpdateFormInputChange}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="in_transit">In Transit</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <Input
                              type="text"
                              name="location"
                              className={inputUpdateStyle}
                              placeholder="e.g., New York, NY"
                              value={newUpdate.location}
                              onChange={handleUpdateFormInputChange}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <Input
                            type="text"
                            name="description"
                            className={inputUpdateStyle}
                            placeholder="e.g., Package arrived at sorting facility"
                            value={newUpdate.description}
                            onChange={handleUpdateFormInputChange}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                          </label>
                          <textarea
                            name="notes"
                            className={inputUpdateStyle}
                            placeholder="Additional information"
                            rows={2}
                            value={newUpdate.notes || ""}
                            onChange={handleUpdateFormInputChange}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-black text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" /> Save Update
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="p-6 max-h-[calc(100vh-500px)] overflow-y-auto">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Shipment Update History (Local Session)
                    </h3>
                    <div className="divide-y divide-gray-200">
                      {selectedShipment.updates &&
                      selectedShipment.updates.length > 0 ? (
                        selectedShipment.updates.map((update, index) => (
                          <div key={index} className="py-4">
                            <div className="flex items-center">
                              {getStatusIcon(update.status)}
                              <span className="ml-2 font-medium text-gray-800 capitalize">
                                {update.status.replace("_", " ")}:{" "}
                                {update.description}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-600">
                              <span className="mr-4">
                                {new Date(update.timestamp).toLocaleString()}
                              </span>
                              {update.location && (
                                <span>Location: {update.location}</span>
                              )}
                            </div>
                            {update.notes && (
                              <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                Notes: {update.notes}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic py-4">
                          No update history for this session. Add an update to
                          see it here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center h-full flex flex-col justify-center items-center">
                  <Package size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">
                    No Shipment Selected
                  </h3>
                  <p className="text-gray-500">
                    Select a shipment from the list to view its details or
                    create a new one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
