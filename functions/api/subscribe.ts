// Cloudflare Pages Function: POST /api/subscribe
//
// Guarda el correo de quien quiere recibir avisos de nuevas versiones de
// Music MP3 Downloader. Los correos se persisten en un KV namespace con el
// binding `SUBSCRIBERS` (configúralo en Pages → Settings → Functions →
// KV namespace bindings, o en wrangler.toml para `wrangler pages dev`).
//
// El envío del aviso en sí (cuando sale una release) lo hace un job aparte
// que lee este KV; aquí solo se captura la suscripción.

interface KVNamespace {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<void>;
	list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

interface Env {
	SUBSCRIBERS?: KVNamespace;
}

interface EventContext {
	request: Request;
	env: Env;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" },
	});
}

export async function onRequestPost({ request, env }: EventContext): Promise<Response> {
	let email = "";
	try {
		const body = (await request.json()) as { email?: unknown };
		email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
	} catch {
		return json({ error: "El cuerpo de la petición no es JSON válido." }, 400);
	}

	if (!EMAIL.test(email) || email.length > 254) {
		return json({ error: "Introduce una dirección de correo válida." }, 422);
	}

	if (!env.SUBSCRIBERS) {
		return json(
			{ error: "El servicio de avisos no está configurado todavía." },
			503,
		);
	}

	const key = `sub:${email}`;
	if (await env.SUBSCRIBERS.get(key)) {
		return json({ ok: true, alreadySubscribed: true });
	}

	await env.SUBSCRIBERS.put(
		key,
		JSON.stringify({
			email,
			subscribedAt: new Date().toISOString(),
			userAgent: request.headers.get("user-agent"),
		}),
	);

	return json({ ok: true, alreadySubscribed: false });
}

// Cualquier método que no sea POST.
export function onRequest(): Response {
	return json({ error: "Usa POST para suscribirte." }, 405);
}
