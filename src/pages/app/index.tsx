import React from "react";

import { useActiveWeb3React } from "wallet";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getFarmStats,
  getIrisStat,
  getIrisToHarvest,
  getPoolPublicData,
  getPresaleInfo,
  harvestFromAll,
} from "web3-functions";
import { useERC20, useFenix, useIrisToken, useMasterChef, useRedeem, useScreamToken } from "hooks/contracts";
import { addTokenToWallet } from "wallet/utils";
import defaultContracts from "config/contracts";
import { farmIds, poolIds } from "config/pools";

import { utils } from "ethers";
import { blockToTimestamp, displayCurrency } from "libs/utils";

import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { GiFarmTractor } from "react-icons/gi";
import { RiWaterFlashFill } from "react-icons/ri";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useTimer } from "components/timers";

const data = [
  { name: "JAN", tvl: 0 },
  { name: "FEB", tvl: 0 },
  { name: "MAR", tvl: 0 },
  { name: "APR", tvl: 0 },
];

function useIrisData() {
  const { account } = useActiveWeb3React();
  const masterChef = useMasterChef();
  const irisToken = useIrisToken();
  const screamToken = useScreamToken();

  const irisInWallet = useQuery("irisInWallet", async () => {
    return account ? utils.formatEther(await irisToken.balanceOf(account)) : "0.00";
  });

  const irisToHarvest = useQuery("irisToHarvest", async () => {
    return account ? utils.formatEther(await getIrisToHarvest(account, masterChef)) : "0.00";
  });

  const screamInWallet = useQuery("screamInWallet", async () => {
    return account ? utils.formatEther(await screamToken.balanceOf(account)) : "0.00";
  });

  const screamToHarvest = useQuery("screamToHarvest", async () => {
    return account ? utils.formatEther(await getIrisToHarvest(account, masterChef)) : "0.00";
  });

  return { irisInWallet, irisToHarvest, screamInWallet, screamToHarvest};
}

function useHarvestAll() {
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const harvestAll = useMutation(() => harvestFromAll(masterChef), {
    onSuccess: () => {
      queryClient.invalidateQueries("irisInWallet");
      queryClient.invalidateQueries("irisToHarvest");
    },

    onError: ({ message, data }) => {
      toast({
        status: "error",
        position: "top-right",
        title: "Error harvesting IRIS",
        description: data?.message || message,
        isClosable: true,
      });
    },
  });

  return harvestAll;
}

function useIrisStats() {
  const irisContract = useIrisToken();

  const irisStats = useQuery("irisStats", async () => {
    return getIrisStat(irisContract);
  });

  return irisStats;
}

function useHermesStats() {
  const getLpContract = useERC20();
  const masterChef = useMasterChef();

  const hermesStats = useQuery("hermesStats", async () => {
    // const farmLps = await Promise.all(
    //   farmIds.map(async (pid) => {
    //     const { lpAddress } = await getPoolPublicData(pid, masterChef);
    //     return getLpContract(lpAddress);
    //   })
    // );

    const poolLps = await Promise.all(
      poolIds.map(async (pid) => {
        const { lpAddress } = await getPoolPublicData(pid, masterChef);
        return getLpContract(lpAddress);
      })
    );

    const resp = await getFarmStats(poolLps, []);

    return resp;
  });

  return hermesStats;
}

function usePresaleInfo() {
  const currentBlock = useCurrentBlockNumber();
  const fenixContract = useFenix();

  const presaleInfo = useQuery(["presale-info", currentBlock], async () => {
    return getPresaleInfo(fenixContract, currentBlock);
  });

  const presaleStartTimer = useTimer(
    blockToTimestamp(presaleInfo.data?.presaleStartBlock || 0),
    "D [days], H [hours], mm [minutes], ss [seconds]"
  );

  return presaleStartTimer;
}

