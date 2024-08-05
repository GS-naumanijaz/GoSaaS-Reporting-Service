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
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { primaryColor, secondaryColor, sx } from "../../configs";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";

const AddReportDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productDetails = location.state;

  const sourceConnections = [
    "Main Server",
    "Backup Server",
    "Analytics Server",
  ];
  const destinationConnections = ["Backend Server", "Default Backend Server"];
  const storedProcedures: { [key: string]: string[] } = {
    Main: ["Procedure 1", "Procedure 2"],
    Backup: ["Procedure 3", "Procedure 4"],
    Analytics: ["Procedure 5", "Procedure 6"],
  };

  const [reportAlias, setReportAlias] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput")?.click();
  };

  // usestates for the save dialog
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const onSaveClose = () => setIsSaveOpen(false);
  const cancelSaveRef = useRef<HTMLButtonElement | null>(null);

  const onSave = () => {
    // save changes to database
    // reload the application page
    if (isSaveButtonDisabled) {
      console.log("Please fill all the fields");
      return;
    }
    console.log("Changes saved");
    setIsSaveOpen(false);
    onSaveClose();
    navigate("/homepage");
  };

  const isSaveButtonDisabled =
    !reportAlias ||
    !reportDescription ||
    !selectedSource ||
    !selectedDestination ||
    !selectedProcedure ||
    !selectedFile;

  console.log("Val of savebutton: ", isSaveButtonDisabled);

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
            <Spacer />
            <Text fontSize={25} textAlign="center">
              Register Report
            </Text>
            <Spacer />
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
          {productDetails ? (
            <>
              <Text fontSize={22} marginTop={3} color={"black"}>
                {productDetails.name}
              </Text>
              {/* form */}
              <Box width="50%">
                <FormControl isRequired p={5}>
                  <FormLabel>Report Alias</FormLabel>
                  <Input
                    type="string"
                    placeholder="Alias"
                    value={reportAlias}
                    onChange={(e) => setReportAlias(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Report Description</FormLabel>
                  <Input
                    type="string"
                    placeholder="Description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Source Connections</FormLabel>
                  <Select
                    placeholder="Select Source"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    {sourceConnections.map((sourceConnection, index) => (
                      <option key={index}>{sourceConnection}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Destination Connections</FormLabel>
                  <Select
                    placeholder="Select Destination"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                  >
                    {destinationConnections.map(
                      (destinationConnection, index) => (
                        <option key={index}>{destinationConnection}</option>
                      )
                    )}
                  </Select>
                </FormControl>
                <FormControl isRequired p={5}>
                  <FormLabel>Stored Procedures</FormLabel>
                  <Select
                    placeholder="Select Stored Procedure"
                    value={selectedProcedure}
                    onChange={(e) => setSelectedProcedure(e.target.value)}
                  >
                    {Object.keys(storedProcedures).map(
                      (storedProcedure, index) => (
                        <option key={index} value={storedProcedure}>
                          {storedProcedure}
                        </option>
                      )
                    )}
                  </Select>
                </FormControl>
                {selectedProcedure && (
                  <FormControl isReadOnly p={5}>
                    <FormLabel>Parameters</FormLabel>
                    {storedProcedures[selectedProcedure]?.map(
                      (param, index) => (
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
                      )
                    )}
                  </FormControl>
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
                ? "Please fill all the fields"
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
