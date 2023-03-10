import {FaMoon, FaSun } from "react-icons/fa";
import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  ToastId,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { changeMode, logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function Header() {
  const { userLoading, isLoggedIn, user } = useUser();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const logoColor = useColorModeValue("red.500", "red.200");
  const Icon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toastId = useRef<ToastId>();
  const logOutMutation = useMutation(logOut, {
    onMutate: () => {
      toastId.current = toast({
        title: "Login out...",
        description: "Sad to see you go...",
        status: "loading",
        duration: 10000,
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "Done!",
          description: "See you later!",
        });
      }
      queryClient.refetchQueries(["me"]);
      queryClient.refetchQueries(["rooms"]);
      
      navigate("/");
    },
  });
  const onLogOut = async () => {
    logOutMutation.mutate();
  };

  const changeModeMutation = useMutation(changeMode, {
    onSuccess: () => {
        const user_mode = user?.is_host ? "GUEST" : "HOST";

        toast({
          status: "success",
          title: "Change Mode",
          description: `It's ${user_mode} Mode!`,
      });
      queryClient.refetchQueries(["me"]);
      queryClient.refetchQueries(["rooms"]);
      navigate("/");
    },
  });

  const onChangeMode = async () => {
    changeModeMutation.mutate();
  };
  
  const goSwagger = () => {
    window.open(`${process.env.REACT_APP_SWAGGER}`, "_blank");
  };

  return (
    <Stack
      justifyContent={"space-between"}
      alignItems="center"
      py={5}
      px={40}
      direction={{
        sm: "column",
        md: "row",
      }}
      spacing={{
        sm: 4,
        md: 0,
      }}
      borderBottomWidth={1}
    >
      <Box color={logoColor}>
        <Link to={"/"}>
          <Image height="12" src={`https://imagedelivery.net/${process.env.REACT_APP_CF_HASH}/e45bda2b-d632-42b6-b73f-f576504eca00/public`} />
        </Link>
      </Box>
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={<Icon />}
        />

          <Button onClick={goSwagger}>Swagger</Button>
     
        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button onClick={onLoginOpen}>Log in</Button>
              <LightMode>
                <Button onClick={onSignUpOpen} colorScheme={"red"}>
                  Sign up
                </Button>
              </LightMode>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar name={user?.name} src={user?.avatar} size={"md"} />
              </MenuButton>
              <MenuList>
                {user?.is_host ? (
                    <>
                      <MenuItem onClick={onChangeMode}>Change Guest Mode</MenuItem>
                      <Link to="/bookings/manage">
                        <MenuItem>Manage Bookings</MenuItem>
                      </Link>
                      <Link to="/rooms/create">
                        <MenuItem>Create Room</MenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={onChangeMode}>Change Host Mode</MenuItem>
                      <Link to="/bookings/my">
                        <MenuItem>My Bookings</MenuItem>
                      </Link>
                    </>
                  )
                }
                <MenuItem onClick={onLogOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}