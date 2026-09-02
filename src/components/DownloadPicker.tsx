import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";
import { Check, ChevronDown, Copy, Download } from "lucide-react";

const REPO = "https://github.com/ArcGabicho/music-mp3-downloader";
const RELEASE = "v0.1.0";
const DL = `${REPO}/releases/download/${RELEASE}`;

type Build = {
	id: string;
	os: "Windows" | "macOS" | "Linux";
	label: string;
	file: string;
	size: string;
	sha256: string;
	note: string;
};

const BUILDS: Build[] = [
	{
		id: "win-setup",
		os: "Windows",
		label: "Windows · Instalador (.exe)",
		file: "MusicMp3Downloader-Setup-0.1.0-x64.exe",
		size: "144 MB",
		sha256: "f53350e6fa52ce717335d94e1351dc8bc0baf718c919b0312c794b517aada5af",
		note: "Windows 10 / 11 · instalación por usuario, sin permisos de administrador.",
	},
	{
		id: "win-zip",
		os: "Windows",
		label: "Windows · Portable (.zip)",
		file: "MusicMp3Downloader-0.1.0-win-x64.zip",
		size: "214 MB",
		sha256: "39c19839dec7518198a605c228b39b5640eb79d318ccdb6d53dad537310d932c",
		note: "Sin instalador: descomprime y ejecuta el .exe directamente.",
	},
	{
		id: "linux-x64",
		os: "Linux",
		label: "Linux · x64 (.tar.gz)",
		file: "MusicMp3Downloader-0.1.0-linux-x64.tar.gz",
		size: "110 MB",
		sha256: "e8e2f6365b1f88c8bd14c8a5bea66d1e693e1ac5460a31d5fa31a8a86a80b131",
		note: "Necesita vlc (libvlc). En Arch / CachyOS: yay -S music-mp3-downloader-bin.",
	},
	{
		id: "osx-arm64",
		os: "macOS",
		label: "macOS · Apple Silicon (.tar.gz)",
		file: "MusicMp3Downloader-0.1.0-osx-arm64.tar.gz",
		size: "121 MB",
		sha256: "53adcc82f2e10bda4e89e5b878d860f3542e158002e77ca8a5805c0832339e8b",
		note: "macOS 12 o superior · arm64 (chip M1 en adelante).",
	},
];

function detectBuildId(): string {
	if (typeof navigator === "undefined") return BUILDS[0].id;
	const hint = `${navigator.userAgent} ${navigator.platform ?? ""}`;
	if (/mac|iphone|ipad/i.test(hint)) return "osx-arm64";
	if (/linux|x11|cros/i.test(hint) && !/android/i.test(hint)) return "linux-x64";
	return "win-setup";
}

export default function DownloadPicker() {
	const [id, setId] = useState<string>(BUILDS[0].id);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setId(detectBuildId());
	}, []);

	const build = useMemo(
		() => BUILDS.find((b) => b.id === id) ?? BUILDS[0],
		[id],
	);
	const href = `${DL}/${build.file}`;

	function onDownload() {
		sileo.success({
			title: `Descargando · MusicMp3Downloader ${RELEASE.replace("v", "")}`,
			description: `${build.label} · ${build.size}. Si no arranca, revisa la carpeta de descargas.`,
			button: {
				title: "Ver instalación",
				onClick: () =>
					document
						.getElementById("instalacion")
						?.scrollIntoView({ behavior: "smooth" }),
			},
		});
	}

	async function copySha() {
		try {
			await navigator.clipboard.writeText(build.sha256);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			sileo.success({
				title: "SHA-256 copiado",
				description: "Compáralo con el hash del archivo descargado.",
			});
		} catch {
			sileo.error({
				title: "No se pudo copiar",
				description: "Copia el hash manualmente desde el recuadro.",
			});
		}
	}

	return (
		<div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-2 backdrop-blur-md">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<label className="relative flex min-w-0 flex-1 items-center">
					<select
						value={id}
						onChange={(e) => setId(e.currentTarget.value)}
						aria-label="Elige qué descargar"
						className="w-full min-w-0 appearance-none rounded-full bg-white/10 py-3.5 pr-10 pl-5 text-sm font-medium text-white focus:outline-none"
					>
						{BUILDS.map((b) => (
							<option key={b.id} value={b.id} className="text-ink">
								{b.label} — {b.size}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-white/60" />
				</label>

				<a
					href={href}
					target="_blank"
					rel="noopener"
					onClick={onDownload}
					className="btn btn-light h-13 w-full shrink-0 px-6 sm:w-auto"
				>
					<Download className="h-4 w-4" />
					Descargar
				</a>
			</div>

			<div className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<p className="text-xs leading-relaxed text-white/55 sm:max-w-sm">
					{build.note}
				</p>
				<button
					type="button"
					onClick={copySha}
					title="Copiar SHA-256"
					className="inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[0.68rem] text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
				>
					{copied ? (
						<Check className="h-3.5 w-3.5 shrink-0" />
					) : (
						<Copy className="h-3.5 w-3.5 shrink-0" />
					)}
					<span className="max-w-[62vw] truncate sm:max-w-[22rem]">
						{build.sha256}
					</span>
				</button>
			</div>

			<a
				href={`${REPO}/releases/tag/${RELEASE}`}
				target="_blank"
				rel="noopener"
				className="block px-4 pb-2 text-xs font-medium text-white/50 transition-colors hover:text-white"
			>
				Ver todas las descargas y checksums de {RELEASE} →
			</a>
		</div>
	);
}
