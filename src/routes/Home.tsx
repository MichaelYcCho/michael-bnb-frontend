import {
  Grid, Skeleton,
} from "@chakra-ui/react";
import Room from "../components/Room";
import RoomSkeleton from "../components/RoomSkeleton";

//base -> 모바일 버전, lg -> 데스크탑 버전 (차크라는 모바일을 우선적용)

export default function Home() {
  return (
    <Grid
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >

      <>
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
        <RoomSkeleton />
      </>


    </Grid>
  );
}