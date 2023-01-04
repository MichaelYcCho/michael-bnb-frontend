import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
        // vstack is a vertical stack (Flex Container), MinHeight = minH
    <VStack bg="gray.100" justifyContent={"center"} minH="100vh">
        <Heading>404</Heading>
      <Text>It seems that you're lost.</Text>
        <Link to="/">
            <Button colorScheme={"red"} variant={"link"}>
                Go home &rarr;
            </Button>
      </Link>
    </VStack>
  );
}