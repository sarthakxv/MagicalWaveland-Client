import {
  Box,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("rgba(255,255,255,0.3)", "rgba(17, 25, 40, 0.75)")}
      borderTop={useColorModeValue(
        "1px solid rgba(209, 213, 219, 0.3)",
        "1px solid rgba(255, 255, 255, 0.125)"
      )}
    >
      <Container
        as={Stack}
        maxW="6xl"
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © {new Date().getFullYear()} Made by{" "}
          <Text
            as="a"
            _hover={{
              textDecoration: "underline"
            }}
            href="https://twitter.com/0xSarthak"
            target="_blank"
            rel="noreferrer noopener"
          >
            Sarthak Verma
          </Text>
        </Text>
        <Stack direction={"row"} spacing={4}>
          <SocialButton label="Twitter" href="https://twitter.com/srthkv">
            <FaTwitter />
          </SocialButton>
          <SocialButton label="Github" href="https://github.com/sarthakvdev">
            <FaGithub />
          </SocialButton>
          <SocialButton label="Github" href="https://linkedin.com/in/sarthakv">
            <FaLinkedinIn />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <Flex
      rounded="full"
      w="40px"
      h="40px"
      cursor="pointer"
      as="a"
      href={href}
      target="_blank"
      align="center"
      justify="center"
      transition="background 0.5s ease"
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Flex>
  );
};

export default Footer;
