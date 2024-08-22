import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Spinner,
  Switch,
  Text,
} from "@chakra-ui/react";
import {
  maximumAppDescription,
  maximumAppName,
  minimumAppDescription,
  minimumAppName,
  primaryColor,
  secondaryColor,
  sx,
} from "../../configs";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { ReportsConnection } from "../../models/ReportsConnection";
import {
  useConditionalStoredProcedures,
  useGetSourceConnectionsListQuery,
} from "../../hooks/useSourceConnectionQuery";
import { useGetDestinationConnectionsListQuery } from "../../hooks/useDestinationConnectionQuery";
import { useAddReport, useEditReport } from "../../hooks/useReportsQuery";
import { SourceConnection } from "../../models/SourceConnection";
import { DestinationConnection } from "../../models/DestinationConnection";
import { BsPin, BsFillPinFill } from "react-icons/bs";

const AddReportDashboard = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const productDetails = location.state.productDetails;
  // const reportDetails = location.state.report as ReportsConnection | undefined;

  const location = useLocation();

  // Retrieve from location.state or localStorage
  const isEditingMode =
    location.state?.isEditing ??
    JSON.parse(localStorage.getItem("isEditingMode") ?? "false");

  const reportDetails = isEditingMode
    ? location.state?.report ??
      JSON.parse(localStorage.getItem("reportDetails") ?? "{}")
    : undefined;

  const productDetails = isEditingMode
    ? reportDetails?.application ?? {}
    : location.state?.productDetails ||
      JSON.parse(localStorage.getItem("productDetails") ?? "{}");

  const [reportAlias, setReportAlias] = useState(reportDetails?.alias ?? "");
  const [reportDescription, setReportDescription] = useState(
    reportDetails?.description ?? ""
  );

  const [activeStatus, setActiveStatus] = useState(
    reportDetails?.isActive ?? false
  );

  console.log(reportDetails);

  const [isPinned, setIsPinned] = useState(reportDetails?.isPinned ?? false);

  console.log(isPinned);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const hasSetInitialSource = useRef(false);
  const hasSetInitialDestination = useRef(false);

  const {
    data: sourceConnectionsList,
    isLoading: isLoadingSource,
    error: errorSource,
  } = useGetSourceConnectionsListQuery(productDetails.id);

  const [selectedSource, setSelectedSource] = useState(
    sourceConnectionsList?.some(
      (obj) => obj.id === reportDetails?.sourceConnection?.id
    )
      ? reportDetails?.sourceConnection?.id
      : ""
  );

  const {
    data: destinationConnectionsList,
    isLoading: isLoadingDestination,
    error: errorDestination,
  } = useGetDestinationConnectionsListQuery(productDetails.id);

  const [selectedDestination, setSelectedDestination] = useState(
    destinationConnectionsList?.some(
      (obj) => obj.id === reportDetails?.destinationConnection?.id
    )
      ? reportDetails?.destinationConnection?.alias
      : ""
  );

  const { data: storedProcedures, isLoading: isLoadingStoredProcedures } =
    useConditionalStoredProcedures(productDetails.id, selectedSource);

  const { mutateAsync: addReport } = useAddReport(productDetails.id);
  const { mutateAsync: updateReport } = useEditReport(productDetails.id);

  const [selectedProcedure, setSelectedProcedure] = useState<number>(-1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const [aliasError, setAliasError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const validateAlias = (value: string) => {
    if (value.length < minimumAppName || value.length > maximumAppName) {
      setAliasError(
        `Alias must be between ${minimumAppName} and ${maximumAppName} characters.`
      );
    } else {
      setAliasError("");
    }
  };

  const validateDescription = (value: string) => {
    if (
      value.length < minimumAppDescription ||
      value.length > maximumAppDescription
    ) {
      setDescriptionError(
        `Description must be between ${minimumAppDescription} and ${maximumAppDescription} characters.`
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput")?.click();
  };

  // usestates for the save dialog
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const onSaveClose = () => setIsSaveOpen(false);
  const cancelSaveRef = useRef<HTMLButtonElement | null>(null);

  const onSave = async () => {
    // save changes to database
    // reload the application page
    if (isSaveButtonDisabled) {
      return;
    }

    try {
      let partialReport: Partial<ReportsConnection> = {
        alias: reportAlias,
        description: reportDescription,
        storedProcedure: storedProcedures
          ? storedProcedures[selectedProcedure].name
          : "",
        params: storedProcedures
          ? storedProcedures[selectedProcedure].parameters
          : [],
        isActive: activeStatus,
        isPinned: isPinned,
      };

      if (isEditingMode) {
        let reportId = reportDetails.id ?? reportDetails.reportId ?? -1;
        let updatedReport = {
          report: partialReport,
          sourceId: Number(selectedSource),
          destinationId: Number(selectedDestination),
        };

        await updateReport({ reportId, updatedReport });
      } else {
        let reportData = {
          report: partialReport,
          sourceId: Number(selectedSource),
          destinationId: Number(selectedDestination),
        };

        await addReport(reportData);
      }
    } catch {
      console.log("failed to save");
    }

    setIsSaveOpen(false);
    onSaveClose();
    navigate(-1);

    // localStorage.removeItem("productDetails");
    // localStorage.removeItem("reportDetails");
    localStorage.removeItem("isEditing");
  };

  const isSaveButtonDisabled =
    !reportAlias ||
    !reportDescription ||
    !selectedSource ||
    !selectedDestination ||
    selectedProcedure == -1 ||
    !!aliasError ||
    !!descriptionError;

  useEffect(() => {
    if (selectedProcedure == -1) {
      setSelectedProcedure(
        storedProcedures && reportDetails
          ? storedProcedures.findIndex(
              (obj) => obj.name === reportDetails.storedProcedure
            )
          : -1
      );
    }

    if (
      isEditingMode &&
      reportDetails &&
      !hasSetInitialSource.current &&
      Array.isArray(sourceConnectionsList) &&
      sourceConnectionsList.length > 0
    ) {
      const matchingSource = sourceConnectionsList.find(
        (sourceConnection: SourceConnection) =>
          sourceConnection.alias === reportDetails.sourceConnection?.alias
      );
      if (matchingSource) {
        setSelectedSource(matchingSource.id.toString());
        setSelectedProcedure(-1);
        hasSetInitialSource.current = true;
      }
    }

    if (
      isEditingMode &&
      reportDetails &&
      !hasSetInitialDestination.current &&
      Array.isArray(destinationConnectionsList) &&
      destinationConnectionsList.length > 0
    ) {
      const matchingDestination = destinationConnectionsList.find(
        (destinationConnection: DestinationConnection) =>
          destinationConnection.alias ===
          reportDetails.destinationConnection?.alias
      );
      if (matchingDestination) {
        setSelectedDestination(matchingDestination.id.toString());
        hasSetInitialDestination.current = true;
      }
    }
  }, [
    isEditingMode,
    reportDetails,
    sourceConnectionsList,
    destinationConnectionsList,
  ]);

  return (
    <>
      <Box
        bg={"white"}
        borderColor={"lightgrey"}
        borderWidth={2}
        borderRadius="md"
        marginX={3}
        marginTop={2}
        textAlign="center"
        h="96.8%"
        overflowY="auto"
        sx={sx}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginX={10}
          marginTop={5}
        >
          <HStack
            justifyContent={"center"}
            marginX={10}
            marginTop={5}
            spacing={4}
            paddingBottom={3}
            borderBottomColor={"lightgrey"}
            borderBottomWidth={3}
            width={"100%"}
          >
            <Switch
              size="lg"
              colorScheme="red"
              isChecked={activeStatus}
              onChange={() => setActiveStatus(!activeStatus)}
            />
            <Spacer />
            <Text fontSize={25} textAlign="center">
              {isEditingMode ? "Edit Report" : "Register Report"}
            </Text>
            <Spacer />
            <HStack spacing={5}>
              <Button
                variant="link"
                _active={{ color: primaryColor }}
                color={primaryColor}
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <BsFillPinFill size={30} /> : <BsPin size={30} />}
              </Button>
              <Button
                variant="link"
                p={0}
                _active={{ color: primaryColor }}
                color={primaryColor}
                onClick={() => setIsSaveOpen(true)}
              >
                <AiOutlineSave size={35} />
              </Button>
            </HStack>
          </HStack>
          {productDetails ? (
            <>
              <Text fontSize={22} marginTop={3} color={"black"}>
                {productDetails.name}
              </Text>
              {/* form */}
              <Box width="50%">
                <FormControl isRequired p={5} isInvalid={!!aliasError}>
                  <FormLabel>Report Alias</FormLabel>
                  <Input
                    type="string"
                    placeholder="Alias"
                    value={reportAlias}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReportAlias(value);
                      validateAlias(value);
                    }}
                  />
                  {aliasError && (
                    <FormErrorMessage>{aliasError}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired p={5} isInvalid={!!descriptionError}>
                  <FormLabel>Report Description</FormLabel>
                  <Input
                    type="string"
                    placeholder="Description"
                    value={reportDescription}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReportDescription(value);
                      validateDescription(value);
                    }}
                  />
                  {descriptionError && (
                    <FormErrorMessage>{descriptionError}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Source Connections</FormLabel>
                  {/* Loading State */}
                  {isLoadingSource && (
                    <>
                      <Spinner size="md" />
                      <Text mt={2}>Loading Source Connections...</Text>
                    </>
                  )}

                  {/* Error State */}
                  {errorSource && (
                    <Text color="red.500" mt={2}>
                      Error loading source connections. Please try again later.
                    </Text>
                  )}

                  {/* Select Dropdown */}
                  {!isLoadingSource && !errorSource && (
                    <Select
                      placeholder="Select Source Connection"
                      value={selectedSource}
                      onChange={(e) => {
                        setSelectedSource(e.target.value);
                        setSelectedProcedure(-1);
                      }}
                    >
                      {sourceConnectionsList ? (
                        sourceConnectionsList.map(
                          (
                            sourceConnection: SourceConnection,
                            index: number
                          ) => (
                            <option key={index} value={sourceConnection.id}>
                              {sourceConnection.alias}
                            </option>
                          )
                        )
                      ) : (
                        <Text>Error with loading source connection list</Text>
                      )}
                    </Select>
                  )}
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Destination Connections</FormLabel>
                  {/* Loading State */}
                  {isLoadingDestination && (
                    <>
                      <Spinner size="md" />
                      <Text mt={2}>Loading Destination Connections...</Text>
                    </>
                  )}

                  {/* Error State */}
                  {errorDestination && (
                    <Text color="red.500" mt={2}>
                      Error loading destination connections. Please try again
                      later.
                    </Text>
                  )}

                  {/* Select Dropdown */}
                  {!isLoadingDestination && !errorDestination && (
                    <Select
                      placeholder="Select Destination Connection"
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                    >
                      {destinationConnectionsList ? (
                        destinationConnectionsList.map(
                          (
                            sourceConnection: { id: number; alias: string },
                            index: number
                          ) => (
                            <option key={index} value={sourceConnection.id}>
                              {sourceConnection.alias}
                            </option>
                          )
                        )
                      ) : (
                        <Text>
                          Error loading destination connections. Please try
                          again later.
                        </Text>
                      )}
                    </Select>
                  )}
                </FormControl>
                {selectedSource && (
                  <>
                    {isLoadingStoredProcedures ? (
                      <>
                        <Spinner size="md" />
                        <Text mt={2}>Loading Source Connections...</Text>
                      </>
                    ) : (
                      <>
                        <FormControl isRequired p={5}>
                          <FormLabel>Stored Procedures</FormLabel>
                          <Select
                            placeholder="Select Stored Procedure"
                            value={selectedProcedure}
                            onChange={(e) =>
                              setSelectedProcedure(Number(e.target.value))
                            }
                          >
                            {storedProcedures?.map((storedProcedure, index) => (
                              <option key={index} value={index}>
                                {storedProcedure.name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        {selectedProcedure && (
                          <FormControl isReadOnly p={5}>
                            {storedProcedures &&
                              selectedProcedure !== -1 &&
                              storedProcedures.length !== 0 && (
                                <>
                                  <FormLabel>Parameters</FormLabel>
                                  {storedProcedures[
                                    selectedProcedure
                                  ].parameters.map((param, index) => (
                                    <HStack
                                      key={index}
                                      spacing={4}
                                      p={5}
                                      borderWidth={1}
                                      borderColor="gray.200"
                                      borderRadius="md"
                                      width="100%"
                                    >
                                      <Box flex={1}>{param}</Box>
                                    </HStack>
                                  ))}
                                </>
                              )}
                          </FormControl>
                        )}
                      </>
                    )}
                  </>
                )}

                <Input
                  type="file"
                  id="fileInput"
                  accept=".xml"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Button
                  marginTop={2}
                  bg={secondaryColor}
                  onClick={handleButtonClick}
                >
                  Upload XML File
                </Button>
                {selectedFile && (
                  <Text marginTop={2}>Selected File: {selectedFile.name}</Text>
                )}
              </Box>
            </>
          ) : (
            <Text color="red.500">Product details not available.</Text>
          )}
        </Box>
      </Box>

      <AlertDialog
        isOpen={isSaveOpen}
        leastDestructiveRef={cancelSaveRef}
        onClose={onSaveClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Save Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              {isSaveButtonDisabled
                ? "Please fill all the fields with valid information"
                : "Are you sure you want to save these changes?"}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelSaveRef} onClick={onSaveClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onSave}
                ml={3}
                isDisabled={isSaveButtonDisabled}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AddReportDashboard;
