import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Smartphone, Upload } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [amount, setAmount] = useState("500.00");
  const [referenceId, setReferenceId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment gateway details
  const PAYMENT_CONFIG = {
    beneficiaryName: "MD ISMAIL HOSSEN",
    mobileNumber: "01863211541",
    paymentMethod: "BKASH NAGD",
    currency: "BDT"
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPG, PNG, or WEBP files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5 MB");
        return;
      }
      setScreenshot(file);
      toast.success("Screenshot uploaded successfully");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!referenceId.trim()) {
      toast.error("Please enter transaction/reference ID");
      return;
    }

    if (!paymentDate) {
      toast.error("Please select payment date");
      return;
    }

    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Payment details submitted successfully!");
      console.log({
        paymentMethod,
        amount,
        referenceId,
        paymentDate,
        screenshotName: screenshot.name,
      });
      // Reset form
      setReferenceId("");
      setPaymentDate("");
      setScreenshot(null);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090d] text-[#f8f7f3] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Payment Instructions */}
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f15] rounded-xl border border-white/10 p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-6 h-6 text-[#ffc107]" />
              <h2 className="text-2xl font-semibold">Mobile Payment</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-[#ffc107] tracking-wider">
                  PAYMENT METHOD
                </label>
                <p className="text-3xl font-semibold mt-2">{PAYMENT_CONFIG.paymentMethod}</p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <label className="text-xs font-semibold text-[#999] tracking-wider block mb-2">
                  Beneficiary
                </label>
                <p className="text-lg font-medium text-white">{PAYMENT_CONFIG.beneficiaryName}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#999] tracking-wider block mb-2">
                  Mobile payment number
                </label>
                <p className="text-xl font-semibold text-[#ff6b6b] tracking-wider">
                  {PAYMENT_CONFIG.mobileNumber}
                </p>
              </div>

              <div className="mt-8 p-4 bg-[#222]/50 rounded-lg border border-[#444]/30">
                <p className="text-xs text-[#999] leading-relaxed">
                  Transfer only after confirming the payment instructions are suitable for your situation and lawful where you are located.
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#666]">
                <span className="text-[#666] mt-1">⚠️</span>
                <p>
                  Predictions and tips are for informational and entertainment purposes only. No prediction can guarantee a winning result. Users should participate responsibly and comply with applicable laws and age requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Payment Form */}
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f15] rounded-xl border border-white/10 p-8">
            <h3 className="text-xl font-semibold mb-6">Submit Payment Details</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method */}
              <div>
                <Label className="text-xs font-semibold text-white/70 mb-2 block">
                  PAYMENT METHOD
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-[#0f0f15] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a24] border-white/10">
                    <SelectItem value="mobile">Mobile payment</SelectItem>
                    <SelectItem value="bank">Bank transfer</SelectItem>
                    <SelectItem value="card">Card payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div>
                <Label className="text-xs font-semibold text-white/70 mb-2 block">
                  AMOUNT (BDT)
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500.00"
                  className="bg-[#0f0f15] border-white/10 text-white"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Reference ID */}
              <div>
                <Label className="text-xs font-semibold text-white/70 mb-2 block">
                  TRANSACTION / REFERENCE ID
                </Label>
                <Input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="Enter your payment reference"
                  className="bg-[#0f0f15] border-white/10 text-white"
                />
              </div>

              {/* Payment Date */}
              <div>
                <Label className="text-xs font-semibold text-white/70 mb-2 block">
                  PAYMENT DATE
                </Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="bg-[#0f0f15] border-white/10 text-white"
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <Label className="text-xs font-semibold text-white/70 mb-2 block">
                  PAYMENT SCREENSHOT
                </Label>
                <label className="block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <div className="bg-[#0f0f15] border border-white/10 rounded-lg p-4 cursor-pointer hover:border-white/20 transition">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-white/50" />
                      <span className="text-sm text-white/60">
                        {screenshot ? screenshot.name : "Browse... No file selected."}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      JPG, PNG or WEBP only. Maximum 5 MB. The file is stored privately for manual verification.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ffc107] hover:bg-[#ffb300] text-black font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? "SUBMITTING..." : "I HAVE COMPLETED PAYMENT"}
              </Button>

              {/* Status Message */}
              <p className="text-xs text-white/40 text-center mt-4">
                No payment submission has been recorded for this account. Submit payment details only after completing a real payment.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