const Page: React.FC = () => {
  const irisStats = useIrisStats();
  const hermesStats = useHermesStats();
  const { irisInWallet, irisToHarvest, screamInWallet, screamToHarvest } = useIrisData();
  const presaleStartTime = usePresaleInfo();

  const harvestAll = useHarvestAll();

  return (
    <AppLayout>
      <Stack spacing={10} py={10}>
        {presaleStartTime && (
          <Container maxW="container.md">
            <Stack direction="row" justify="space-between">
              <Heading size="lg">Pre-sale starts in</Heading>
              <Text>{presaleStartTime}</Text>
            </Stack>
          </Container>
        )}

        <Box bg="white" rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color="gray.600" fontSize="xl">
            Farms and Pools
          </Heading>

          <SimpleGrid templateColumns={{ base: "1fr", md: "1fr 1fr 2fr" }} spacing={[5, 10]}>
            <Stack mt={10} align="stretch" spacing={10}>
              <Stack spacing={4} justify={["center", ""]} align="center" direction="row">
                <Image src="/hermes-logo-1.png" boxSize={12} />
                <Button
                  onClick={() => addTokenToWallet(defaultContracts.irisToken.address, "babySCREAM")}
                  bg="secondary.200"
                  _hover={{ bg: "secondary.100" }}
                  size="sm"
                >
                  Add $newTOKEN to Wallet
                </Button>
                <Button
                  onClick={() => addTokenToWallet(defaultContracts.irisToken.address, "newToken")}
                  bg="secondary.200"
                  _hover={{ bg: "secondary.100" }}
                  size="sm"
                >
                  Add $babySCREAM to Wallet
                </Button>
                <Button
                  onClick={() => addTokenToWallet(defaultContracts.screamToken.address, "SCREAM")}
                  bg="secondary.200"
                  _hover={{ bg: "secondary.100" }}
                  size="sm"
                >
                  Add $SCREAM to Wallet
                </Button>
              </Stack>

              <Stack justify={["center", ""]} direction="row" spacing={10}>
                <Box align="center">
                  <Skeleton isLoaded={!!irisToHarvest.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayCurrency(irisToHarvest.data, true)}
                    </Text>
                  </Skeleton>

                  <Text fontSize={"sm"} color="gray.600">
                    $newTOKEN to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Skeleton isLoaded={!!irisInWallet.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayCurrency(irisInWallet.data, true)}
                    </Text>
                  </Skeleton>
                  <Text fontSize={"sm"} color="gray.600">
                    $newToken in wallet
                  </Text>
                </Box>

              <Box align="center">
                  <Skeleton isLoaded={!!screamToHarvest.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayCurrency(screamToHarvest.data, true)}
                    </Text>
                  </Skeleton>

                  <Text fontSize={"sm"} color="gray.600">
                    $SCREAM to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Skeleton isLoaded={!!screamInWallet.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayCurrency(screamInWallet.data, true)}
                    </Text>
                  </Skeleton>
                  <Text fontSize={"sm"} color="gray.600">
                    $SCREAM in wallet
                  </Text>
                </Box>
              </Stack>

              <Button
                isLoading={harvestAll.isLoading && !harvestAll.isSuccess}
                onClick={() => harvestAll.mutate()}
                variant="primary"
                fontSize="md"
              >
                Harvest All
              </Button>
            </Stack>

            <Box />

            <Stack spacing={[5, 14]} direction={{ base: "column", md: "row" }}>
              <Stack
                boxShadow="rgb(190 157 65 / 45%) 0px 25px 50px -12px"
                rounded="3xl"
                bg="secondary.500"
                bgGradient="linear(to-t, secondary.500, primary.200)"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
                as={Link}
                href="/app/farms"
                textDecoration="none!important"
              >
                <div>
                  <Center display={["none", "flex"]} mb={3} rounded="2xl" bg="white" p={3}>
                    <Icon color="secondary.500" boxSize={8} as={GiFarmTractor} />
                  </Center>

                  <Text fontSize={["lg", "sm"]} fontWeight={["500"]}>
                    In Farms
                  </Text>
                </div>

                <Box>
                  <Text fontSize={["xl", "sm"]} fontWeight="700">
                    Earn Upto
                  </Text>
                  <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                    N/A%{" "}
                  </Text>
                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>

              <Stack
                boxShadow="rgb(179 142 89 / 45%) 0px 25px 50px -12px"
                rounded="3xl"
                bg="accent.500"
                bgGradient="linear(to-t, accent.500, primary.200)"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
                as={Link}
                textDecoration="none!important"
              >
                <div>
                  <Center display={["none", "flex"]} mb={3} rounded="2xl" bg="white" p={3}>
                    <Icon color="#B38E5A" boxSize={8} as={RiWaterFlashFill} />
                  </Center>

                  <Text fontSize={["lg", "sm"]} fontWeight={["500", "700"]}>
                    In Pools
                  </Text>
                </div>

                <Box>
                  {/* <Text fontSize={["xl", "sm"]} fontWeight="700">
                    Earn Upto
                  </Text> */}
                  <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                    TBA
                  </Text>
                  {/* <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text> */}
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Box>

        <Box bg="white" rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color="gray.600" fontSize="xl">
            babySCREAM stats
          </Heading>

          <Stack mt={[6, 0]} direction={["column-reverse", "row"]} spacing={10}>
            <SimpleGrid columns={2} mt={[0, 10]} spacing={["20px", "30px"]}>
              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {/* {displayCurrency(irisStats.data?.marketCap, true)} */}
                      N/A
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Market Cap
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(irisStats.data?.maximumSupply, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Maximum Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency("0.4", true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    New IRIS/block
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(irisStats.data?.totalMinted, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Total Minted
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(irisStats.data?.circulatingSupply, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Circulating Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(irisStats.data?.totalBurned, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Total Burned
                  </Heading>
                </Box>
              </Box>
            </SimpleGrid>

            <Box flex="1">
              <Stack
                mb={5}
                align={["flex-start", "center"]}
                justify="space-between"
                direction={["column", "row"]}
                spacing={[6, 0]}
                ml={12}
              >
                <div>
                  <Heading
                    borderBottomWidth="2px"
                    borderColor="primary.500"
                    mb={[0, 1]}
                    color="gray.600"
                    fontSize="xl"
                  >
                    Total Value Locked
                  </Heading>
                  <Skeleton isLoaded={!!hermesStats.data}>
                    <Text fontSize="3xl" fontWeight="700">
                      {/* {displayCurrency(hermesStats.data?.tvl)} */}
                      N/A
                    </Text>
                  </Skeleton>
                </div>

                <Stack spacing={[5, 10]} direction="row">
                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color="gray.600"
                      fontSize="xl"
                    >
                      Farms
                    </Heading>
                    <Skeleton isLoaded={!!hermesStats.data}>
                      <Text fontSize="2xl" fontWeight="700">
                        {/* {displayCurrency(hermesStats.data?.totalValueInFarms)} */}
                        N/A
                      </Text>
                    </Skeleton>
                  </Box>

                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color="gray.600"
                      fontSize="xl"
                    >
                      Pools
                    </Heading>
                    <Skeleton isLoaded={!!hermesStats.data}>
                      <Text fontSize="2xl" fontWeight="700">
                        {/* {displayCurrency(hermesStats.data?.totalValueInPools)} */}
                        N/A
                      </Text>
                    </Skeleton>
                  </Box>
                </Stack>
              </Stack>

              <Box>
                <LineChart
                  width={useBreakpointValue({ base: 340, md: 800 })}
                  height={useBreakpointValue({ base: 200, md: 300 })}
                  style={{ marginLeft: useBreakpointValue({ base: "-30px", md: 0 }) }}
                  data={data}
                >
                  <Line type="monotone" dataKey="tvl" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </AppLayout>
  );
};

export default Page;
