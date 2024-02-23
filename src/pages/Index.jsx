import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (event) => {
    setHexCode(event.target.value);
  };

  const fetchColorName = async () => {
    if (!hexCode) {
      toast({
        title: "Error",
        description: "Please enter a hex code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.color.pizza/v1/names/?values=${hexCode}`);
      const data = await response.json();
      if (response.ok) {
        const color = data.colors[0];
        setColorName(color.name);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Network error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={8}>
      <FormControl id="hex-code">
        <FormLabel>Enter hex code</FormLabel>
        <Input type="text" placeholder="e.g. 1a1a1a" value={hexCode} onChange={handleInputChange} />
      </FormControl>
      <Button leftIcon={<FaSearch />} colorScheme="blue" isLoading={loading} onClick={fetchColorName}>
        Translate Hex to Color Name
      </Button>
      {colorName && (
        <Box>
          <Text>Color Name: {colorName}</Text>
          <Box w="100px" h="100px" bg={`#${hexCode}`} border="1px solid" borderColor="gray.300" />
        </Box>
      )}
    </VStack>
  );
};

export default Index;
