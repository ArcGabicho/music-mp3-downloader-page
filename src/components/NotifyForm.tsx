import { useState } from "react";
import { sileo } from "sileo";
import { ArrowRight, Loader2 } from "lucide-react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NotifyForm() {
	const [email, setEmail] = useState("");
	const [pending, setPending] = useState(false);

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (pending) return;

		const value = email.trim();
		if (!EMAIL.test(value)) {
			sileo.warning({
				title: "Revisa el correo",
				description: "Introduce una dirección válida para avisarte de nuevas versiones.",
			});
			return;
		}

		setPending(true);
		try {
			const res = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: value }),
			});
			const data = (await res.json().catch(() => ({}))) as {
				ok?: boolean;
				alreadySubscribed?: boolean;
				error?: string;
			};

			if (!res.ok || !data.ok) {
				sileo.error({
					title: "No se pudo completar la suscripción",
					description:
						data.error ?? "Inténtalo de nuevo en un momento.",
				});
				return;
			}

			sileo.success({
				title: data.alreadySubscribed ? "Ya estabas en la lista" : "¡Hecho!",
				description: data.alreadySubscribed
					? "Te avisaremos cuando salga una nueva release."
					: "Te escribiremos cuando se publique una nueva release.",
			});
			setEmail("");
		} catch {
			sileo.error({
				title: "Sin conexión",
				description: "No se pudo contactar con el servidor. Revisa tu red e inténtalo otra vez.",
			});
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={submit} className="mt-4 flex items-center border-b border-ink/20 pb-1">
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.currentTarget.value)}
				placeholder="tu@correo.com"
				aria-label="Correo electrónico"
				disabled={pending}
				className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none disabled:opacity-60"
			/>
			<button
				type="submit"
				aria-label="Suscribirse"
				disabled={pending}
				className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-transform hover:translate-x-0.5 disabled:translate-x-0 disabled:opacity-50"
			>
				{pending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<ArrowRight className="h-4 w-4" />
				)}
			</button>
		</form>
	);
}
