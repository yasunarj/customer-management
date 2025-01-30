interface FormData {
  name: string;
  phone: string | null;
  productName: string;
  price: string;
  reservationDate: string;
  deliveryDate: string;
}

const updateReservation = async (id: string, formData: FormData) => {
  const res = await fetch(`/api/reservation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "サーバーエラーが発生しました");
  }
};

export { updateReservation };
