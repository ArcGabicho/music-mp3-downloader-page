import { Toaster } from "sileo";

/** Single shared toast viewport for every React island on the page. */
export default function ToasterMount() {
	return <Toaster position="bottom-right" theme="system" offset={20} />;
}