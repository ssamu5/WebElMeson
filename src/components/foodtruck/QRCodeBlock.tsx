import QRCode from "qrcode";

interface Props {
  url: string;
  size?: number;
}

export default function QRCodeBlock({ url, size = 200 }: Props) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const modules = qr.modules;
  const count = modules.size;
  const cell = size / count;

  let path = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        path += `M${col * cell},${row * cell}h${cell}v${cell}h-${cell}z `;
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="bg-white p-3 rounded-lg shadow-[0_0_24px_rgba(232,24,154,0.25)]"
      role="img"
      aria-label="Código QR de la foodtruck"
    >
      <path d={path} fill="#0A0A0A" />
    </svg>
  );
}
