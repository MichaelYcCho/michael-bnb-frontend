import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogIn } from "../api";

export default function KakaoConfirm() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { search } = useLocation();

  const mutation = useMutation(kakaoLogIn, {
    onMutate: () => {
      console.log("start mutation");
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: "Welcome!",
        description: "Happy to have you back!",
      });
      // 빠르게 header를 바꿔주기 위함(refetch)
      // navigate를 통해 home으로 redirect
      queryClient.refetchQueries(["me"]);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    if (code) {
      mutation.mutate(code);
      // const status = await kakaoLogIn(code);
      // if (status === 200) {
      //   toast({
      //     status: "success",
      //     title: "Welcome!",
      //     description: "Happy to have you back!",
      //   });
      //   // 빠르게 header를 바꿔주기 위함
      //   queryClient.refetchQueries(["me"]);
      //   // redirect to home
      //   navigate("/");
      // }
    }
  };
  useEffect(() => {
    confirmLogin();
  }, []);
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Processing log in...</Heading>
      <Text>Don't go anywhere.</Text>
      <Spinner size={"lg"} />
    </VStack>
  );
}