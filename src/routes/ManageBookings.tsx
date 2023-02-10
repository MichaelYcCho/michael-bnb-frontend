import { Box, Button, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getManageBookings } from "../api";
import { IManageBooking } from "../types";


export default function () {
  const { isLoading, data } = useQuery<IManageBooking[]>(
    ["manageBookings"],
    getManageBookings
  );
  return (
    <Box
      mt={10}
      px={{
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
        <GridItem as={"b"}>Booked by</GridItem>
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
          py={6}
          mb={1}
        >
          <GridItem fontWeight={"400"} noOfLines={1}>
            <Link>
              <Text noOfLines={1} _hover={{ color: "red.500" }}>
                {booking.room.name}
              </Text>
            </Link>
          </GridItem>
          <GridItem
            fontWeight={"400"}
            display="flex"
            flexDirection={"column"}
            alignItems="center"
          >
            <Box>
              <Text>{booking.user.name}</Text>
            </Box>
            <Box>
              <Text>{booking.user.phone}</Text>
            </Box>
          </GridItem>
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

                </GridItem>
            ) : (
                <GridItem
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                color={"blue.500"}
                fontWeight={"400"}
              >
                <Text>Reserved</Text>

              </GridItem>

            )}
        </Grid>
      ))}
    </Box>
  );
}