import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";

import { Formik } from 'formik';

const axios = require('axios')

export default function NewVideo() {
    const [file, setFile] = useState(null)
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)

    const getVideo = async () => {
        try {
            const result = await axios.get('api/video', { withCredentials: true })
            console.log(result.data)
            setVideo(result.data);
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => { getVideo(); }, [])

    const formStep = () => <Formik
        initialValues={{
            amount: ''
        }}
        onSubmit={async (values) => {
            if (!file) return

            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append("video", file, file.name);

            // Request made to the backend api
            // Send formData object
            try {
                var r = await axios.post('api/video', formData, { withCredentials: true });
                console.log(r.data)
                setVideo(r.data)
            } catch (error) {
                console.log(error.response.data)
            }
        }}
    >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
        }) => (
            <form onSubmit={handleSubmit}>

                <Typography
                    color="textPrimary"
                    variant="h4"
                >
                    New Video
                </Typography>

                <Button
                    component="label"
                    sx={{
                        m: 2
                    }}
                >
                    {file ? 'Change Chosen Video' : 'Choose Video For Upload'}
                    <input
                        type="file"
                        name="document"
                        hidden
                        onChange={e => { setFile(e.target.files[0]) }}
                    />
                </Button>

                <Typography>{file && file.name}</Typography>

                <Box sx={{ py: 2 }}>
                    <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        )}

    </Formik>

    const doneStep = () => <Formik
        initialValues={{
            filename: ''
        }}
        onSubmit={async () => {
            try {
                const result = await axios.patch('api/video', video, { withCredentials: true })
                console.log(result.data)
                setVideo(result.data);
            } catch (err) {
                console.log(err)
            }
        }}
    >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
        }) => (
            <form onSubmit={handleSubmit}>
                <Typography
                    color="textPrimary"
                    variant="h4"
                    sx={{
                        mb: 2
                    }}
                >
                    Video Uploaded!
                </Typography>

                <Box
                    // flex
                    sx={{
                        backgroundColor: '#eeeeee',
                        py: 5
                    }}
                >
                    <TextField
                        label="Filename"
                        value={video.filename}
                        name="filename"
                        onChange={(e) => {
                            setVideo({ ...video, filename: e.target.value })
                        }}
                    />

                    <Box sx={{ py: 2 }}>
                        <Button
                            color="primary"
                            type="submit"
                            variant="contained"
                            sx={{ mr: 2 }}
                        >
                            Save
                        </Button>
                        <Button
                            color="error"
                            type="submit"
                            variant="contained"
                            onClick={async () => {
                                try {
                                    await axios.delete('api/video', { withCredentials: true })
                                    setVideo(null);
                                } catch (err) {
                                    console.log(err)
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                    

                </Box>
            </form>
        )}
    </Formik>

    return loading ? 'loading...'
        : <Box
            sx={{
                mt: 2,
                textAlign: 'center'
            }}
        >
            {!video ? formStep() : doneStep()}
        </Box>

}
