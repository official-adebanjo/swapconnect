"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/hooks/useAuthToken";
import { API_URL } from "@/lib/config";
import Image from "next/image";

// interface Bank {
//   id: string;
//   name: string;
//   code: string;
// }

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  // const [bank, setBank] = useState(""); // ❌ Assigned but never used
  // const [accountNumber, setAccountNumber] = useState(""); // ❌ Assigned but never used
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [verificationDigits, setVerificationDigits] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // const [banks, setBanks] = useState<Bank[]>([]); // ❌ Assigned but never used
  // const [banksLoading, setBanksLoading] = useState(false); // ❌ Assigned but never used
  // const [banksLoaded, setBanksLoaded] = useState(false); // ❌ Assigned but never used
  const [description, setDescription] = useState("");

  const token = useAuthToken();
  const router = useRouter();

  // Persist inputRefs across renders
  const inputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
  ).current;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/wallet/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBalance(Number(data?.data?.wallet?.balance) || 0);
      } catch {
        setBalance(0);
      }
    };
    fetchBalance();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || !description) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      // const data = banks.find((b) => b.id == bank); // ❌ Assigned but never used
      const response = await fetch(`${API_URL}/transactions/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          // bankDetails: { accountNumber, bankCode: data?.code }, // ❌ Assigned but never used
          description,
        }),
      });

      if (!response.ok) throw new Error("Withdrawal failed. Please try again.");

      // setShowVerify(true); // Uncomment when verification flow is ready
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch banks if needed later
  /*
  useEffect(() => {
    if (!token || banksLoaded || banksLoading) return;
    const fetchBanks = async () => {
      setBanksLoading(true);
      try {
        const response = await fetch(`${API_URL}/transactions/banks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data?.banks)) {
          setBanks(data.banks);
        } else {
          setBanks([]);
        }
        setBanksLoaded(true);
      } catch {
        setBanks([]);
      } finally {
        setBanksLoading(false);
      }
    };
    fetchBanks();
  }, [token, banksLoaded, banksLoading]);
  */

  const handleDigitChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...verificationDigits];
    newDigits[index] = value;
    setVerificationDigits(newDigits);
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);
    const code = verificationDigits.join("");

    if (code.length !== 6) {
      setVerifyError("Please enter the 6-digit code.");
      setVerifying(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/transactions/withdraw/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok)
        throw new Error("Verification failed. Please try again.");

      setShowSuccess(true);
      setShowVerify(false);
    } catch (err) {
      setVerifyError((err as Error).message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        {/* Wallet Balance Card */}
        <div className="flex flex-col md:flex-row md:w-[350px] md:h-[223px] h-[168px] w-[280px] bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex md:flex-row justify-between">
            <div className="flex flex-col">
              <div className="text-[#848484] text-[15px] mb-2 font-medium">
                Wallet Balance
              </div>
              <div className="md:text-[32px] font-bold text-[#037F44] mb-6">
                {balance?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </div>
            </div>
            <Image
              src="/Sketch.png"
              alt="Wallet illustration"
              width={60}
              height={60}
              className="md:w-[200px] md:h-[200px]"
            />
          </div>
        </div>

        {/* Verification Modal */}
        {showVerify && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
              <div className="text-2xl font-semibold mb-2 text-[#037F44]">
                Please check your email.
              </div>
              <div className="mb-4 text-[#353535]">
                We&apos;ve sent a 6-digit code to your email to verify your
                withdrawal.
              </div>
              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <div className="flex justify-center gap-2 mb-2">
                  {verificationDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-12 border rounded text-center text-xl font-bold focus:outline-[#037F44]"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    />
                  ))}
                </div>
                {verifyError && (
                  <div className="text-red-600 text-sm">{verifyError}</div>
                )}
                <button
                  type="submit"
                  className="bg-[#037F44] text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
                  disabled={verifying}
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>
                <button
                  type="button"
                  className="text-[#037F44] underline mt-2"
                  onClick={() => setShowVerify(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-lg font-semibold mb-4 text-[#037F44]">
                Withdrawal Verified Successfully!
              </div>
              <button
                className="bg-[#037F44] text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
                onClick={() => router.push("/dashboard/wallet")}
              >
                Back to Wallet
              </button>
            </div>
          </div>
        )}

        {/* Withdraw Form */}
        {!showVerify && !showSuccess && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
              <label className="block text-[#353535] mb-1 font-medium">
                Amount
              </label>
              <input
                type="number"
                min="1"
                className="w-full border rounded px-3 py-2"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                required
              />
            </div>

            {/* Bank Fields - commented out */}
            {/*
            <div>
              <label className="block text-[#353535] mb-1 font-medium">Bank</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
              >
                <option value="">{banksLoading ? "Loading..." : "Select your bank"}</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#353535] mb-1 font-medium">Account Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
                required
              />
            </div>
            */}

            <div>
              <label className="block text-[#353535] mb-1 font-medium">
                Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter withdrawal description"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#037F44] text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
