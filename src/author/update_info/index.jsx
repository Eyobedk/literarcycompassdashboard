import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'
import { useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import Avatar from '@mui/material/Avatar';



const EditCoach = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { presetName, cloudName } = useContext(AppContext);


    const [isLoading, setIsLoading] = useState(false);

    const [imageSuccess, setImageSuccess] = useState("");

    const [coachImage, setCoachImage] = useState("");

    const [coachName, setCoachName] = useState("");
    const [coachId, setCoachId] = useState("");

    const [userImage, setUserImage] = useState({
        image_secure_url: "",
        image_public_id: "",
    });

    const isNonMobile = useMediaQuery("(min-width:600px)");

    /**
     * fetch game week
     */

    const fetchCoach = async () => {
        setIsLoading(true);
        const response = await axios.get(`/coach/${id}`);

        if (response?.data?.status === "SUCCESS") {
            setCoachName(response.data.data.coach.coach_name);
            setCoachImage(response.data.data.coach.image_secure_url);
            setCoachId(response.data.data.coach._id)
        }

        setIsLoading(false);
    };


    useEffect(() => {
        fetchCoach();
    }, []);


    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(
                `/coach/${coachId}`,
                {
                    coach_name: coachName
                }
            );

            if (response?.data?.status === "SUCCESS") {
                navigate("/coach");
                toast.success(response?.data?.message);
            }
            if (
                response?.data?.status === "ERROR" ||
                response?.data?.status === "FAIL"
            ) {
                toast.error(response?.data?.message);
            }
            setIsLoading(false);
        } catch (error) {
            if (
                error.response?.data?.status === "FAIL" ||
                error.response?.data?.status === "ERROR"
            ) {
                toast.error(error?.response?.data?.message);
            }
            setIsLoading(false);
        }
    };

    function handleImageChange(e) {
        const file = e.target.files[0];
        setImageSuccess("");

        // Check that the file size is less than or equal to 400 KB
        if (file && file.size <= 400 * 1024) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;

                const handleUpload = async () => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", presetName); // Replace with your upload preset

                    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: "POST",
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            handleImageUpdate({
                                image_secure_url: data.secure_url,
                                image_public_id: data.public_id,
                            })
                        })
                        .catch(() => {
                            toast.error("Error occurred while uploading");
                            setImageSuccess("");
                            // throw error;
                        });
                };
                handleUpload();
            };

            reader.readAsDataURL(file);
        } else {
            // Display an error message or take other action as appropriate for exceeding file size limit
            //   setImageError("File exceeds allowed size limit of 400 KB.");
            toast.error("File exceeds allowed size limit of 400 KB.");
            setImageSuccess("");
            }
    }

    const handleImageUpdate = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.patch(
                `/coach/image/${coachId}`,
                {
                    ...data
                }
            );

            if (response?.data?.status === "SUCCESS") {
                setImageSuccess("yes");
                navigate("/coach");
                toast.success(response?.data?.message);
            }
            if (
                response?.data?.status === "ERROR" ||
                response?.data?.status === "FAIL"
            ) {
                toast.error(response?.data?.message);
            }
            setIsLoading(false);
        } catch (error) {
            if (
                error.response?.data?.status === "FAIL" ||
                error.response?.data?.status === "ERROR"
            ) {
                toast.error(error?.response?.data?.message);
            }
            setIsLoading(false);
        }
    };


    return (
        <Box m="20px">
            <Header title="EDIT" subtitle="Coach" />

            {
                isLoading && <p className="form-loading">Loading...</p>
            }

            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
            >
                <Avatar
                    alt={coachName}
                    src={coachImage}
                    sx={{ width: 76, height: 76 }}
                />
                <div>

                    <input
                        required
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        onChange={handleImageChange}
                        className="upload-img"
                    />
                </div>

                <TextField
                    fullWidth
                    placeholder="eg. 2024 or 24-25"
                    variant="filled"
                    type="text"
                    label="Coach Name"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value )}
                    name="name"
                    id="outlined-read-only-input"
                    InputProps={{
                        readOnly: false,
                    }}
                    sx={{ gridColumn: "span 4" }}
                />

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
                <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    EDIT
                </Button>
            </Box>
        </Box>
    );
};

export default EditCoach;
