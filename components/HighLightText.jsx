export default function HighLightText({ text }) {
  return (
    <span className="text-4xl font-semibold font-inter bg-linear-to-br from-pink-400 via-red-400 to-red-700 inline-block text-transparent bg-clip-text capitalize">
      {text}
    </span>
  );
}
