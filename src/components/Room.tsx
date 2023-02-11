import { FaCamera, FaPencilAlt, FaRegHeart, FaStar, FaHeart } from "react-icons/fa";
import {
  Box,
  Button,
  Grid,
  HStack,
  Image,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import useUser from "../lib/useUser";
import { useMutation } from "@tanstack/react-query";
import { toggleWishList } from "../api";

interface IRoomProps {
  room_pk: number;
  image_url: string;
  name: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  is_owner: boolean;
}

export default function Room({
  room_pk,
  image_url,
  name,
  rating,
  city,
  country,
  price,
  is_owner,
}: IRoomProps) {
  
  const gray = useColorModeValue("gray.600", "gray.300");
  const navigate = useNavigate();
  const { user } = useUser();

  const onCameraClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/rooms/${room_pk}/photos`);
  };

  const onPencilClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/rooms/${room_pk}/update`);
    window.location.reload();
  };

  const toast = useToast();

  const wishMutation = useMutation(toggleWishList, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Welcome!",
        description: "하트뿅.",
        position: "bottom-right",
    });
      // queryClient.refetchQueries(["me"]);
      // queryClient.refetchQueries(["rooms"]);
      
      navigate("/");
    },
  });

  const onHeartClick = (room_pk: number) => {
    wishMutation.mutate(room_pk);
  }


  //    navigate(`/wishlists/toggle/${room_pk}`);
  


  return (
    <Link to={`/rooms/${room_pk}`}>
      <VStack alignItems={"flex-start"}>
        <Box
          w="100%"
          position="relative"
          overflow={"hidden"}
          mb={3}
          rounded="2xl"
        >
          {image_url ? (
            <Image minH="280" src={image_url} />
          ) : (
            <Box minH="280px" h="100%" w="100%" p={10} bg="green.400" />
          )}
          {is_owner && user?.is_host  ? (
              <Box>
                <Button
                  variant={"unstyled"}
                  position={"absolute"}
                  top={0}
                  right={10}
                  color="white"
                  onClick={onPencilClick}
                >
                  <FaPencilAlt size="20px" />
                </Button>
                <Button
                  variant={"unstyled"}
                  position={"absolute"}
                  top={0}
                  right={0}
                  color="white"
                  onClick={onCameraClick}
                >
                  <FaCamera size="20px" />
                </Button>
              </Box>
            ) : (
              <Button
                variant={"unstyled"}
                position={"absolute"}
                top={0}
                right={0}
                color="red.500"
                onClick={() => onHeartClick(room_pk)}
              >
                <FaRegHeart size="20px" />
              </Button>
            )}
        </Box>
        <Box>
          <Grid gap={2} templateColumns={"6fr 1fr"}>
            <Text display={"block"} as="b" noOfLines={1} fontSize="md">
              {name}
            </Text>

            <HStack spacing={1} alignItems="center">
              <FaStar size={12} />
              <Text fontSize={"sm"}>{rating}</Text>
            </HStack>
          </Grid>
          <Text fontSize={"sm"} color={gray}>
            {city}, {country}
          </Text>
        </Box>
        <Text fontSize={"sm"} color={gray}>
          <Text as="b">${price}</Text> / night
        </Text>
      </VStack>
    </Link>
  );
}