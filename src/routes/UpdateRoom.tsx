import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Text,
    Textarea,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaBed, FaMoneyBill, FaToilet } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
    updateRoom,
    getAmenities,
    getCategories,
    getRoom,
} from "../api";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { IAmenity, ICategory, IRoomDetail, IUpdateRoom } from "../types";
import { Helmet } from "react-helmet";

export default function UpdateRoom() {
    useHostOnlyPage();
    const { register, handleSubmit } = useForm<IUpdateRoom>();
    const { room_id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const mutation = useMutation(updateRoom, {
        onSuccess: (data: IRoomDetail) => {
            toast({
                status: "success",
                title: "Room Edited",
                description: "방이 수정되었습니다.",
                position: "bottom-right",
            });
            navigate(`/rooms/${data.id}`);
        },
    });
    const { data } = useQuery<IRoomDetail>([`rooms`, room_id], getRoom);
    const { data: amenities, isLoading: isAmenitiesLoading } = useQuery<
        IAmenity[]
    >(["amenities"], getAmenities);
    const { data: categories, isLoading: isCategoriesLoading } = useQuery<
        ICategory[]
    >(["categories"], getCategories);

    const onSubmit = (data: IUpdateRoom) => {
        if (room_id) {
            data["room_id"] = room_id;
            mutation.mutate(data);
        }
    };

    return (
        <ProtectedPage>
            <Helmet>
                <title>Room Edit</title>
            </Helmet>
            <Box pb={40} mt={10} px={{ base: 10, lg: 40 }}>
                <Container>
                    <Heading textAlign={"center"}>Edit Room</Heading>
                    <VStack
                        spacing={10}
                        as="form"
                        mt={5}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                defaultValue={data?.name}
                                {...register("name", { required: true })}
                                required
                                type={"text"}
                            />
                            <FormHelperText>
                                방의 이름을 작성해주세요.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Country</FormLabel>
                            <Input
                                defaultValue={data?.country}
                                {...register("country", { required: true })}
                                required
                                type={"text"}
                            />
                            <FormHelperText>
                                방이 위치한 나라를 작성해주세요.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input
                                defaultValue={data?.city}
                                {...register("city", { required: true })}
                                required
                                type={"text"}
                            />
                            <FormHelperText>
                                방이 위치한 도시를 작성해주세요.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Address</FormLabel>
                            <Input
                                defaultValue={data?.address}
                                {...register("address", { required: true })}
                                required
                                type={"text"}
                            />
                            <FormHelperText>
                                방이 위치한 위치를 작성해주세요.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <InputGroup>
                                <InputLeftAddon
                                    children={<FaMoneyBill />}
                                />
                                <Input
                                    defaultValue={data?.price}
                                    {...register("price", {
                                        required: true,
                                    })}
                                    required
                                    type={"number"}
                                    min={0}
                                />
                            </InputGroup>
                            <FormHelperText>
                                {"방의 가격을 작성해주세요 ( ₩ )"}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Rooms</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children={<FaBed />} />
                                <Input
                                    defaultValue={data?.rooms}
                                    {...register("rooms", {
                                        required: true,
                                    })}
                                    required
                                    type={"number"}
                                    min={1}
                                />
                            </InputGroup>
                            <FormHelperText>
                                방의 개수를 작성해주세요
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Toilets</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children={<FaToilet />} />
                                <Input
                                    defaultValue={data?.toilets}
                                    {...register("toilets", {
                                        required: true,
                                    })}
                                    required
                                    type={"number"}
                                    min={0}
                                />
                            </InputGroup>
                            <FormHelperText>
                                화장실의 개수를 작성해주세요
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                defaultValue={data?.description}
                                {...register("description")}
                            />
                            <FormHelperText>
                                방에 대한 설명을 작성해주세요
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <Checkbox
                                {...register("pet_friendly", {
                                })}
                            >
                                Pet Friendly?
                            </Checkbox>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Kind of Room</FormLabel>
                            <Select
                                {...register("kind", { required: true })}
                                placeholder="종류를 골라주세요"
                            >
                                <option value={"entire_place"} selected>
                                    Entire Place
                                </option>
                                <option value={"private_room"}>
                                    Private Room
                                </option>
                                <option value={"shared_room"}>
                                    Shared Room
                                </option>
                            </Select>
                            <FormHelperText>
                                어떠한 종류의 방을 빌려주시나요?
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category of Room</FormLabel>
                            <Select
                                {...register("category", {
                                    //required: true,
                                })}
                                placeholder="카테고리를 골라주세요"
                            >
                                {categories?.map((category) => (
                                    <option
                                        key={category.pk}
                                        value={category.pk}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            <FormHelperText>
                                어떠한 카테고리의 방을 빌려주시나요?
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Amenity of Room</FormLabel>
                            <FormHelperText>
                                방은 어떤것들을 제공하나요?
                            </FormHelperText>
                            <Grid
                                mt={5}
                                templateColumns={"1fr 1fr"}
                                gap={5}
                            >
                                {amenities?.map((amenity) => (
                                    <Box key={amenity.pk}>
                                        <Checkbox
                                            value={amenity.pk}
                                            {...register("amenities")}
                                        >
                                            {amenity.name}
                                        </Checkbox>
                                        <FormHelperText>
                                            {amenity.description}
                                        </FormHelperText>
                                    </Box>
                                ))}
                            </Grid>
                        </FormControl>
                        {mutation.isError ? (
                            <Text color={"red.500"}>Wrong</Text>
                        ) : null}
                        <Button
                            type="submit"
                            isLoading={mutation.isLoading}
                            colorScheme={"red"}
                            size="lg"
                            w={"100%"}
                        >
                            Edit Room
                        </Button>
                    </VStack>
                </Container>
            </Box>
        </ProtectedPage>
    );
}