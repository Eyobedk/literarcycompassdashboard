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

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem  } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const EditAuthor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [imageSuccess, setImageSuccess] = useState("");
    const { presetName, cloudName } = useContext(AppContext);

    const [authorImage, setAuthorImage] = useState("");

    const [author, setAuthor] = useState({
        full_name:"",
        birth_date:new Date(),
        website:"",
        amazon_url:"",
        about:"",
        picture_url:""
    });

    const [authorId, setAuthorId] = useState("");

    const [userImage, setUserImage] = useState({
        image_secure_url: "",
        image_public_id: "",
    });

    const isNonMobile = useMediaQuery("(min-width:600px)");

    /**
     * fetch author
     */

    const fetchAuthor = async () => {
        setIsLoading(true);
        const response = await axios.get(`/author/${id}`);

        if (response?.data?.status === "SUCCESS") {
            setAuthor(response.data.data.author);
            setAuthorImage(response.data.data.author.picture_url)
        }

        setIsLoading(false);
    };


    useEffect(() => {
        fetchAuthor();
    }, []);


    const handleSubmit = async () => {
        try {
            
            delete author.picture_url;

            const response = await axios.patch(
                `/author/${id}`,author );

            if (response?.data?.status === "SUCCESS") {
                navigate("/author");
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
            console.log(error)
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
                            console.log({
                                image_secure_url: data.secure_url,
                                image_public_id: data.public_id,
                            })
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
            console.log(data)
            const response = await axios.patch(
                `/author/image/${id}`,
                {
                    ...data
                }
            );

            if (response?.data?.status === "SUCCESS") {
                setImageSuccess("yes");
                navigate("/author");
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
            console.log(error)
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
            <Header title="EDIT" subtitle="Author" />

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
                    alt={author.full_name}
                    src={authorImage}
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
                </Box>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Author Name"
                    value={author.full_name}
                    onChange={(e) => setAuthor({full_name: e.target.value})}
                    name="name"
                    id="outlined-read-only-input"
                    InputProps={{
                        readOnly: false,
                    }}
                    sx={{ gridColumn: "span 1" }}
                />

                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="website"
                    value={author.website}
                    onChange={(e) => setAuthor({website: e.target.value})}
                    name="name"
                    id="outlined-read-only-input"
                    InputProps={{
                        readOnly: false,
                    }}
                    sx={{ gridColumn: "span 1" }}
                />

                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="amazon url"
                    value={author.amazon_url}
                    onChange={(e) => setAuthor({amazon_url: e.target.value})}
                    name="name"
                    id="outlined-read-only-input"
                    InputProps={{
                        readOnly: false,
                    }}
                    sx={{ gridColumn: "span 1" }}
                />

                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="about"
                    value={author.about}
                    onChange={(e) => setAuthor({about: e.target.value})}
                    name="name"
                    id="outlined-read-only-input"
                    InputProps={{
                        readOnly: false,
                    }}
                    sx={{ gridColumn: "span 2" }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer width={300} components={['DateTimePicker', 'DateTimePicker']}>
                    {console.log(author.birth_date)}
                    <DemoItem label="birth date">
                    <DateTimePicker defaultValue={dayjs((author.birth_date))}
                    onChange={(newValue) => setAuthor({birth_date: newValue})} />
                    </DemoItem>
                      
                        </DemoContainer>
                    </LocalizationProvider>

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

export default EditAuthor;
