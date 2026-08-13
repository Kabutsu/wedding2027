import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

type Step = "closed" | "open" | "submittingMonzo" ;

type Props = {
  itemId: string;
  title: string;
  description: string;
  suggestedPrice: number;
  image: string;
};

export default function RegistryItemCard({
  itemId,
  title,
  description,
  suggestedPrice,
  image,
}: Props): ComponentChildren {
  const [step, setStep] = useState<Step>("closed");
  const [amount, setAmount] = useState(String(suggestedPrice));
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const monzoBaseLink = import.meta.env.PUBLIC_MONZO_ME_LINK;

  const reset = () => {
    setStep("closed");
    setAmount(String(suggestedPrice));
    setName("");
    setMessage("");
    setError("");
  };

  const handlePayByMonzo = async () => {
    setError("");
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!monzoBaseLink) {
      setError("Monzo payments aren't configured yet");
      return;
    }

    setStep("submittingMonzo");

    try {
      const response = await fetch("/api/submit-contribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemTitle: title,
          amount: parsedAmount,
          name,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save contribution");
        setStep("open");
        return;
      }

      window.dispatchEvent(new CustomEvent("contributionSuccess"));
      
      const monzoUrl = `${monzoBaseLink}/${parsedAmount}?d=${encodeURIComponent(title)}`;
      window.open(monzoUrl, "_blank", "noopener,noreferrer");
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      setStep("open");
    }
  };

  return (
    <>
      <div class="relative w-full max-w-80 bg-orange-pastel-light rounded-2xl border-orange-pastel-light border-4 shadow-lg overflow-hidden flex flex-col transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
        <div class="w-full h-auto aspect-4/3 overflow-hidden rounded-lg">
          <img src={image} alt={title} class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col items-center gap-2 p-5 flex-1">
          <h3 class="sm:h-12 sm:mb-1 text-xl font-bold font-(family-name:--font-roca) text-purple-pastel text-center text-pretty">
            {title}
          </h3>
          <p class="text-center text-sm text-mauve-950 text-pretty flex-1">{description}</p>
          <p class="font-semibold text-purple-pastel-dark">
            From £{suggestedPrice}
          </p>
          <button
            type="button"
            onClick={() => setStep("open")}
            class="mt-2 px-6 py-2 cursor-pointer bg-purple-pastel text-white font-(family-name:--font-providence) rounded-full text-lg hover:bg-purple-pastel-dark/90 transition-colors duration-300"
          >
            Contribute
          </button>
        </div>
      </div>

      {step !== "closed" && (
        <div class="fixed inset-0 z-50 bg-mauve-950/60 flex items-center justify-center p-4">
          <div class="relative font-(family-name:--font-inter) w-full max-w-md bg-orange-pastel-light rounded-2xl border-orange-pastel-light border-4 shadow-lg overflow-hidden p-6 flex flex-col gap-4">
            {step === "open" && (
              <>
                <h3 class="text-2xl font-bold font-(family-name:--font-roca) text-purple-pastel">
                  {title}
                </h3>
                <p class="text-mauve-950 text-sm">{description}</p>

                <div class="flex flex-col gap-2">
                  <label
                    htmlFor={`amount-${itemId}`}
                    class="font-semibold text-purple-pastel text-sm"
                  >
                    Amount (£)
                  </label>
                  <input
                    id={`amount-${itemId}`}
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onInput={(e) => setAmount((e.target as HTMLInputElement).value)}
                    class="px-4 py-3 border-2 border-mauve-300 rounded-lg focus:outline-none focus:border-purple-pastel transition-colors bg-white text-mauve-950"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label
                    htmlFor={`name-${itemId}`}
                    class="font-semibold text-purple-pastel text-sm"
                  >
                    Your Name
                  </label>
                  <input
                    id={`name-${itemId}`}
                    type="text"
                    value={name}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    placeholder="Tell us your name..."
                    required
                    class="px-4 py-3 border-2 border-mauve-300 rounded-lg focus:outline-none focus:border-purple-pastel transition-colors bg-white text-mauve-950"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label
                    htmlFor={`message-${itemId}`}
                    class="font-semibold text-purple-pastel text-sm"
                  >
                    Message (optional)
                  </label>
                  <textarea
                    id={`message-${itemId}`}
                    value={message}
                    onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
                    placeholder="Leave us a note..."
                    class="px-4 py-3 border-2 border-mauve-300 rounded-lg focus:outline-none focus:border-purple-pastel transition-colors bg-white text-mauve-950 h-24 resize-none"
                  />
                </div>

                {error && (
                  <div class="bg-purple-pastel/30 border border-purple-pastel text-purple-pastel-dark px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div class="flex flex-col items-center gap-3 font-(family-name:--font-providence)">
                  <button
                    type="button"
                    onClick={handlePayByMonzo}
                    class="px-6 py-3 w-full lg:max-w-64 cursor-pointer bg-purple-pastel text-white rounded-full text-lg hover:bg-purple-pastel-dark/90 transition-colors duration-300 font-semibold"
                  >
                    Pay with Monzo
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    class="px-6 py-2 w-full lg:max-w-64 cursor-pointer text-mauve-700 text-base hover:text-mauve-950 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}


            {step === "submittingMonzo" && (
              <div class="flex flex-col items-center justify-center gap-6 py-8">
                <div class="w-12 h-12 border-4 border-mauve-200 border-t-purple-pastel rounded-full animate-spin"></div>
                <p class="text-center text-lg font-(family-name:--font-roca) text-purple-pastel font-semibold">
                  Opening Monzo...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
