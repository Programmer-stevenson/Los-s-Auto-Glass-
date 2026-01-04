const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Services API
export const servicesApi = {
  getAll: () => fetchApi<{ services: any[] }>('/api/services'),
  getById: (id: string) => fetchApi<{ service: any }>(`/api/services/${id}`),
};

// Calendar API
export const calendarApi = {
  getSlots: (date: string) =>
    fetchApi<{ slots: any[]; count: number }>(`/api/calendar/slots/${date}`),
  checkSlot: (date: string, timeSlot: string) =>
    fetchApi<{ available: boolean }>(`/api/calendar/check?date=${date}&timeSlot=${timeSlot}`),
};

// Bookings API (guest only - no auth)
export const bookingsApi = {
  create: (data: any) =>
    fetchApi<{ booking: any }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  lookup: (bookingNumber: string, email: string) =>
    fetchApi<{ booking: any }>(`/api/bookings/lookup?bookingNumber=${bookingNumber}&email=${email}`),
};

// Payments API
export const paymentsApi = {
  getConfig: () =>
    fetchApi<{ paypalClientId: string; mode: string }>('/api/payments/config'),
  createOrder: (bookingNumber: string) =>
    fetchApi<{ orderId: string; approvalUrl: string }>('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingNumber }),
    }),
  captureOrder: (orderId: string, bookingNumber: string) =>
    fetchApi<{ success: boolean; booking: any }>('/api/payments/capture-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, bookingNumber }),
    }),
  getStatus: (bookingNumber: string) =>
    fetchApi<any>(`/api/payments/status/${bookingNumber}`),
};

// Contact API
export const contactApi = {
  submit: (data: any) =>
    fetchApi<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { fetchApi };
