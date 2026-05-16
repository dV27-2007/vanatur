import { useState, type FormEvent } from "react";
import { submitInquiry } from "@/services/api";
import type { InquiryPayload } from "@/types";

interface InquiryFormProps {
  sourcePage: string;
}

export function InquiryForm({ sourcePage }: InquiryFormProps) {
  const [status, setStatus] = useState<{ message: string; state: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: InquiryPayload = {
      requestType: String(formData.get("requestType") || ""),
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      guests: formData.get("guests") ? Number(formData.get("guests")) : undefined,
      date: String(formData.get("date") || "").trim(),
      space: String(formData.get("space") || "").trim(),
      sourcePage,
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.phone) {
      setStatus({ message: "Укажите имя и телефон.", state: "error" });
      return;
    }

    setSubmitting(true);
    setStatus({ message: "Отправляем запрос...", state: "pending" });

    try {
      const result = await submitInquiry(payload);
      if (result.ok) {
        form.reset();
        setStatus({ message: "Спасибо! Ваш запрос отправлен.", state: "success" });
      } else {
        setStatus({ message: result.message || "Не удалось отправить запрос.", state: "error" });
      }
    } catch {
      setStatus({ message: "Не удалось отправить запрос.", state: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} data-source-page={sourcePage}>
      <div className="form-grid">
        <label className="form-field">
          <span>Тип запроса</span>
          <select name="requestType" required defaultValue="Бронирование ресторана">
            <option value="Бронирование ресторана">Бронирование ресторана</option>
            <option value="Мероприятие">Мероприятие</option>
            <option value="Купе">Купе</option>
            <option value="Комплексный запрос">Комплексный запрос</option>
          </select>
        </label>
        <label className="form-field">
          <span>Имя</span>
          <input type="text" name="name" placeholder="Ваше имя" required />
        </label>
        <label className="form-field">
          <span>Телефон</span>
          <input type="tel" name="phone" placeholder="+374 ..." required />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input type="email" name="email" placeholder="name@example.com" />
        </label>
        <label className="form-field">
          <span>Количество гостей</span>
          <input type="number" name="guests" min="1" placeholder="Например, 40" />
        </label>
        <label className="form-field">
          <span>Желаемая дата</span>
          <input type="date" name="date" min={today} />
        </label>
        <label className="form-field form-field-wide">
          <span>Интересующее пространство</span>
          <select name="space" defaultValue="">
            <option value="">Выберите при необходимости</option>
            <option value="Основной ресторан">Основной ресторан</option>
            <option value="Grand Hall">Grand Hall</option>
            <option value="Terrace Lounge">Terrace Lounge</option>
            <option value="Private Event Room">Private Event Room</option>
            <option value="Купе на двоих">Купе на двоих</option>
            <option value="Семейное купе">Семейное купе</option>
            <option value="Купе для компании">Купе для компании</option>
            <option value="VIP-купе">VIP-купе</option>
          </select>
        </label>
        <label className="form-field form-field-wide">
          <span>Комментарий</span>
          <textarea
            name="message"
            rows={5}
            placeholder="Опишите ваш формат: дата, тип события, желаемая атмосфера, особые пожелания"
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="button" type="submit" disabled={submitting}>
          Отправить заявку
        </button>
        {status && (
          <p className={`form-status${status.state ? ` [data-state="${status.state}"]` : ""}`} data-state={status.state}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
