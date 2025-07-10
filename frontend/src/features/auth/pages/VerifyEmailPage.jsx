import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { handleVerifyEmail } from "../api/authAPI";
import SpinLoader from "@/features/shared/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      try {
        setError(false);
        const result = await handleVerifyEmail(token);
        console.log("WHAT RESULT : ", result);
        if (!result.success) {
          setError(result.error);
          return;
        }
        toast(
          result.data.message ||
            "Something went wrong while verifying email."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(true);
        console.error("Email verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10 flex-col">
        <SpinLoader />
        <span>Verifying</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10 flex-col gap-2">
        <span>{error || "Something went wrong while verifying email"}</span>
        <Button>
          <NavLink to="/login">Go to login page</NavLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10 flex-col gap-2">
      Email verification completed.
    </div>
  );
};

export default VerifyEmailPage;
