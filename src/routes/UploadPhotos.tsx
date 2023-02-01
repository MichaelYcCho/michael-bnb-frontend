import {
    Box,
    Button,
    Container,
    FormControl,
    Heading,
    Input,
    VStack,
  } from "@chakra-ui/react";
  import { useMutation } from "@tanstack/react-query";
  import { useForm } from "react-hook-form";
  import { useParams } from "react-router-dom";
  import { getUploadURL, uploadImage } from "../api";
  import useHostOnlyPage from "../components/HostOnlyPage";
  import ProtectedPage from "../components/ProtectedPage";
  
  interface IForm {
    file: FileList;
  }
  
  interface IUploadURLResponse {
    id: string;
    uploadURL: string;
  }
  
  export default function UploadPhotos() {
    const { register, handleSubmit, watch } = useForm<IForm>();
    const { roomPk } = useParams();

    const uploadImageMutation = useMutation(uploadImage, {
      onSuccess: (data: any) => {
        console.log(data);
      },
    });

    // useMutation을 쓸땐 하나의 object만 args로 받아야하므로 Mutation을 2개로 나눠서 해결
    const uploadURLMutation = useMutation(getUploadURL, {
      onSuccess: (data: IUploadURLResponse) => {
        uploadImageMutation.mutate({
        // console.log(watch())
        // Watch를 통해 나오는 FileList의 첫번째 index를 가진 File을 Form에 넣는다
        uploadURL: data.uploadURL,
        file: watch("file"),
        });
      },
    });
    useHostOnlyPage();
    const onSubmit = () => {
      uploadURLMutation.mutate();
    };
    return (
      <ProtectedPage>
        <Box
          pb={40}
          mt={10}
          px={{
            base: 10,
            lg: 40,
          }}
        >
          <Container>
            <Heading textAlign={"center"}>Upload a Photo</Heading>
            <VStack
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={5}
              mt={10}
            >
              <FormControl>
                <Input {...register("file")} type="file" accept="image/*" />
              </FormControl>
              <Button type="submit" w="full" colorScheme={"red"}>
                Upload photos
              </Button>
            </VStack>
          </Container>
        </Box>
      </ProtectedPage>
    );
  }