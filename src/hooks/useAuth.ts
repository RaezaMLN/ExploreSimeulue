import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("admin");

    if (!admin) {
      router.push("/auth/signin");
    }
  }, [router]);
};

export default useAuth;
