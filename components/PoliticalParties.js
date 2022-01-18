import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import contractABI from "../contractABI.json";
import getReason from "../utils/getReason";

const PoliticalParties = ({ contract, accountData }) => {
  const toast = useToast();
  const router = useRouter();

  const [politicalParties, setPoliticalParties] = useState([]);
  const [loading, setLoading] = useState(false);

  useContractEvent(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: contractABI.abi,
    },
    "PoliticalPartyAdded",
    () => getPoliticalParties()
  );

  const getPoliticalParties = async () => {
    const politicalPartiesTxn = await contract.getAllPoliticalParties();

    setPoliticalParties(politicalPartiesTxn);
  };

  useEffect(() => {
    if (contract?.signer) {
      getPoliticalParties();
    }
  }, [contract, accountData]);

  const vote = async (index) => {
    try {
      setLoading(true);
      const voteTxn = await contract.vote(index);

      await voteTxn.wait();

      await getPoliticalParties();
    } catch (e) {
      toast({
        title: "Error.",
        description: getReason(e),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  if (politicalParties.length === 0) return null;

  return (
    <Box mt={8}>
      <Text fontSize="2xl">Political Parties: </Text>
      <Box display="flex" mt={4} justifyContent="space-between">
        {politicalParties.map((politicalParty, index) => (
          <Box
            key={politicalParty.number}
            width="33%"
            display="flex"
            alignItems="center"
            justifyItems="center"
          >
            <Box
              backgroundColor="gray.300"
              borderWidth={2}
              borderColor="blackAlpha.500"
              borderRadius={4}
              p={4}
            >
              <Box display="flex" flexDir="column" mb={2}>
                <Text fontWeight="bold" mr={4}>
                  Political Party Name:{" "}
                </Text>
                <Text>{politicalParty.partyName}</Text>
              </Box>

              <Box display="flex" flexDir="column" mb={2}>
                <Text fontWeight="bold" mr={4}>
                  Political Party President Name:{" "}
                </Text>
                <Text>{politicalParty.presidentName}</Text>
              </Box>

              <Box display="flex" flexDir="column" mb={4}>
                <Text fontWeight="bold" mr={4}>
                  Votes:{" "}
                </Text>
                <Text>{politicalParty.votes.toNumber()}</Text>
              </Box>
              <Button
                disabled={loading}
                isFullWidth
                onClick={() => vote(index)}
              >
                Vote
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PoliticalParties;
