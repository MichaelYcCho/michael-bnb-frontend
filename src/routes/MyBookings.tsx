import {
    Box,
    Button,
    Grid,
    GridItem,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { Link } from "react-router-dom";
  import { getBookings, cancelBooking,  } from "../api";
  import { IBooking } from "../types";
  
  export default function MyBookings() {
    const { isLoading, data } = useQuery<IBooking[]>(["bookings"], getBookings);
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation(cancelBooking, {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Successfully canceled!",
          isClosable: true,
        });
        queryClient.refetchQueries(["bookings"]);
      },
    });
    const onClick = (id: number) => {
      mutation.mutate(id);
    };
    return (
      <Box mt={10} px={{
          base: 10,
          lg: 80,
        }}
      >
        <Text display={"block"} mb={8} as={"b"} fontSize={40}>
          My Bookings
        </Text>
        <Box mb={4}>
            {data?.length === 0 ? 
            <Text> 0건 </Text> :  
             <Text as={"b"} >{ data?.length } 건 </Text>
             }
        </Box>
        <Grid
          templateColumns={"5fr 2fr 2fr 2fr 2fr 2fr"}
          gap={3}
          w={"100%"}
          bgColor="gray.200"
          alignItems={"center"}
          justifyItems="center"
          borderTop={"1px solid gray"}
          borderBottom={"1px solid rgb(190,190,190)"}
          py={4}
          mb={2}
        >
          <GridItem as={"b"}>Room Name</GridItem>
          <GridItem as={"b"}>Price</GridItem>
          <GridItem as={"b"}>Guests</GridItem>
          <GridItem as={"b"}>Check In</GridItem>
          <GridItem as={"b"}>Check Out</GridItem>
          <GridItem as={"b"}>Available</GridItem>
        </Grid>
        {/* skeleton */}
        {data?.map((booking) => (
          <Grid
            key={booking.id}
            templateColumns={"5fr 2fr 2fr 2fr 2fr 2fr"}
            gap={3}
            w={"100%"}
            bgColor="white.200"
            alignItems={"center"}
            justifyItems="center"
            borderTop={"1px solid rgb(190,190,190)"}
            borderBottom={"1px solid rgb(190,190,190)"}
            py={3}
            mb={1}
          >
            <GridItem fontWeight={"400"} noOfLines={1}>
              <Link to={"/"}>
                <Text noOfLines={1} _hover={{ color: "red.500" }}>
                  {booking.room.name}
                </Text>
              </Link>
            </GridItem>
            <GridItem fontWeight={"400"}>₩{booking.room.price} / 박</GridItem>
            <GridItem fontWeight={"400"}>{booking.guests}명</GridItem>
            <GridItem fontWeight={"400"}>{booking.check_in}</GridItem>
            <GridItem fontWeight={"400"}>{booking.check_out}</GridItem>
            {booking.is_canceled ? (
                    <GridItem
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    color={"red.500"}
                    fontWeight={"400"}
                >
                    <Text>Canceled</Text>
                    <Button disabled mt={2}>
                    Cancel
                    </Button>
                </GridItem>
            ) : (
                <GridItem
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                color={"blue.500"}
                fontWeight={"400"}
              >
                <Text>Available</Text>
                <Button
                  onClick={() => onClick(booking.id)}
                  color={"red.500"}
                  mt={2}
                >
                  Cancel
                </Button>
              </GridItem>

            )}
          </Grid>
        ))}
      </Box>
    );
  }