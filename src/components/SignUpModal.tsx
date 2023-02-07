
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaUserAlt, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { userSignUp } from "../api";

import SocialLogin from "./SocialLogin";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  name: string;
  username: string;
  password: string;
  email: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
  } = useForm<IForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(userSignUp, {
      onSuccess: () => {
          toast({
              status: "success",
              title: "Welcome!",
              description: "회원가입 되었습니다.",
              position: "bottom-right",
          });
          onClose();
          reset();
          queryClient.refetchQueries(["me"]);
      },
      onError: () => {
          toast({
              status: "error",
              title: "Error!",
              description: "가입을하지 못했습니다",
              position: "bottom-right",
          });
      },
  });
  const onSubmit = ({ name, username, password, email }: IForm) =>
      mutation.mutate({ name, username, password, email });

  return (
      <Modal onClose={onClose} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
              <ModalHeader>Sign Up</ModalHeader>
              <ModalCloseButton />
              <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
                  <VStack>
                      <InputGroup>
                          <InputLeftElement
                              children={
                                  <Box color={"gray.500"}>
                                      <FaUserPlus />
                                  </Box>
                              }
                          />
                          <Input
                              isInvalid={Boolean(errors.name?.message)}
                              required
                              {...register("name", {
                                  required: "name을 작성해주세요.",
                              })}
                              variant={"filled"}
                              placeholder="name"
                          ></Input>
                      </InputGroup>
                      <InputGroup>
                          <InputLeftElement
                              children={
                                  <Box color={"gray.500"}>
                                      <FaUserAlt />
                                  </Box>
                              }
                          />
                          <Input
                              isInvalid={Boolean(errors.username?.message)}
                              required
                              {...register("username", {
                                  required: "username을 작성해주세요.",
                              })}
                              variant={"filled"}
                              placeholder="username"
                          ></Input>
                      </InputGroup>
                      <InputGroup>
                          <InputLeftElement
                              children={
                                  <Box color={"gray.500"}>
                                      <FaEnvelope />
                                  </Box>
                              }
                          />
                          <Input
                              isInvalid={Boolean(errors.email?.message)}
                              required
                              {...register("email", {
                                  required: "email을 작성해주세요.",
                              })}
                              variant={"filled"}
                              type="email"
                              placeholder="email"
                          ></Input>
                      </InputGroup>
                      <InputGroup>
                          <InputLeftElement
                              children={
                                  <Box color={"gray.500"}>
                                      <FaLock />
                                  </Box>
                              }
                          />
                          <Input
                              isInvalid={Boolean(errors.password?.message)}
                              required
                              {...register("password", {
                                  required: "password를 작성해주세요.",
                              })}
                              type="password"
                              variant={"filled"}
                              placeholder="password"
                          ></Input>
                      </InputGroup>
                  </VStack>
                  <LightMode>
                      <Button
                          isLoading={mutation.isLoading}
                          type="submit"
                          colorScheme={"red"}
                          w={"100%"}
                          mt={4}
                      >
                          Sign Up
                      </Button>
                  </LightMode>
                  <SocialLogin />
              </ModalBody>
          </ModalContent>
      </Modal>
  );
}