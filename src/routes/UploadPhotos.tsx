import {
    Box,
    Button,
    Container,
    FormControl,
    Heading,
    Input,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import { useMutation } from "@tanstack/react-query";
  import { useForm } from "react-hook-form";
  import { useParams } from "react-router-dom";
  import { createPhoto, getUploadURL, uploadImage } from "../api";
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
    const { register, handleSubmit, watch, reset } = useForm<IForm>();
    const { room_pk } = useParams();
    const toast = useToast();
    const createPhotoMutation = useMutation(createPhoto, {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Image uploaded!",
          isClosable: true,
          description: "Feel free to upload more images.",
        });
        reset();
      },
    });
    const uploadImageMutation = useMutation(uploadImage, {
        // mutate를 통해 전달받은 data 안의 result를 받아옴
      onSuccess: ({ result }: any) => {
        if (room_pk) {
            // TODO: description 완성
          createPhotoMutation.mutate({
            description: "Is Description",
            file: `https://imagedelivery.net/${process.env.REACT_APP_CF_HASH}/${result.id}/public`,
            room_pk,
          });
        }
        // console.log("result", result);
      },
    });
    const uploadURLMutation = useMutation(getUploadURL, {
      onSuccess: (data: IUploadURLResponse) => {
        uploadImageMutation.mutate({
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
              <Button
                isLoading={
                  createPhotoMutation.isLoading ||
                  uploadImageMutation.isLoading ||
                  uploadURLMutation.isLoading
                }
                type="submit"
                w="full"
                colorScheme={"red"}
              >
                Upload photos
              </Button>
            </VStack>
          </Container>
        </Box>
      </ProtectedPage>
    );
  }