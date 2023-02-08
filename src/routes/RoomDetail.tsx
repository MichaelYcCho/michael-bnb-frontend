import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FaPencilAlt, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
    checkBooking,
    getAmenities,
    getRoom,
    getRoomAmenities,
    getRoomReviews,
    roomBooking,
} from "../api";
import { IAmenity, IRoomDetail, IRoomReview } from "../types";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendar.css";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { formatDate } from "../lib/utils";
import useUser from "../lib/useUser";

export default function RoomDetail() {
  const {reset, watch } = useForm();
  const navigate = useNavigate();
  const { roomPk } = useParams();
  const { user } = useUser();
  const { isLoading, data } = useQuery<IRoomDetail>([`rooms`, roomPk], getRoom);
  const { data: reviewsData } = useQuery<IRoomReview[]>([`rooms`, roomPk, `reviews`], getRoomReviews);
  const { data: amenities, isLoading: isAmenitiesLoading } = useQuery<IAmenity[]>([`rooms`, roomPk, `amenities`], getRoomAmenities);
  const [dates, setDates] = useState<Date[]>();

  // dates: 사용자가 선택한 날짜 => dates가 바뀔때마다 해당 로직이 실행됨
  // enabled : Query가 자동으로 실행되지않고, 수동실행시키는 것이다. state가 undefined이 아니다 -> 사용자가 날짜를 선택 -> 쿼리 재실행
  const { data: checkBookingData, isLoading: isCheckingBooking } = useQuery(
    ["check", roomPk, dates],
    checkBooking,
    {
      cacheTime: 0,
      enabled: dates !== undefined,
    }
  );

  const toast = useToast();
    const mutation = useMutation(roomBooking, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Booking create",
                description: "예약이 완료되었습니다.",
                position: "bottom-right",
            });
            reset();
        },
    });
    const onSubmit = () => {
        if (!user) {
            toast({
                status: "error",
                title: "Please Log In",
                description: "로그인 해주세요",
                position: "bottom-right",
            });
        }
        if (roomPk && dates && user) {
            const [firstDate, secondDate] = dates;
            const checkIn = formatDate(firstDate);
            const checkOut = formatDate(secondDate);
            const guests = watch("guests");
            mutation.mutate({ checkIn, checkOut, roomPk, guests });
        }
        reset();
    };
    const onEditClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(`/rooms/${roomPk}/update`);
    };
  return (
    <Box
      pb={40}
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Helmet>
        <title>{data ? data.name : "Loading..."}</title>
      </Helmet>
      <HStack>
          <Skeleton
              height={"43px"}
              w={!isLoading ? "100%" : " 40%"}
              isLoaded={!isLoading}
          >
              <Heading>{data?.name}</Heading>
          </Skeleton>
          {data?.is_owner ? (
              <Button onClick={onEditClick}>
                  <FaPencilAlt />
              </Button>
          ) : null}
      </HStack>
      <Grid
        mt={8}
        rounded="xl"
        overflow={"hidden"}
        gap={2}
        height="60vh"
        templateRows={"1fr 1fr"}
        templateColumns={"repeat(4, 1fr)"}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <GridItem
            colSpan={index === 0 ? 2 : 1}
            rowSpan={index === 0 ? 2 : 1}
            overflow={"hidden"}
            key={index}
          >
            <Skeleton isLoaded={!isLoading} h="100%" w="100%">
              {data?.photos && data.photos.length > 4 ? (
                <Image
                  objectFit={"cover"}
                  w="100%"
                  h="100%"
                  src={data?.photos[index].file}
                />
              ) : null}
            </Skeleton>
          </GridItem>
        ))}
      </Grid>
      <Grid gap={60} templateColumns={"2fr 1fr"}>
        <Box>
          <HStack mt={10} mb={10} justifyContent={"space-between"}>
            <VStack alignItems={"flex-start"}>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <Heading fontSize={"2xl"}>
                  House hosted by {data?.owner.name}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <HStack justifyContent={"flex-start"} w="100%">
                  <Text>
                    {data?.toilets} toliet{data?.toilets === 1 ? "" : "s"}
                  </Text>
                  <Text>∙</Text>
                  <Text>
                    {data?.rooms} room{data?.rooms === 1 ? "" : "s"}
                  </Text>
                </HStack>
              </Skeleton>
            </VStack>
            <Avatar
              name={data?.owner.name}
              size={"xl"}
              src={data?.owner.avatar}
            />
          </HStack>

          <hr />
            <Box mt={10} mb={10}>
                <VStack alignItems={"flex-start"} spacing={10}>
                    <Text>{data?.description}</Text>
                    <Text fontSize={"3xl"}>{data?.category.name}</Text>
                </VStack>
            </Box>
            <hr />
            <Box mt={10} mb={10}>
                <Heading mb={10}>숙소 편의 시설</Heading>
                <Grid
                    templateRows={"1fr 1fr"}
                    templateColumns={"repeat(2, 1fr)"}
                >
                    {amenities?.map((amenity) => (
                        <GridItem gap={60} key={amenity.pk}>
                            <Text fontSize={"2xl"} color={"red.400"}>
                                {amenity.name}
                            </Text>
                            <Text>{amenity.description}</Text>
                        </GridItem>
                    ))}
                </Grid>
            </Box>
          <hr />

          <Box mt={10}>
            <Heading mb={5} fontSize={"2xl"}>
              <HStack>
                <FaStar /> <Text>{data?.rating}</Text>
                <Text>∙</Text>
                <Text>
                  {reviewsData?.length} review
                  {reviewsData?.length === 1 ? "" : "s"}
                </Text>
              </HStack>
            </Heading>
            <Container mt={16} maxW="container.lg" marginX="none">
              <Grid gap={10} templateColumns={"1fr 1fr"}>
                {reviewsData?.map((review, index) => (
                  <VStack alignItems={"flex-start"} key={index}>
                    <HStack>
                      <Avatar
                        name={review.user.name}
                        src={review.user.avatar}
                        size="md"
                      />
                      <VStack spacing={0} alignItems={"flex-start"}>
                        <Heading fontSize={"md"}>{review.user.name}</Heading>
                        <HStack spacing={1}>
                          <FaStar size="12px" />
                          <Text>{review.rating}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text>{review.payload}</Text>
                  </VStack>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
        <Box pt={10}>
          <Calendar
            goToRangeStartOnSelect
            onChange={setDates}
            prev2Label={null}
            next2Label={null}
            minDetail="month"
            minDate={new Date()}
            // 6개월 이 예약 최대범위
            maxDate={new Date(Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000)}
            selectRange
          />
          <Button
            disabled={!checkBookingData?.ok}
            isLoading={isCheckingBooking && dates !== undefined}
            my={5}
            w="100%"
            colorScheme={"red"}
          >
            Make booking
          </Button>
          {!isCheckingBooking && !checkBookingData?.ok ? (
            <Text color="red.500">Can't book on those dates, sorry.</Text>
          ) : null}
        </Box>
      </Grid>
    </Box>
  );
}