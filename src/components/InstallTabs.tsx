import { useState } from "react";
import { sileo } from "sileo";
import { Check, Copy, Terminal } from "lucide-react";

const TABS = [
	{
		id: "arch",
		label: "Arch / CachyOS",
		cmd: "yay -S music-mp3-downloader-bin",
		note: "Requiere el helper de AUR yay y el paquete vlc (libvlc) para reproducir. yt-dlp y ffmpeg vienen incluidos. Descarga el binario de la última release y lo deja en el PATH con entrada en el menú.",
	},
	{
		id: "windows",
		label: "Windows",
		cmd: 'iwr https://github.com/ArcGabicho/music-mp3-downloader/releases/latest/download/MusicMp3Downloader-Setup-x64.exe -OutFile MusicMp3Downloader-Setup.exe; .\\MusicMp3Downloader-Setup.exe',
		note: "Windows 10 / 11 con conexión a internet. Instalación por usuario, sin permisos de administrador. El ejecutable no está firmado: si SmartScreen avisa, elige «Más información → Ejecutar de todas formas».",
	},
] as const;

export default function InstallTabs() {
	const [active, setActive] = useState<(typeof TABS)[number]["id"]>("arch");
	const [copied, setCopied] = useState(false);
	const tab = TABS.find((t) => t.id === active)!;

	async function copy() {
		try {
			await navigator.clipboard.writeText(tab.cmd);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			sileo.success({
				title: "Comando copiado",
				description: "Pégalo en tu terminal para instalar la app.",
			});
		} catch {
			sileo.error({
				title: "No se pudo copiar",
				description: "Copia el comando manualmente desde el recuadro.",
			});
		}
	}

	return (
		<div className="w-full max-w-3xl">
			<div className="flex gap-1 rounded-full border border-white/15 bg-white/6 p-1">
				{TABS.map((t) => (
					<button
						key={t.id}
						onClick={() => setActive(t.id)}
						className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
							active === t.id
								? "bg-white text-ink"
								: "text-white/60 hover:text-white"
						}`}
					>
						{t.label}
					</button>
				))}
			</div>

			<div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-[#0c0c0c]">
				<div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 text-white/40 sm:px-4">
					<Terminal className="h-3.5 w-3.5 shrink-0" />
					<span className="font-mono text-[0.7rem]">
						{active === "windows" ? "PowerShell" : "bash"}
					</span>
					<button
						onClick={copy}
						className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}
						{copied ? "Copiado" : "Copiar"}
					</button>
				</div>
				<pre className="overflow-x-auto px-3 py-4 font-mono text-[0.72rem] leading-relaxed text-white/90 sm:px-4 sm:text-[0.8rem]">
					<span className="mr-2 select-none text-white/40">$</span>
					{tab.cmd}
				</pre>
			</div>

			<p className="mt-3 text-xs leading-relaxed text-white/50">{tab.note}</p>
		</div>
	);
}