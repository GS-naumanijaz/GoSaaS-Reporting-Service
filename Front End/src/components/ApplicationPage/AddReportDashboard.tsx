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
  Tooltip,
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
import {
  useAddReport,
  useEditReport,
  useUploadFile,
} from "../../hooks/useReportsQuery";
import { SourceConnection } from "../../models/SourceConnection";
import { DestinationConnection } from "../../models/DestinationConnection";
import { BsPin, BsFillPinFill } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";

const AddReportDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const [isPinned, setIsPinned] = useState(reportDetails?.isPinned ?? false);

  const [selectedFile, setSelectedFile] = useState<File | null>(
    reportDetails?.xslTemplate ?? null
  );

  console.log("selected file: ", selectedFile);

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
  const { mutate: uploadFile } = useUploadFile(productDetails.id);

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

  const isSaveButtonDisabled =
    !reportAlias ||
    !reportDescription ||
    !selectedSource ||
    !selectedDestination ||
    selectedProcedure === -1 ||
    !!aliasError ||
    !!descriptionError ||
    !selectedFile;

  const [isSaving, setIsSaving] = useState(false); // State to manage save button loading

  const onSave = async () => {
    if (isSaveButtonDisabled) {
      return;
    }

    setIsSaving(true); // Show spinner on the save button

    try {
      let partialReport: Partial<ReportsConnection> = {};

      // Preparing the request based on editing mode or adding new report
      if (isEditingMode) {
        if (reportAlias !== reportDetails.alias) {
          partialReport.alias = reportAlias;
        }

        if (reportDescription !== reportDetails.description) {
          partialReport.description = reportDescription;
        }

        const currentStoredProcedureName = storedProcedures
          ? storedProcedures[selectedProcedure].name
          : "";

        if (currentStoredProcedureName !== reportDetails.storedProcedure) {
          partialReport.storedProcedure = currentStoredProcedureName;
        }

        const currentParams = storedProcedures
          ? storedProcedures[selectedProcedure].parameters
          : [];

        if (
          JSON.stringify(currentParams) !== JSON.stringify(reportDetails.params)
        ) {
          partialReport.params = currentParams;
        }

        if (activeStatus !== reportDetails.isActive) {
          partialReport.isActive = activeStatus;
        }

        if (isPinned !== reportDetails.isPinned) {
          partialReport.isPinned = isPinned;
        }
      } else {
        partialReport = {
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
      }

      let reportRequest: any = {
        report: partialReport,
      };

      if (isEditingMode) {
        if (selectedSource !== reportDetails.sourceConnection.id) {
          reportRequest = {
            ...reportRequest,
            sourceId: Number(selectedSource),
          };
        }
        if (selectedDestination !== reportDetails.destinationConnection.id) {
          reportRequest = {
            ...reportRequest,
            destinationId: Number(selectedDestination),
          };
        }
      } else {
        reportRequest = {
          ...reportRequest,
          sourceId: Number(selectedSource),
          destinationId: Number(selectedDestination),
        };
      }

      let response;
      if (isEditingMode) {
        const currentReportId =
          reportDetails.id ?? reportDetails.reportId ?? -1;

        response = await updateReport({
          reportId: currentReportId,
          updatedReport: reportRequest,
        });
      } else {
        response = await addReport(reportRequest);
      }

      if (response && "id" in response) {
        const reportId = response.id;

        console.log("report details xsl tempple", reportDetails?.xslTemplate);
        console.log("selected file", selectedFile);

        // Only call uploadFile if the file has changed
        console.log("ouside upload", selectedFile);
        if (selectedFile && selectedFile !== reportDetails?.xslTemplate) {
          console.log("inside upload", selectedFile);
          uploadFile({ file: selectedFile, reportId });
        }
      } else {
        console.error("Save report response does not contain an id.");
      }

      navigate(-1); // Navigate back on success
    } catch (error) {
      console.error("Error saving the report:", error);
      // Handle error (stay on the same screen)
    } finally {
      setIsSaving(false); // Hide spinner on the save button
    }
  };

  useEffect(() => {
    if (selectedProcedure === -1) {
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
    <Box
      bg={"white"}
      borderColor={"lightgrey"}
      borderWidth={2}
      borderRadius="md"
      marginTop={2}
      textAlign="center"
      overflowY="auto"
      sx={sx}
      mb={5}
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
          <Button
            variant="link"
            p={0}
            _active={{ color: primaryColor }}
            color={primaryColor}
            onClick={() => navigate(-1)}
          >
            <IoArrowBack size={35} />
          </Button>
          {isEditingMode ? (
            <Switch
              size="lg"
              colorScheme="red"
              isChecked={activeStatus}
              onChange={() => setActiveStatus(!activeStatus)}
            />
          ) : null}
          <Spacer />
          <Text fontSize={25} textAlign="center">
            {isEditingMode ? "Edit Report" : "Register Report"}
          </Text>
          <Spacer />
          <HStack spacing={5}>
            {isEditingMode ? (
              <Button
                variant="link"
                _active={{ color: primaryColor }}
                color={primaryColor}
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <BsFillPinFill size={30} /> : <BsPin size={30} />}
              </Button>
            ) : null}
            <Button
              variant="link"
              _active={{ color: primaryColor }}
              color={primaryColor}
              onClick={onSave}
              isDisabled={isSaveButtonDisabled} // Disable if save not allowed
            >
              {isSaving ? <Spinner size="sm" /> : <AiOutlineSave size={35} />}
            </Button>
          </HStack>
        </HStack>
        {productDetails ? (
          <>
            <Text fontSize={22} marginTop={3} color={"black"}>
              {productDetails.name}
            </Text>
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
              <FormControl isRequired p={5} isInvalid={!selectedSource}>
                <FormLabel>Source Connections</FormLabel>
                {isLoadingSource && (
                  <>
                    <Spinner size="md" />
                    <Text mt={2}>Loading Source Connections...</Text>
                  </>
                )}
                {errorSource && (
                  <Text color="red.500" mt={2}>
                    Error loading source connections. Please try again later.
                  </Text>
                )}
                {!isLoadingSource && !errorSource && (
                  <>
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
                    {!selectedSource && (
                      <FormErrorMessage>
                        Please select a source connection
                      </FormErrorMessage>
                    )}
                  </>
                )}
              </FormControl>
              <FormControl isRequired p={5} isInvalid={!selectedDestination}>
                <FormLabel>Destination Connections</FormLabel>
                {isLoadingDestination && (
                  <>
                    <Spinner size="md" />
                    <Text mt={2}>Loading Destination Connections...</Text>
                  </>
                )}
                {errorDestination && (
                  <Text color="red.500" mt={2}>
                    Error loading destination connections. Please try again
                    later.
                  </Text>
                )}
                {!isLoadingDestination && !errorDestination && (
                  <>
                    <Select
                      placeholder="Select Destination Connection"
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                    >
                      {destinationConnectionsList ? (
                        destinationConnectionsList.map(
                          (
                            destinationConnection: {
                              id: number;
                              alias: string;
                            },
                            index: number
                          ) => (
                            <option
                              key={index}
                              value={destinationConnection.id}
                            >
                              {destinationConnection.alias}
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
                    {!selectedDestination && (
                      <FormErrorMessage>
                        Please select a destination connection
                      </FormErrorMessage>
                    )}
                  </>
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
                                <Box maxH="250px" overflowY="auto" sx={sx}>
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
                                </Box>
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
                accept=".xsl"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                marginTop={2}
                bg={secondaryColor}
                onClick={handleButtonClick}
                border={selectedFile ? "none" : "1px solid red"}
              >
                Upload XSL File
              </Button>
              {selectedFile ? (
                <Text marginTop={2}>
                  Selected File: {selectedFile.toString()}
                </Text>
              ) : (
                <Text marginTop={2} color="red" fontSize={13}>
                  XSL File not uploaded
                </Text>
              )}
            </Box>
          </>
        ) : (
          <Text color="red.500">Product details not available.</Text>
        )}
      </Box>
    </Box>
  );
};

export default AddReportDashboard;
