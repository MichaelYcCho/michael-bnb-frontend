import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../lib/useUser";

export default function useHostOnlyPage() {
  const { user, userLoading } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    if (!userLoading) {
      if (!user?.is_host) {
        toast({
          title: "Need Host Mode",
          description: "Change your mode to host mode",
          status: "error",
          duration: 5000,
          isClosable: true,
        });


        navigate("/");
      }
    }
  }, [userLoading, user, navigate]);
  return;
}